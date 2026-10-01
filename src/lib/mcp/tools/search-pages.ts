import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import pages from "@/content/official.json";
import { siteUrl } from "@/lib/college";

type Page = { section: string; slug: string; title: string; text: string };
const all = pages as Page[];

export default defineTool({
  name: "search_college_pages",
  title: "Search college pages",
  description: "Search the copied official college pages (admissions, staff, syllabus, IQAC and more) by keyword.",
  inputSchema: {
    query: z.string().trim().min(2).describe("Words to search for."),
    limit: z.number().int().min(1).max(10).optional().describe("Maximum results, default 5."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, limit }) => {
    const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
    const results = all
      .map((p) => {
        const hay = (p.title + " " + p.text).toLowerCase();
        const score = terms.reduce((s, t) => s + Math.min(hay.split(t).length - 1, 8) + (p.title.toLowerCase().includes(t) ? 5 : 0), 0);
        return { p, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit ?? 5)
      .map(({ p }) => ({ section: p.section, slug: p.slug, title: p.title, excerpt: p.text.slice(0, 400), url: `${siteUrl}/${p.section}/${p.slug}` }));
    return { content: [{ type: "text", text: results.length ? JSON.stringify(results, null, 2) : "No matching pages." }], structuredContent: { results } };
  },
});
