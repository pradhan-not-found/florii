import { NextResponse } from "next/server";
import { gatewayAuth, markPaid, readSponsor, saveCheckout } from "@/lib/sponsor";
import { MINUTE, guard } from "@/lib/guard";

/**
 * UPI on florii's own page: the server creates a single-use QR code for the exact amount, the page
 * shows it, and the page asks here whether it has been paid. No redirect, no gateway window.
 */
export const runtime = "nodejs";
const API = "https://api.razorpay.com/v1/payments/qr_codes";

export async function POST(request: Request) {
  const blocked = guard(request, "upi", { limit: 10, windowMs: 10 * MINUTE, sameOrigin: true, maxBytes: 4096 }); if (blocked) return blocked;
  const auth = gatewayAuth();
  if (!auth) return NextResponse.json({ error: "Payments are not set up yet." }, { status: 503 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const sponsor = readSponsor(body, "upi");
  if ("error" in sponsor) return NextResponse.json({ error: sponsor.error }, { status: 400 });

  const closeBy = Math.floor(Date.now() / 1000) + 15 * 60;
  const response = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: auth.header },
    body: JSON.stringify({
      type: "upi_qr", name: "florii", usage: "single_use", fixed_amount: true, payment_amount: sponsor.amount,
      description: `florii sponsor spot · ${sponsor.product}`.slice(0, 80), close_by: closeBy,
      notes: { purpose: "florii sponsor spot", product: sponsor.product, link: sponsor.link, email: sponsor.email, name: sponsor.name },
    }),
  });
  const qr = await response.json().catch(() => null) as { id?: string; image_url?: string; error?: { description?: string } } | null;
  if (!response.ok || !qr?.id || !qr.image_url) {
    const off = response.status === 404 || /not (enabled|activated|allowed)|url was not found/i.test(qr?.error?.description || "");
    return NextResponse.json({ error: off ? "UPI is being set up and isn't available yet. Please pay by card for now." : qr?.error?.description || "Couldn't make the QR code. Please try again." }, { status: off ? 409 : 502 });
  }
  await saveCheckout(sponsor, qr.id);
  return NextResponse.json({ id: qr.id, image: qr.image_url, closeBy, amount: sponsor.amount });
}

/** Has this QR code been paid? Checked against the gateway itself, so the answer can be trusted. */
export async function GET(request: Request) {
  const blocked = guard(request, "upi-check", { limit: 400, windowMs: 10 * MINUTE }); if (blocked) return blocked;
  const auth = gatewayAuth();
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!auth || !/^qr_[A-Za-z0-9]+$/.test(id)) return NextResponse.json({ paid: false }, { status: 400 });
  const response = await fetch(`${API}/${id}/payments`, { headers: { Authorization: auth.header }, cache: "no-store" });
  const list = await response.json().catch(() => null) as { items?: { id: string; status: string; amount: number }[] } | null;
  const paid = list?.items?.find(item => item.status === "captured");
  if (paid) { await markPaid(id, paid.id, { amount: paid.amount }); return NextResponse.json({ paid: true, paymentId: paid.id }); }
  return NextResponse.json({ paid: false });
}
