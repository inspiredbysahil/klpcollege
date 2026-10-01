import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import pages from "@/content/official.json";
import { siteUrl } from "@/lib/college";

type Page = { section: string; slug: string; title: string; text: string; documents: { label: string; href: string }[] };
const all = pages as Page[];

export default defineTool({
  name: "get_college_page",
  title: "Get college page",
  description: "Return the full text and documents of one copied official college page by section and slug.",
  inputSchema: {
    section: z.string().min(1).describe("Page section, e.g. 'students'."),
    slug: z.string().min(1).describe("Page slug, e.g. 'admission-2026-27'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ section, slug }) => {
    const p = all.find((x) => x.section === section && x.slug === slug);
    if (!p) throw new ToolError(`No page found at ${section}/${slug}. Use search_college_pages first.`);
    const page = { title: p.title, url: `${siteUrl}/${p.section}/${p.slug}`, text: p.text.slice(0, 12000), documents: p.documents.map((d) => ({ label: d.label, href: d.href })) };
    return { content: [{ type: "text", text: `${page.title}\n${page.url}\n\n${page.text}` }], structuredContent: { page } };
  },
});
