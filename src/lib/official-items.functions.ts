import { createServerFn } from '@tanstack/react-start';
import { queryOptions } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

export type SyncedItem = { kind: string; title: string; date_text: string | null; href: string; first_seen: string };
export type SyncRun = { started_at: string; finished_at: string | null; ok: boolean; found: number; added: number; error: string | null };
export type SyncFeed = { items: SyncedItem[]; lastRun: SyncRun | null; lastSuccess: string | null; runs: SyncRun[] };

export const getSyncFeed = createServerFn({ method: 'GET' }).handler(async (): Promise<SyncFeed> => {
  const empty: SyncFeed = { items: [], lastRun: null, lastSuccess: null, runs: [] };
  try {
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'] ?? process.env['SUPABASE_ANON_KEY'];
    const url = process.env['SUPABASE_URL'];
    if (!key || !url) return empty;
    const db = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => { const h = new Headers(init?.headers); if (key.startsWith('sb_') && h.get('Authorization') === `Bearer ${key}`) h.delete('Authorization'); h.set('apikey', key); return fetch(input, { ...init, headers: h }); } },
    });
    // Run history is not publicly readable; only safe summary fields are returned (no error details).
    const { supabaseAdmin: admin } = await import('@/integrations/supabase/client.server');
    const [items, runs, success] = await Promise.all([
      db.from('official_items').select('kind,title,date_text,href,first_seen').order('first_seen', { ascending: false }).limit(150),
      admin.from('sync_runs').select('started_at,finished_at,ok,found,added').order('started_at', { ascending: false }).limit(10),
      admin.from('sync_runs').select('finished_at').eq('ok', true).order('started_at', { ascending: false }).limit(1),
    ]);
    return { items: items.data ?? [], runs: (runs.data ?? []).map(r => ({ ...r, error: null })), lastRun: runs.data?.[0] ? { ...runs.data[0], error: null } : null, lastSuccess: success.data?.[0]?.finished_at ?? null };
  } catch (e) {
    console.error('sync feed', e);
    return empty;
  }
});

export const syncFeedQuery = queryOptions({ queryKey: ['sync-feed'], queryFn: () => getSyncFeed(), staleTime: 5 * 60_000 });
