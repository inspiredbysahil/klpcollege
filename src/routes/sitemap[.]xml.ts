import { createFileRoute } from "@tanstack/react-router";
import { getRouterInstance } from "@tanstack/react-start";
import { isSitemapRouteIncluded, sitemapPathForLocation, sitemapStaticPaths, sitemapXML, type SitemapEntry } from "@/lib/sitemap";
import { programmes } from "@/lib/college";
import { officialIndex } from "@/content/official-index";

const BASE_URL = "https://klpcollege.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        const router = await getRouterInstance();
        const entries: SitemapEntry[] = sitemapStaticPaths(router).map((path) => ({ path }));
        const progId = "/programmes/$slug";
        if (isSitemapRouteIncluded(router.routesById[progId])) {
          for (const p of programmes) {
            const loc = router.buildLocation({ to: "/programmes/$slug", params: { slug: p.slug }, search: () => ({}), hash: "" });
            const path = sitemapPathForLocation(router, loc, progId);
            if (path) entries.push({ path });
          }
        }
        const pageId = "/$section/$page";
        if (isSitemapRouteIncluded(router.routesById[pageId])) {
          for (const p of officialIndex.filter((e) => !e.empty)) {
            const loc = router.buildLocation({ to: "/$section/$page", params: { section: p.section, page: p.slug }, search: () => ({}), hash: "" });
            const path = sitemapPathForLocation(router, loc, pageId);
            if (path) entries.push({ path });
          }
        }
        return new Response(sitemapXML(BASE_URL, entries), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
