/**
 * Minimal server-only Supabase client over the REST API, matching the Meowdration setup.
 * Uses SUPABASE_URL and SUPABASE_SECRET_KEY. Never import this from a client component.
 */

const url = () => (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const key = () => process.env.SUPABASE_SECRET_KEY || "";

export const supabaseReady = () => Boolean(url() && key());

function headers(extra: Record<string, string> = {}) {
  return { apikey: key(), Authorization: `Bearer ${key()}`, "Content-Type": "application/json", ...extra };
}

/** Inserts a row. Never throws: failures are logged so a payment flow is never blocked by the database. */
export async function supabaseInsert(table: string, row: Record<string, unknown>) {
  if (!supabaseReady()) return false;
  try {
    const response = await fetch(`${url()}/rest/v1/${table}`, { method: "POST", headers: headers({ Prefer: "return=minimal" }), body: JSON.stringify(row) });
    if (!response.ok) console.error("supabase insert failed", table, response.status, await response.text());
    return response.ok;
  } catch (error) { console.error("supabase insert error", table, error); return false; }
}

/** Updates rows matching column = value. */
export async function supabaseUpdate(table: string, column: string, value: string, patch: Record<string, unknown>) {
  if (!supabaseReady()) return false;
  try {
    const response = await fetch(`${url()}/rest/v1/${table}?${column}=eq.${encodeURIComponent(value)}`, { method: "PATCH", headers: headers({ Prefer: "return=minimal" }), body: JSON.stringify(patch) });
    if (!response.ok) console.error("supabase update failed", table, response.status, await response.text());
    return response.ok;
  } catch (error) { console.error("supabase update error", table, error); return false; }
}

/** Counts rows in a table (uses the exact count header). */
export async function supabaseCount(table: string): Promise<number | null> {
  if (!supabaseReady()) return null;
  try {
    const response = await fetch(`${url()}/rest/v1/${table}?select=id`, { method: "HEAD", headers: headers({ Prefer: "count=exact", Range: "0-0" }), cache: "no-store" });
    const range = response.headers.get("content-range");
    const total = range?.split("/")[1];
    return total && total !== "*" ? Number(total) : null;
  } catch { return null; }
}
