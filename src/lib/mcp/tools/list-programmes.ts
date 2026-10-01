import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { programmes, siteUrl } from "@/lib/college";

export default defineTool({
  name: "list_programmes",
  title: "List degree programmes",
  description: "List the college's degree programmes, optionally filtered by level, with links to each programme page.",
  inputSchema: { level: z.enum(["Undergraduate", "Postgraduate"]).optional().describe("Only return programmes at this level.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ level }) => {
    const items = programmes.filter((p) => !level || p.level === level).map((p) => ({
      name: p.name,
      level: p.level,
      field: p.stream,
      eligibility: p.eligibility ?? null,
      duration: p.duration ?? null,
      historicalCriteria: Boolean(p.historical),
      url: `${siteUrl}/programmes/${p.slug}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) + "\n\nEligibility and duration may be historical; confirm with the current admission notice." }],
      structuredContent: { programmes: items },
    };
  },
});
