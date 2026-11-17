import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "florii_admin";
const MAX_AGE = 60 * 60 * 12; // 12 hours

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.RAZORPAY_KEY_SECRET || "";
}

/** A signed, expiring token. Nothing about the password is stored in it. */
export function createSession(): string {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE;
  const signature = createHmac("sha256", secret()).update("admin:" + expires).digest("hex");
  return `${expires}.${signature}`;
}

export function sessionMaxAge() { return MAX_AGE; }

function validToken(token: string | undefined): boolean {
  if (!token || !secret()) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) < Date.now() / 1000) return false;
  const expected = createHmac("sha256", secret()).update("admin:" + expires).digest("hex");
  const a = Buffer.from(expected), b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isSignedIn(): Promise<boolean> {
  const store = await cookies();
  return validToken(store.get(SESSION_COOKIE)?.value);
}

/** Constant-time password check against ADMIN_PASSWORD. */
export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  const a = createHmac("sha256", "florii").update(expected).digest(), b = createHmac("sha256", "florii").update(input).digest();
  return timingSafeEqual(a, b);
}
