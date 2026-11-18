/**
 * The gift format, shared by the browser and the server. A gift is a small JSON object,
 * written as URL-safe base64 so it can travel in a link or be stored behind a short id.
 */
import { botanicalCatalog } from "@/packages/florii/src";
import type { BotanicalName } from "@/packages/florii/src";

export type Mode = "bouquet" | "letter" | "both";
export type Gift = { mode: Mode; flowers: BotanicalName[]; wrap: string; sprig: BotanicalName[]; stamp: string; to: string; message: string; from: string };

export const MAX_BOUQUET = 15, MAX_SPRIG = 3, MAX_MESSAGE = 1000, MAX_NAME = 40;
export const WRAP_IDS = ["none", "kraft", "blush", "cream", "sage", "sky"];
export const STAMP_IDS = ["rose", "sun", "sky", "lilac", "meadow", "poppy", "blossom", "hibiscus", "tulip", "lotus"];
export const choices = botanicalCatalog.filter(item => item.category === "flower").map(item => item.id);

const toBase64 = (text: string) => typeof window === "undefined" ? Buffer.from(text, "utf8").toString("base64") : btoa(unescape(encodeURIComponent(text)));
const fromBase64 = (b64: string) => typeof window === "undefined" ? Buffer.from(b64, "base64").toString("utf8") : decodeURIComponent(escape(atob(b64)));

export function encode(gift: Gift) {
  const json = JSON.stringify({ o: gift.mode, f: gift.flowers, w: gift.wrap, l: gift.sprig, p: gift.stamp, t: gift.to, m: gift.message, s: gift.from });
  return toBase64(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Reads a token back into a gift, dropping anything unknown or too long. */
export function decode(token: string): Gift | null {
  try {
    const raw = JSON.parse(fromBase64(token.replace(/-/g, "+").replace(/_/g, "/"))) as Record<string, unknown>;
    const list = (value: unknown, max: number) => (Array.isArray(value) ? value.filter((n): n is BotanicalName => typeof n === "string" && choices.includes(n as BotanicalName)).slice(0, max) : []);
    const text = (value: unknown, max: number) => (typeof value === "string" ? value.slice(0, max) : "");
    const mode: Mode = raw.o === "bouquet" || raw.o === "letter" ? raw.o : "both";
    return {
      mode, flowers: list(raw.f, MAX_BOUQUET), sprig: list(raw.l, MAX_SPRIG),
      wrap: WRAP_IDS.includes(String(raw.w)) ? String(raw.w) : "kraft",
      stamp: STAMP_IDS.includes(String(raw.p)) ? String(raw.p) : "rose",
      to: text(raw.t, MAX_NAME), message: text(raw.m, MAX_MESSAGE), from: text(raw.s, MAX_NAME),
    };
  } catch { return null; }
}

/** One line that describes a gift, for link previews. */
export function describe(gift: Gift) {
  const what = gift.mode === "letter" ? "a letter" : gift.mode === "bouquet" ? "a bouquet" : "a bouquet and a letter";
  return `${what}${gift.to ? ` for ${gift.to}` : ""}${gift.from ? `, from ${gift.from}` : ""}`;
}

// ---------- short links ----------
// A gift packed into a few characters: one character each for the mode, paper and stamp,
// one per flower, and the words compressed. Nothing is stored anywhere; the link is the gift.
const MODES: Mode[] = ["both", "bouquet", "letter"];
const b64url = (bytes: Uint8Array) => { let bin = ""; bytes.forEach(b => { bin += String.fromCharCode(b); }); return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
const unb64url = (text: string) => Uint8Array.from(atob(text.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));
async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream) {
  const out = new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(stream));
  return new Uint8Array(await out.arrayBuffer());
}
const flowerChars = (list: BotanicalName[]) => list.map(name => choices.indexOf(name).toString(36)).join("");
const charFlowers = (text: string) => [...text].map(c => choices[parseInt(c, 36)]).filter(Boolean) as BotanicalName[];

export async function pack(gift: Gift) {
  const head = [MODES.indexOf(gift.mode), WRAP_IDS.indexOf(gift.wrap), STAMP_IDS.indexOf(gift.stamp)].map(n => Math.max(0, n).toString(36)).join("");
  let code = `${head}${flowerChars(gift.flowers)}-${flowerChars(gift.sprig)}`;
  const words = [gift.to, gift.message, gift.from];
  if (words.some(Boolean)) {
    const raw = new TextEncoder().encode(words.join("\u0001"));
    let body = "p" + b64url(raw);
    try { const zipped = "z" + b64url(await pipe(raw, new CompressionStream("deflate-raw"))); if (zipped.length < body.length) body = zipped; } catch { /* no compression available */ }
    code += "." + body;
  }
  return code;
}

export async function unpack(code: string): Promise<Gift | null> {
  try {
    const dot = code.indexOf(".");
    const [shape, body] = dot === -1 ? [code, ""] : [code.slice(0, dot), code.slice(dot + 1)];
    const dash = shape.indexOf("-");
    if (shape.length < 3 || dash === -1) return null;
    const [mode, wrap, stamp] = [...shape.slice(0, 3)].map(c => parseInt(c, 36));
    let to = "", message = "", from = "";
    if (body) {
      const bytes = unb64url(body.slice(1));
      const raw = body[0] === "z" ? await pipe(bytes, new DecompressionStream("deflate-raw")) : bytes;
      [to = "", message = "", from = ""] = new TextDecoder().decode(raw).split("\u0001");
    }
    return {
      mode: MODES[mode] ?? "both", wrap: WRAP_IDS[wrap] ?? "kraft", stamp: STAMP_IDS[stamp] ?? "rose",
      flowers: charFlowers(shape.slice(3, dash)).slice(0, MAX_BOUQUET), sprig: charFlowers(shape.slice(dash + 1)).slice(0, MAX_SPRIG),
      to: to.slice(0, MAX_NAME), message: message.slice(0, MAX_MESSAGE), from: from.slice(0, MAX_NAME),
    };
  } catch { return null; }
}
