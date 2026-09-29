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
