import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://floriii.vercel.app";

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin", "/api/", "/g/"];
  // search engines and AI assistants are welcome to read and cite florii
  const ai = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot", "Bingbot", "DuckAssistBot", "Amazonbot", "Meta-ExternalAgent"];
  return { rules: [{ userAgent: "*", allow: "/", disallow }, { userAgent: ai, allow: ["/", "/llms.txt", "/llms-full.txt"], disallow }], ...(site ? { sitemap: site.replace(/\/$/, "") + "/sitemap.xml" } : {}) };
}
