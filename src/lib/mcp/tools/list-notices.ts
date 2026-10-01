import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notices, noticeCategories } from "@/lib/college";

export default defineTool({
  name: "list_notices",
  title: "List latest notices",
  description: "List the college's latest published notices, optionally filtered by category.",
  inputSchema: { category: z.enum(noticeCategories as unknown as [string, ...string[]]).optional().describe("Notice category to filter by.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category }) => {
    const items = notices.filter((n) => !category || n.category === category).map((n) => ({ title: n.title, date: n.date, category: n.category, document: n.href }));
    return { content: [{ type: "text", text: JSON.stringify(items, null, 2) }], structuredContent: { notices: items } };
  },
});
