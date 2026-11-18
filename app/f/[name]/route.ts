import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server.edge";
import { Botanical, botanicalCatalog } from "@/packages/florii/src";
import type { BotanicalName } from "@/packages/florii/src";
import { MINUTE, guard } from "@/lib/guard";

/**
 * Every flower as a plain SVG file, so it can be used anywhere, React or not:
 *   <img src="https://floriii.vercel.app/f/rose.svg?color=%23e94a78&size=160" alt="Rose">
 * Options: color, secondary (CSS colours), size (16 to 1024), variant (doodle or filled).
 */
const byFile = new Map(botanicalCatalog.map(item => [item.id.toLowerCase(), item.id as BotanicalName]));
const colour = (value: string | null) => (value && /^(#[0-9a-f]{3,8}|[a-z]{3,20}|(rgb|hsl)a?\([\d\s.,%]+\))$/i.test(value) ? value : undefined);

export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) {
  const blocked = guard(request, "flower-file", { limit: 600, windowMs: 10 * MINUTE }); if (blocked) return blocked;
  const file = (await params).name.toLowerCase().replace(/\.svg$/, "").replace(/[^a-z]/g, "");
  const name = byFile.get(file);
  if (!name) return new Response("Flower not found. See https://floriii.vercel.app/flowers for every name.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  const query = new URL(request.url).searchParams;
  const size = Math.min(1024, Math.max(16, Number(query.get("size")) || 120));
  const markup = renderToStaticMarkup(createElement(Botanical, {
    name, size, title: botanicalCatalog.find(item => item.id === name)?.name ?? name,
    color: colour(query.get("color")), secondaryColor: colour(query.get("secondary")),
    variant: query.get("variant") === "filled" ? "filled" : "doodle", filterId: `f-${file}`,
  }));
  // add the namespace only when the markup doesn't already carry it (a duplicate attribute is invalid XML)
  const svg = /^<svg[^>]*\sxmlns=/.test(markup) ? markup : markup.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=86400, s-maxage=2592000, immutable",
      "Access-Control-Allow-Origin": "*", "X-Content-Type-Options": "nosniff",
    },
  });
}
