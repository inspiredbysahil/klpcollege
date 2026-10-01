import { supabaseAdmin } from '@/integrations/supabase/client.server';

const BASE = 'https://www.klpcollege.ac.in';
const SOURCES: { url: string; kind: 'notice' | 'tender' | 'admission' }[] = [
  { url: `${BASE}/`, kind: 'notice' },
  { url: `${BASE}/page/newsmedia`, kind: 'notice' },
  { url: `${BASE}/page/tenders-1`, kind: 'tender' },
  { url: `${BASE}/page/admission-1`, kind: 'admission' },
];

const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/&[a-z]+;/g, ' ');
const DATE = /(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/;

type Item = { kind: string; title: string; date_text: string | null; href: string; source_url: string };

export function parseItems(html: string, source: (typeof SOURCES)[number]): Item[] {
  const out: Item[] = [];
  const re = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    let href = decode(m[1]!.trim());
    if (!/\.(pdf|jpe?g|png)(\?|$)|\/upload\//i.test(href)) continue;
    try { href = new URL(href, source.url).toString(); } catch { continue; }
    if (!/^https:\/\/(www\.)?klpcollege\.ac\.in\//.test(href.replace(/^http:/, 'https:'))) continue;
    const title = decode(m[2]!.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim().slice(0, 300);
    if (title.length < 4 || /^(click here|download|view|read more)$/i.test(title)) continue;
    let kind: string = source.kind;
    if (kind === 'notice' && /admission/i.test(title)) kind = 'admission';
    if (kind === 'notice' && /tender|quotation/i.test(title)) kind = 'tender';
    out.push({ kind, title, date_text: title.match(DATE)?.[1] ?? null, href, source_url: source.url });
  }
  return out;
}

export async function runOfficialSync() {
  const { data: run } = await supabaseAdmin.from('sync_runs').insert({}).select('id').single();
  const errors: string[] = [];
  const items = new Map<string, Item>();
  for (const s of SOURCES) {
    try {
      const res = await fetch(s.url, { headers: { 'user-agent': 'KLP-site-sync/1.0' }, signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      for (const it of parseItems(await res.text(), s)) if (!items.has(it.href)) items.set(it.href, it);
    } catch (e) { errors.push(`${s.url}: ${(e as Error).message}`); }
  }
  const list = [...items.values()];
  let added = 0;
  if (list.length) {
    const { data: existing } = await supabaseAdmin.from('official_items').select('href').in('href', list.map(i => i.href));
    const known = new Set((existing ?? []).map(r => r.href));
    added = list.filter(i => !known.has(i.href)).length;
    const now = new Date().toISOString();
    const { error } = await supabaseAdmin.from('official_items').upsert(list.map(i => ({ ...i, last_seen: now })), { onConflict: 'href' });
    if (error) errors.push(`save: ${error.message}`);
  }
  const ok = list.length > 0 && errors.length < SOURCES.length;
  const result = { ok, found: list.length, added, error: errors.length ? errors.join('; ').slice(0, 1000) : null, finished_at: new Date().toISOString() };
  if (run) await supabaseAdmin.from('sync_runs').update(result).eq('id', run.id);
  return result;
}
