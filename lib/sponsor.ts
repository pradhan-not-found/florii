/** Shared server-side handling of a sponsor checkout: validating input and saving the row. */
import { supabaseInsert, supabasePatch } from "./supabase";
import { SPONSOR_MAX, SPONSOR_PRICES } from "./prices";

export type Method = "card" | "upi";
const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export type SponsorInput = {
  method: Method; amount: number; currency: string;
  product: string; link: string; description: string; email: string;
  name: string; phone: string; country: string; address: string; leadId: string;
};

/** Reads and checks what the browser sent. The amount is decided here, never trusted from the page. */
export function readSponsor(body: Record<string, unknown> | null, method: Method): SponsorInput | { error: string } {
  const price = SPONSOR_PRICES[method];
  const product = clean(body?.product, 80), link = clean(body?.link, 200), description = clean(body?.description, 200), email = clean(body?.email, 160);
  const name = clean(body?.name, 80), phone = clean(body?.phone, 24), country = clean(body?.country, 60), address = clean(body?.address, 200), leadId = clean(body?.leadId, 36);
  if (!product) return { error: "Add your product name." };
  if (!/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(link)) return { error: "Add a valid link, like example.com." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Add a valid email so we can reach you." };
  if (!name) return { error: "Add your full name." };
  if (!address) return { error: "Add your billing address." };
  const requested = Number(body?.amount);
  const amount = Number.isInteger(requested) && requested >= price.amount && requested <= SPONSOR_MAX[method] ? requested : price.amount;
  return { method, amount, currency: price.currency, product, link, description, email, name, phone, country, address, leadId };
}

export const noteOf = (s: SponsorInput) => [`Name: ${s.name}`, s.phone && `Phone: ${s.phone}`, `Address: ${s.address}${s.country ? `, ${s.country}` : ""}`, `Method: ${s.method === "upi" ? "UPI" : "card"}`].filter(Boolean).join(" · ");

/**
 * Records the checkout against the gateway reference (an order id, or a QR code id for UPI).
 * Attaches to the row saved when the sponsor filled the form, or creates one. Contact fields have
 * their own columns once the database has them; until then they are kept in the note.
 */
export async function saveCheckout(s: SponsorInput, reference: string) {
  const base = { product: s.product, link: s.link, description: s.description, email: s.email, note: noteOf(s), amount: s.amount, currency: s.currency, razorpay_order_id: reference, status: "created" };
  const full = { ...base, name: s.name, phone: s.phone || null, country: s.country, address: s.address };
  const save = async (row: Record<string, unknown>) => {
    const linked = /^[0-9a-f-]{36}$/i.test(s.leadId) ? await supabasePatch("florii_sponsors", `id=eq.${s.leadId}&status=eq.created`, row) : 0;
    return linked ? true : supabaseInsert("florii_sponsors", row);
  };
  if (!(await save(full))) await save(base);
}

/** A paid sponsor goes straight onto the site; the dashboard can still take it off or reject it. */
export const PAID = () => ({ status: "featured", featured: true, paid_at: new Date().toISOString() });

/** Marks a checkout paid (from the gateway's own records, never from the page alone). */
export function markPaid(reference: string, paymentId: string, extra: Record<string, unknown> = {}) {
  return supabasePatch("florii_sponsors", `razorpay_order_id=eq.${encodeURIComponent(reference)}&status=in.(created,failed)`, { ...PAID(), razorpay_payment_id: paymentId, ...extra });
}

export const gatewayAuth = () => {
  const keyId = process.env.RAZORPAY_KEY_ID, keySecret = process.env.RAZORPAY_KEY_SECRET;
  return keyId && keySecret ? { keyId, header: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64") } : null;
};
