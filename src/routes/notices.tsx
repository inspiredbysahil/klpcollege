import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageIntro, SectionHeading } from '@/components/site-layout';
import { noticeCategories, officialLinks } from '@/lib/college';
import { useNotices } from '@/lib/use-notices';
import { SyncBadge } from '@/components/sync-badge';
import { syncFeedQuery } from '@/lib/official-items.functions';
import { docHref } from '@/lib/official-nav';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/notices')({ staticData: { sitemap: true },
  validateSearch: (s: Record<string, unknown>): { q?: string | undefined; category?: string | undefined } => ({
    q: typeof s['q'] === 'string' && s['q'] ? s['q'] : undefined,
    category: typeof s['category'] === 'string' && s['category'] ? s['category'] : undefined,
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(syncFeedQuery).catch(() => null),
  head: () => seo({ title: 'Notice Desk | K.L.P. College, Rewari', description: 'Search admission, examination and campus notices from K.L.P. College, Rewari, and access the official announcements archive.', path: '/notices' }),
  component: Notices,
});

function Notices() {
  const { q = '', category } = Route.useSearch();
  const notices = useNotices();
  const navigate = useNavigate({ from: '/notices' });
  const active = noticeCategories.find(c => c === category);
  const term = q.trim().toLowerCase().slice(0, 100);
  const results = notices.filter(n => (!active || n.category === active) && (!term || `${n.title} ${n.category}`.toLowerCase().includes(term)));
  const setCategory = (c?: string) => navigate({ search: prev => ({ ...prev, category: c }), replace: true });
  return <><PageIntro eyebrow="Notice desk" title="Stay informed." description="Search admission, examination and campus updates from Kishan Lal Public College."/><section className="section"><div className="site-container notices-page-grid"><div><SectionHeading eyebrow="Selected notices" title="Latest from the college."/><SyncBadge/><p className="body-copy">These notices were published on the official website. For the most current updates, use the official announcements archive.</p><Button asChild variant="outline" size="lg"><a href={officialLinks.notices}>Official notice archive <ArrowUpRight size={17}/></a></Button></div><div>
    <label htmlFor="notice-search" className="sr-only">Search notices</label>
    <input id="notice-search" type="search" className="notice-search" placeholder="Search notices…" value={q} onChange={e => navigate({ search: prev => ({ ...prev, q: e.target.value || undefined }), replace: true })}/>
    <div className="notice-filters" role="group" aria-label="Filter by category">
      <Button size="sm" variant={!active ? 'default' : 'outline'} aria-pressed={!active} onClick={() => setCategory(undefined)}>All</Button>
      {noticeCategories.map(c => <Button key={c} size="sm" variant={active === c ? 'default' : 'outline'} aria-pressed={active === c} onClick={() => setCategory(c)}>{c === 'Notice' ? 'General' : c}</Button>)}
    </div>
    <p className="sr-only" aria-live="polite">{results.length} notices found</p>
    <div className="notice-list">{results.length === 0 ? <p className="notice-empty">No notices match your search. Try another category or check the <a className="text-link" href={officialLinks.notices}>official archive</a>.</p> : results.map((notice, index) => <a key={notice.href} href={docHref(notice.href, notice.title)} className="notice-row"><span className="notice-index">{String(index+1).padStart(2,'0')}</span><span className="notice-main"><small>{notice.category === 'Notice' ? 'General' : notice.category} · {notice.date}</small><strong>{notice.title}</strong></span><ArrowUpRight size={19}/></a>)}</div>
  </div></div></section></>;
}
