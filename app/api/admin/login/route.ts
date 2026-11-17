import { NextResponse } from "next/server";
import { SESSION_COOKIE, createSession, passwordMatches, sessionMaxAge } from "../../../admin/session";

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get("password") || "");
  const url = new URL("/admin", request.url);
  if (!process.env.ADMIN_PASSWORD) { url.searchParams.set("error", "setup"); return NextResponse.redirect(url, 303); }
  if (!passwordMatches(password)) { url.searchParams.set("error", "wrong"); return NextResponse.redirect(url, 303); }
  const response = NextResponse.redirect(url, 303);
  response.cookies.set(SESSION_COOKIE, createSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: sessionMaxAge() });
  return response;
}
