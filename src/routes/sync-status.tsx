import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { PageIntro, SectionHeading } from '@/components/site-layout';
import { SyncBadge, timeAgo } from '@/components/sync-badge';
import { syncFeedQuery } from '@/lib/official-items.functions';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/sync-status')({
  loader: ({ context }) => context.queryClient.ensureQueryData(syncFeedQuery),
  head: () => seo({ title: 'Official Site Sync Status | K.L.P. College', description: 'When notices, tenders and admission circulars were last refreshed from the official K.L.P. College website.', path: '/sync-status' }),
  errorComponent: () => <section className="section"><div className="site-container"><h2>Sync status couldn’t load.</h2></div></section>,
  notFoundComponent: () => null,
  component: SyncStatus,
});

function SyncStatus() {
  const { data } = useSuspenseQuery(syncFeedQuery);
  const counts = ['notice', 'tender', 'admission'].map(k => [k, data.items.filter(i => i.kind === k).length] as const);
  return <>
    <PageIntro eyebrow="Automatic updates" title="Official site sync status" description="Notices, tenders and admission circulars are checked on klpcollege.ac.in every 6 hours."/>
    <section className="section"><div className="site-container">
      <SyncBadge/>
      <div className="sync-counts">{counts.map(([k, n]) => <div key={k}><strong>{n}</strong><span>{k === 'notice' ? 'Notices' : k === 'tender' ? 'Tenders' : 'Admission circulars'}</span></div>)}</div>
      <SectionHeading eyebrow="History" title="Recent checks"/>
      {data.runs.length === 0 ? <p className="body-copy">No checks have run yet.</p> :
        <div className="sync-table" role="table">{data.runs.map(r => <div role="row" key={r.started_at} className={r.ok ? '' : 'sync-row-warn'}>
          <span suppressHydrationWarning>{new Date(r.started_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} ({timeAgo(r.started_at)})</span>
          <span>{r.ok ? 'Succeeded' : r.finished_at ? 'Failed' : 'Running'}</span>
          <span>{r.found} found · {r.added} new</span>
          {r.error && <small>{r.error}</small>}
        </div>)}</div>}
    </div></section>
  </>;
}
