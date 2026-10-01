import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageIntro, SectionHeading } from '@/components/site-layout';
import { college, officialLinks, programmeRules, programmes } from '@/lib/college';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/programmes/$slug')({ staticData: { sitemap: true },
  loader: ({ params }) => {
    const programme = programmes.find((p) => p.slug === params.slug);
    if (!programme) throw notFound();
    return { programme };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: 'Programme not found | K.L.P. College' }, { name: 'robots', content: 'noindex' }] };
    const p = loaderData.programme;
    return seo({
      title: `${p.name} | K.L.P. College, Rewari`,
      description: `${p.name} — ${p.level.toLowerCase()} programme in ${p.stream} at Kishan Lal Public College, Rewari. Eligibility, duration and official admission links.`,
      path: `/programmes/${params.slug}`,
    });
  },
  notFoundComponent: ProgrammeNotFound,
  component: ProgrammePage,
});

function ProgrammeNotFound() {
  return <section className="section"><div className="site-container"><SectionHeading eyebrow="Programmes" title="Programme not found." description="This programme is not listed. Browse all programmes offered by the college."/><Button asChild size="lg"><Link to="/academics">All programmes <ArrowUpRight size={17}/></Link></Button></div></section>;
}

function ProgrammePage() {
  const { programme: p } = Route.useLoaderData();
  const related = programmes.filter((x) => x.stream === p.stream && x.slug !== p.slug);
  return <>
    <PageIntro eyebrow={`${p.level} · ${p.stream}`} title={p.name} description="Offered at Kishan Lal Public College, Rewari, affiliated with Indira Gandhi University, Meerpur."/>
    <section className="section"><div className="site-container">
      <div className="programme-facts">
        <div><small>Level</small><strong>{p.level}</strong></div>
        <div><small>Field of study</small><strong>{p.stream}</strong></div>
        <div><small>Affiliation</small><strong>IGU, Meerpur</strong></div>
      </div>
      <SectionHeading eyebrow="Eligibility & duration" title="Confirm the current requirements."/>
      <div className="programme-facts"><div><small>Eligibility</small><strong>{p.eligibility || 'Confirm with admissions'}</strong></div><div><small>Duration</small><strong>{p.duration || 'Confirm with admissions'}</strong></div></div>
      <p className="programme-note">{p.historical ? 'The information above is from a historical course page and may have changed.' : 'The official course listing does not confirm current eligibility or duration for this programme.'} Check the latest official admission notice or contact the college before applying. {p.source && <a href={p.source} target="_blank" rel="noopener noreferrer">View course source <ArrowUpRight size={14}/></a>}</p>
      <SectionHeading eyebrow="Academic rules" title="What every student should know."/>
      <ul className="programme-list">{programmeRules.items.map((r) => <li key={r}>{r}</li>)}</ul>
      <div className="academic-actions">
        <Button asChild size="lg"><a href={officialLinks.admission}>Official admission information <ArrowUpRight size={17}/></a></Button>
        <Button asChild variant="outline" size="lg"><Link to="/compare" search={{ programmes: p.slug }}>Compare programmes <ArrowUpRight size={17}/></Link></Button>
        <Button asChild variant="outline" size="lg"><a href={officialLinks.fees}>Fee structure <ArrowUpRight size={17}/></a></Button>
        <Button asChild variant="outline" size="lg"><a href={`tel:${college.phone.replaceAll('-', '')}`}>Call {college.phone}</a></Button>
      </div>
    </div></section>
    {related.length > 0 && <section className="section section-muted"><div className="site-container"><SectionHeading eyebrow="Related programmes" title={`More in ${p.stream}`}/><div className="link-stack">{related.map((r) => <Link key={r.slug} to="/programmes/$slug" params={{ slug: r.slug }}>{r.name}<ArrowUpRight size={19}/></Link>)}</div></div></section>}
  </>;
}
