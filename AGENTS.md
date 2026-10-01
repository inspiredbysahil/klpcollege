<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep public college facts and outbound official links in `src/lib/college.ts`; this prevents conflicting or invented institutional information across pages.
- Use the shared `SiteLayout` and page-intro components for public routes; this keeps navigation and presentation consistent.
- Build route head() metadata with `seo()` from `src/lib/seo.ts`; keeps canonical, Open Graph and Twitter previews consistent.
- Keep comparison criteria and official section-directory destinations in `src/lib/college.ts`; this preserves a single, source-aware record across programme and service pages.
- Official-site content lives as a generated snapshot in `src/content/official.json` (server-only, read via `src/lib/official.server.ts`) plus `official-index.ts` for navigation, rendered by the `/$section/$page` route; keeps visitors on this site without hand-copying pages.
- Official documents and images are served through `/api/public/doc` (klpcollege.ac.in allowlist) and viewed on `/documents`; never link visitors straight to official PDFs.
- The admissions assistant (`/api/ask`) answers only from the snapshot context built in `official.server.ts`; keeps answers grounded and citeable.
- Keep homepage motion in `src/components/portal-motion.tsx` and shared chrome in `SiteLayout`; centralizing reduced-motion behavior and navigation prevents page-to-page drift.
- Gallery cards derive from the official photo snapshot in `src/content/gallery-index.json`; this keeps the lightbox tied to actual college images rather than invented media.
