/**
 * Minimal server-only Supabase client over the REST API.
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
export async function supabaseCount(table: string, filter = ""): Promise<number | null> {
  if (!supabaseReady()) return null;
  try {
    const response = await fetch(`${url()}/rest/v1/${table}?select=id${filter ? "&" + filter : ""}`, { method: "HEAD", headers: headers({ Prefer: "count=exact", Range: "0-0" }), cache: "no-store" });
    if (!response.ok) return null;
    const range = response.headers.get("content-range");
    const total = range?.split("/")[1];
    return total && total !== "*" ? Number(total) : null;
  } catch { return null; }
}

/** Updates rows matching a PostgREST filter (e.g. "id=eq.x&status=eq.created") and returns how many changed, or null on error. */
export async function supabasePatch(table: string, filter: string, patch: Record<string, unknown>): Promise<number | null> {
  if (!supabaseReady()) return null;
  try {
    const response = await fetch(`${url()}/rest/v1/${table}?${filter}`, { method: "PATCH", headers: headers({ Prefer: "return=representation" }), body: JSON.stringify(patch), cache: "no-store" });
    if (!response.ok) { console.error("supabase patch failed", table, response.status, await response.text()); return null; }
    return (await response.json() as unknown[]).length;
  } catch (error) { console.error("supabase patch error", table, error); return null; }
}

/** Calls a Postgres function. Returns its result, or undefined when the call fails (e.g. the function doesn't exist yet). */
export async function supabaseRpc<T>(name: string, args: Record<string, unknown> = {}): Promise<T | undefined> {
  if (!supabaseReady()) return undefined;
  try {
    const response = await fetch(`${url()}/rest/v1/rpc/${name}`, { method: "POST", headers: headers(), body: JSON.stringify(args), cache: "no-store" });
    if (!response.ok) return undefined;
    return await response.json() as T;
  } catch { return undefined; }
}
