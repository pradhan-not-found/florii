import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://floriii.vercel.app").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: [string, number, "weekly" | "monthly"][] = [["/", 1, "weekly"], ["/flowers", 0.9, "weekly"], ["/docs", 0.9, "weekly"], ["/gift", 0.8, "weekly"], ["/sponsor", 0.5, "monthly"], ["/about", 0.5, "monthly"], ["/privacy", 0.3, "monthly"], ["/terms", 0.3, "monthly"], ["/refunds", 0.3, "monthly"], ["/contact", 0.3, "monthly"]];
  return pages.map(([path, priority, changeFrequency]) => ({ url: site + path, lastModified: now, changeFrequency, priority, ...(path === "/" ? { images: [site + "/og/home.png"] } : {}) }));
}
