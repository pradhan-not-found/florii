import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://floriii.vercel.app").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ["/", "/flowers", "/docs", "/about", "/privacy"].map((path, index) => ({ url: site + path, lastModified: now, changeFrequency: "weekly", priority: index === 0 ? 1 : 0.7 }));
}
