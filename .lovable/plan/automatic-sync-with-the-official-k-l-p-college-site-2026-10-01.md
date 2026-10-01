# Automatic sync with the official K.L.P. College site

## What visitors and staff will see
- **Notices, tenders and admission circulars** on this site refresh automatically from klpcollege.ac.in every 6 hours. New PDFs open in the in-site document viewer, as now.
- The homepage ticker, notice desk, tenders page and admission page show the latest synced items first; the current copied content stays as the fallback if a sync fails.
- A **sync status badge** ("Updated from the official site 2 hours ago", or a warning if the last check failed) appears on the notice desk, tenders and admission pages, plus a small status panel at `/sync-status` listing the last run, items found and any errors.
- Nothing is invented: only titles, dates and links actually found on the official pages are saved.

## How it works
```text
every 6 h  ->  sync job fetches official notice / tender / admission pages
           ->  extracts items (title, date, PDF link, category)
           ->  saves new or changed items, records the run result
site pages ->  read saved items + last run  ->  ticker, lists, badge
```

## Limits to know
- This is a scheduled check, not instant: changes appear within about 6 hours.
- If the official site changes its layout, the sync logs an error and the badge turns amber; the site keeps showing the last good data.
- The status panel is public and read-only (shows only times and counts). A staff login can be added later if you want it private.

## Technical details
- Migration: `official_items` (id, kind notice|tender|admission, title, date_text, published_on, href unique, source_url, first_seen, last_seen) and `sync_runs` (started_at, finished_at, ok, found, added, error). GRANT SELECT to anon/authenticated, ALL to service_role; RLS with public SELECT only. Seed existing `notices` from `college.ts` as initial rows.
- `src/lib/sync.server.ts`: fetch + parse official listing pages (news-media, tenders, admission page) with a lightweight HTML parser (worker-safe), allowlist klpcollege.ac.in, upsert via admin client.
- Server route `src/routes/api/public/hooks/sync-official.ts` (POST), protected with `authenticateCronRequest` (LOVABLE_CRON_SECRET); pg_cron + pg_net job every 6 h calling the stable production URL.
- `src/lib/official-items.functions.ts`: public read server fn (publishable client) returning latest items per kind and last run; used via route loaders + React Query on index, notices, more/tenders, students/admission-2026-27 and new `/sync-status` route; falls back to static `college.ts` / snapshot data on empty or error.
- `SyncBadge` component in shared layout styles; MCP `list_notices` reads the same source.
- Record the sync architecture rule in AGENTS.md; verify with a manual run and Playwright check.
