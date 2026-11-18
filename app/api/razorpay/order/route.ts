import { NextResponse } from "next/server";
import { gatewayAuth, readSponsor, saveCheckout } from "@/lib/sponsor";

/** Creates a card payment order for a sponsor spot. The secret key never leaves the server. */
export async function POST(request: Request) {
  const auth = gatewayAuth();
  if (!auth) return NextResponse.json({ error: "Payments are not set up yet." }, { status: 503 });

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const sponsor = readSponsor(body, body?.method === "upi" ? "upi" : "card");
  if ("error" in sponsor) return NextResponse.json({ error: sponsor.error }, { status: 400 });

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: auth.header },
    body: JSON.stringify({
      amount: sponsor.amount, currency: sponsor.currency, receipt: "florii_" + Date.now(),
      notes: { purpose: "florii sponsor spot", method: sponsor.method, product: sponsor.product, link: sponsor.link, email: sponsor.email, name: sponsor.name, phone: sponsor.phone, country: sponsor.country, address: sponsor.address },
    }),
  });
  const order = await response.json().catch(() => null) as { id?: string; amount?: number; currency?: string; error?: { description?: string } } | null;
  if (!response.ok || !order?.id) return NextResponse.json({ error: order?.error?.description || "Could not start the payment." }, { status: 502 });

  await saveCheckout(sponsor, order.id);
  return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: auth.keyId });
}
