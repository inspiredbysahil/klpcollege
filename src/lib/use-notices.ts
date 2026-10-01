import { useQuery } from '@tanstack/react-query';
import { notices as fallback } from '@/lib/college';
import { syncFeedQuery } from '@/lib/official-items.functions';

export type NoticeItem = { title: string; date: string; href: string; category: string };

const cat = (kind: string, title: string) => kind === 'admission' ? 'Admission' : kind === 'tender' ? 'Tender' : /exam|result|admit|practical/i.test(title) ? 'Examination' : 'Notice';

/** Synced official items first, static snapshot notices as fallback. */
export function useNotices(): NoticeItem[] {
  const { data } = useQuery(syncFeedQuery);
  const synced = (data?.items ?? []).map(i => ({ title: i.title, date: i.date_text ?? 'Official site', href: i.href, category: cat(i.kind, i.title) }));
  const seen = new Set(synced.map(s => s.href));
  return [...fallback.filter(n => !seen.has(n.href)), ...synced];
}
