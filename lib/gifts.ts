/**
 * Short gift links: /g/maya-k3f9qz instead of a long code. The gift is stored as its encoded token
 * in the florii_gifts table. If that table isn't there yet, links fall back to packing the whole
 * gift into the URL, so sharing always works. Server only.
 */
import { randomBytes } from "node:crypto";
import { decode, unpack } from "@/app/gift/codec";
import type { Gift } from "@/app/gift/codec";
import { supabaseInsert, supabaseReady } from "./supabase";

const base = () => (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const key = () => process.env.SUPABASE_SECRET_KEY || "";

/** A stored link: a readable name slug and six random characters, e.g. "maya-k3f9qz". */
export const isStoredId = (code: string) => /^[a-z][a-z0-9-]{0,24}-[a-z0-9]{6}$/.test(code);

function slugFor(name: string) {
  const slug = name.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 20).replace(/-+$/, "");
  return /^[a-z]/.test(slug) ? slug : "gift";
}
const randomPart = () => Array.from(randomBytes(6), b => "abcdefghijkmnpqrstuvwxyz23456789"[b % 32]).join("");

export async function saveGift(token: string, gift: Gift): Promise<string | null> {
  if (!supabaseReady()) return null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const id = `${slugFor(gift.to)}-${randomPart()}`;
    if (await supabaseInsert("florii_gifts", { id, token })) return id;
  }
  return null;
}

async function loadToken(id: string): Promise<string | null> {
  if (!supabaseReady()) return null;
  try {
    const response = await fetch(`${base()}/rest/v1/florii_gifts?id=eq.${encodeURIComponent(id)}&select=token&limit=1`, { headers: { apikey: key(), Authorization: `Bearer ${key()}` }, next: { revalidate: 3600 } });
    if (!response.ok) return null;
    const rows = await response.json() as { token?: string }[];
    return rows[0]?.token ?? null;
  } catch { return null; }
}

/** Reads a gift from either kind of link. */
export async function resolveGift(code: string): Promise<Gift | null> {
  if (isStoredId(code)) { const token = await loadToken(code); return token ? decode(token) : null; }
  return unpack(code);
}
