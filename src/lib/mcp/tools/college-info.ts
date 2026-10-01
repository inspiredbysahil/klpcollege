import { defineTool } from "@lovable.dev/mcp-js";
import { college, siteUrl } from "@/lib/college";

export default defineTool({
  name: "get_college_info",
  title: "Get college information",
  description: "Return Kishan Lal Public College's verified address, contact details, affiliation and application portal.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const info = {
      name: college.name,
      shortName: college.shortName,
      established: 1964,
      affiliation: "Indira Gandhi University, Meerpur",
      management: "Public Education Board, Rewari",
      address: college.address,
      phone: college.phone,
      email: college.email,
      applicationPortal: college.apply,
      website: siteUrl,
    };
    return { content: [{ type: "text", text: JSON.stringify(info, null, 2) }], structuredContent: { college: info } };
  },
});
