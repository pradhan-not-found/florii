import { NextResponse } from "next/server";
import { supabaseSelect } from "@/lib/supabase";

/**
 * The sponsors shown on the site: only paid sponsors who are on the site, and only their brand name and link.
 * No email, phone, address or payment details ever leave the server.
 */
export const dynamic = "force-dynamic";

type Row = { product?: string; link?: string };
let recent: { list: { name: string; link: string }[]; at: number } | null = null;

export async function GET() {
  if (!recent || Date.now() - recent.at > 15_000) {
    const rows = await supabaseSelect<Row>("florii_sponsors", "select=product,link&featured=eq.true&status=eq.featured&order=paid_at.asc&limit=21");
    const list = rows.flatMap(row => {
      const name = String(row.product || "").trim().slice(0, 60);
      let link = "";
      try { const url = new URL(String(row.link || "")); if (url.protocol === "https:" || url.protocol === "http:") link = url.href; } catch { /* no link */ }
      return name ? [{ name, link }] : [];
    });
    recent = { list, at: Date.now() };
  }
  return NextResponse.json({ sponsors: recent.list }, { headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60" } });
}
