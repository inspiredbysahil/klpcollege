# In-site college content, programme Q&A assistant, and image fallbacks

## Goal
Visitors stay on this website for everything: section pages, staff lists, academic details and PDFs open inside the site. The site also gets a question assistant for programmes and admissions, and the crest and hero photo keep showing if their links fail.

## 1. Image fallbacks
- Save local copies of the college crest and the campus building photo in the project.
- Header crest, footer crest and homepage photo try the current image first. If it fails, they switch to the local copy once, so nothing shows as blank.

## 2. Official content brought into the site
- Take a one-time copy of every page linked from the official menus (About, Students, Academics, Faculty, Gallery, Activities, Notices, IQAC, Alumni, Tenders, Contact). Save the text, tables (such as teaching and non-teaching staff lists) and the PDF/document links on each page.
- Each menu item gets its own page on this site (for example `/about/history`, `/faculty/teaching-staff`, `/academics/syllabus`). It shows the copied content in the site's design. Section directory cards link to these pages instead of the official site.
- **In-site PDF viewer:** notice, syllabus, fee and staff PDFs open on a viewer page inside the site (`/documents?src=...`). The viewer has a title, a back link, download and open-full-screen buttons. A fallback message appears if a browser can't show the PDF inline. PDFs are passed through this site, so the official address never opens.
- Every copied page shows a small "Source: official college website, copied on <date>" note at the bottom. Content is never invented. Where a page on the official site is empty, the page says so clearly.
- Menus stay organised the same way (desktop dropdowns, expandable mobile menu), now pointing to the in-site pages.

## 3. "Ask about programmes & admissions" assistant
- New page `/ask` plus a floating "Ask a question" button on every page. Students type a question and get a streamed answer, with suggested starter questions and clear loading, error and "limit reached" messages.
- Answers come only from the copied official content (programmes, admissions, fees, eligibility, contacts). Each answer lists the in-site pages it used. If the answer isn't in that content, the assistant says so and points to the admissions phone numbers.
- No accounts or saved chat history. Conversations last for the browser session only.

## Technical details
- Content snapshot: a sandbox script crawls the official menus and writes structured JSON (`src/content/official/*.json`: title, slug, section, blocks, tables, documents, sourceUrl, fetchedAt). It is rendered by one shared `OfficialPage` component and a dynamic route `/$section/$page`. `sectionLinks` in `college.ts` maps menu items to in-site slugs. Record this in AGENTS.md.
- PDF proxy: server route `src/routes/api/public/doc.ts` streams PDFs only from the `klpcollege.ac.in` hosts (allowlist, content-type check, size cap, caching headers). The viewer embeds it in an `<iframe>`.
- Image fallback: a small `FallbackImg` component with `onError` that swaps to the bundled asset import.
- Assistant: `createServerFn` that streams through the Lovable AI Gateway Responses API with `openai/gpt-6-astra` (store:false, reasoning options as required). Context is the relevant snapshot pages, picked by keyword scoring and included in the system prompt with page slugs for citations. The client renders markdown with `react-markdown`. Gateway errors such as 429 and 402 appear as friendly messages. `LOVABLE_API_KEY` will be set up if it's missing. No database is needed.
- Each new page gets its own SEO tags through `seo()`. All routes are checked at 1440/390/320px, along with PDF viewing, fallback behaviour (simulated broken image URL) and a live assistant question plus a follow-up question.
