import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { ArrowUpRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageIntro, SectionHeading } from '@/components/site-layout';
import { college, officialLinks, programmes } from '@/lib/college';
import { seo } from '@/lib/seo';

const MAX = 4;
const initial = (search: Record<string, unknown>) => typeof search['programmes'] === 'string'
  ? [...new Set(search['programmes'].split(','))].filter(slug => programmes.some(p => p.slug === slug)).slice(0, MAX)
  : [];

export const Route = createFileRoute('/compare')({
  validateSearch: (search: Record<string, unknown>): { programmes?: string } => typeof search['programmes'] === 'string' ? { programmes: search['programmes'] } : {},
  head: () => seo({ title: 'Compare Programmes | K.L.P. College, Rewari', description: 'Compare K.L.P. College programmes by study level, eligibility, duration and official admission links. Check current requirements before applying.', path: '/compare' }),
  component: Compare,
});

function Compare() {
  const { programmes: query } = Route.useSearch();
  const navigate = useNavigate();
  const selected = initial({ programmes: query });
  const chosen = selected.flatMap(slug => { const p = programmes.find(item => item.slug === slug); return p ? [p] : []; });
  const toggle = (slug: string) => {
    const next = selected.includes(slug) ? selected.filter(value => value !== slug) : selected.length < MAX ? [...selected, slug] : selected;
    void navigate({ to: '/compare', search: { programmes: next.join(',') }, replace: true });
  };
  return <>
    <PageIntro eyebrow="Academics / Compare" title="Compare programmes" description="Set degree options side by side before exploring the current admission requirements." />
    <section className="section"><div className="site-container">
      <SectionHeading eyebrow="Select programmes" title="Find your direction." description="Choose up to four programmes to compare. Share this page to keep your selection." />
      <div className="compare-picker" role="group" aria-label="Choose programmes">
        {programmes.map(p => <label key={p.slug} className="compare-option"><input type="checkbox" checked={selected.includes(p.slug)} disabled={!selected.includes(p.slug) && selected.length >= MAX} onChange={() => toggle(p.slug)} /><span>{p.name}<small>{p.level}</small></span></label>)}
      </div>
      <p className="compare-count" role="status">{selected.length} of {MAX} selected{selected.length >= MAX ? ' · Remove one to choose another.' : ''}</p>
    </div></section>
    <section className="section section-muted"><div className="site-container">
      <div className="section-top"><SectionHeading eyebrow="Side by side" title="Your comparison" />{selected.length > 0 && <Button variant="ghost" onClick={() => { void navigate({ to: '/compare', search: { programmes: '' }, replace: true }); }}>Clear selection <X size={15}/></Button>}</div>
      {chosen.length === 0 ? <p className="programme-note">Select a programme above to start comparing eligibility, duration and admission options.</p> : <>
        <div className="compare-scroll" tabIndex={0} aria-label="Programme comparison; scroll horizontally on smaller screens"><div className="compare-table" style={{ '--compare-columns': chosen.length } as React.CSSProperties}>
          <div className="compare-label compare-heading">Programme</div>{chosen.map(p => <div className="compare-cell compare-heading" key={p.slug}><Link to="/programmes/$slug" params={{ slug: p.slug }}>{p.name} <ArrowUpRight size={15}/></Link><Button variant="ghost" size="icon" aria-label={`Remove ${p.name}`} onClick={() => toggle(p.slug)}><X size={15}/></Button></div>)}
          <div className="compare-label">Level</div>{chosen.map(p => <div className="compare-cell" key={p.slug}>{p.level}</div>)}
          <div className="compare-label">Field of study</div>{chosen.map(p => <div className="compare-cell" key={p.slug}>{p.stream}</div>)}
          <div className="compare-label">Eligibility</div>{chosen.map(p => <div className="compare-cell" key={p.slug}>{p.eligibility || 'Confirm with admissions'}{p.source && <a className="compare-source" href={p.source} target="_blank" rel="noopener noreferrer">Historical course source <ArrowUpRight size={13}/></a>}</div>)}
          <div className="compare-label">Duration</div>{chosen.map(p => <div className="compare-cell" key={p.slug}>{p.duration || 'Confirm with admissions'}</div>)}
          <div className="compare-label">Admissions</div>{chosen.map(p => <div className="compare-cell" key={p.slug}><a href={officialLinks.admission} target="_blank" rel="noopener noreferrer">Current admission details <ArrowUpRight size={14}/></a><a className="compare-source" href={college.apply} target="_blank" rel="noopener noreferrer">Haryana application portal <ArrowUpRight size={13}/></a></div>)}
        </div></div>
        <p className="compare-disclaimer">Historical course information may not reflect the current session. Confirm eligibility and duration in the latest official admission notice before applying.</p>
      </>}
    </div></section>
  </>;
}
