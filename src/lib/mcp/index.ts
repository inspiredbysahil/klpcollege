import { defineMcp } from "@lovable.dev/mcp-js";
import collegeInfo from "./tools/college-info";
import listProgrammes from "./tools/list-programmes";
import listNotices from "./tools/list-notices";
import searchPages from "./tools/search-pages";
import getPage from "./tools/get-page";

export default defineMcp({
  name: "klp-college-elevate",
  title: "KLP College Elevate",
  version: "0.1.0",
  instructions:
    "Public information about Kishan Lal Public College, Rewari. Use get_college_info for contacts, list_programmes and list_notices for courses and notices, and search_college_pages then get_college_page for official admission, staff and academic details. Do not invent fees, deadlines or criteria.",
  tools: [collegeInfo, listProgrammes, listNotices, searchPages, getPage],
});
