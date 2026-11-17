import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const site = process.env.NEXT_PUBLIC_SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/" }], ...(site ? { sitemap: site.replace(/\/$/, "") + "/sitemap.xml" } : {}) };
}
