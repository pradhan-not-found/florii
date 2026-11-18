import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://floriii.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/g/"] }], ...(site ? { sitemap: site.replace(/\/$/, "") + "/sitemap.xml" } : {}) };
}
