import { createFileRoute, Link, notFound, useRouter } from '@tanstack/react-router';
import { ArrowLeft, FileText } from 'lucide-react';
import { PageIntro } from '@/components/site-layout';
import { officialIndex } from '@/content/official-index';
import { getOfficialPage } from '@/lib/official.functions';
import { docHref, pagesInSection, sectionHome, sectionTitles } from '@/lib/official-nav';
import { seo } from '@/lib/seo';
import { SyncBadge } from '@/components/sync-badge';

export const Route = createFileRoute('/$section/$page')({ staticData: { sitemap: true },
  loader: async ({ params }) => {
    if (!officialIndex.some(p => p.section === params.section && p.slug === params.page)) throw notFound();
    const page = await getOfficialPage({ data: { section: params.section, slug: params.page } });
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData, params }) => loaderData
    ? seo({ title: `${loaderData.title} | K.L.P. College, Rewari`, description: `${loaderData.title} — ${sectionTitles[params.section] ?? 'College'} information from Kishan Lal Public College, Rewari.`, path: `/${params.section}/${params.page}` })
    : { meta: [{ title: 'Page not found | K.L.P. College' }, { name: 'robots', content: 'noindex' }] },
  errorComponent: ({ reset }) => { const router = useRouter(); return <section className="section"><div className="site-container"><h2>This page couldn’t load.</h2><button className="text-link" onClick={() => { router.invalidate(); reset(); }}>Try again</button></div></section>; },
  component: OfficialPageView,
});

function OfficialPageView() {
  const page = Route.useLoaderData();
  const { section } = Route.useParams();
  const siblings = pagesInSection(section);
  const inlineDocs = page.documents.length > 0 && page.documents.length <= 60;
  return <>
    <PageIntro eyebrow={sectionTitles[section] ?? 'College'} title={page.title} description="Information from the official K.L.P. College website, presented here for easy reading." />
    <section className="section"><div className="site-container official-layout">
      <aside className="official-aside" aria-label={`${sectionTitles[section]} pages`}>
        <Link to={sectionHome[section] ?? '/'} className="official-back"><ArrowLeft size={15}/> All {sectionTitles[section]?.toLowerCase()} pages</Link>
        <nav>{siblings.map(s => <Link key={s.slug} to="/$section/$page" params={{ section, page: s.slug }} activeProps={{ className: 'official-active' }}>{s.label}</Link>)}</nav>
      </aside>
      <article className="official-body">
        {['tenders', 'admission-2026-27', 'news-media'].includes(page.slug) && <SyncBadge/>}
        {page.empty ? <div className="official-empty"><h2>No details published yet</h2><p>The official college website does not currently show content on this page. Please check again later or contact the college office.</p></div>
          : <div className="official-prose" dangerouslySetInnerHTML={{ __html: page.html }} />}
        {inlineDocs && <div className="official-docs"><h2>Documents</h2><ul>{page.documents.map(d => <li key={d.href}><a href={docHref(d.href, d.label)}><FileText size={17}/><span>{d.label}</span></a></li>)}</ul></div>}
        <p className="official-source">Source: official college website, copied on {page.fetchedAt}. Details can change — confirm important dates with the college office.</p>
      </article>
    </div></section>
  </>;
}
