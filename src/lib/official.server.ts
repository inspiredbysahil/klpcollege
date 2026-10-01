import pages from '@/content/official.json';
import { college, programmes } from './college';

export type OfficialPage = { section: string; slug: string; label: string; title: string; html: string; text: string; documents: { label: string; href: string }[]; sourceUrl: string; fetchedAt: string };
const all = pages as OfficialPage[];

export function findOfficialPage(section: string, slug: string) {
  return all.find(p => p.section === section && p.slug === slug) ?? null;
}

const STOP = new Set('the a an and or of for to in on is are what which how can i my me do does with about at be it this that kya hai ke ki'.split(' '));
const PRIORITY = ['students/admission-2026-27', 'students/programmes-at-a-glance', 'academics/regular-courses', 'academics/self-finance-courses'];

export function buildContext(question: string) {
  const terms = question.toLowerCase().split(/[^a-z0-9.]+/).filter(t => t.length > 2 && !STOP.has(t));
  const scored = all.filter(p => p.text.length > 40).map(p => {
    const hay = (p.label + ' ' + p.text).toLowerCase();
    let score = 0;
    for (const t of terms) { const n = hay.split(t).length - 1; score += Math.min(n, 8) + (p.label.toLowerCase().includes(t) ? 6 : 0); }
    if (PRIORITY.includes(`${p.section}/${p.slug}`)) score += 3;
    return { p, score };
  }).sort((a, b) => b.score - a.score).slice(0, 6).map(x => x.p);
  const facts = `College: ${college.name} (${college.shortName}), ${college.address}. Phone ${college.phone}. Email ${college.email}. Online application portal: ${college.apply}. Admission query numbers listed on the official admission page.\nProgrammes: ${programmes.map(p => `${p.name} [${p.level}, ${p.stream}${p.eligibility ? `; eligibility: ${p.eligibility}` : ''}${p.duration ? `; duration: ${p.duration}` : ''}] page /programmes/${p.slug}`).join('; ')}`;
  const docs = scored.map(p => `### ${p.label} (in-site page: /${p.section}/${p.slug})\n${p.text.slice(0, 3500)}`).join('\n\n');
  return `${facts}\n\n${docs}`;
}
