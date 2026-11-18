import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { supabasePatch } from "@/lib/supabase";

/**
 * Payment events sent by the payment gateway, server to server. This is what marks a sponsor as paid
 * even if they close the tab before the page confirms it. Every call is checked against the webhook
 * secret, and only florii's own sponsor rows can change (other apps on the same account are ignored).
 */
export const runtime = "nodejs";

type Entity = { id?: string; order_id?: string; payment_id?: string; status?: string; amount?: number; currency?: string; method?: string };
type Event = { event?: string; payload?: { payment?: { entity?: Entity }; order?: { entity?: Entity }; refund?: { entity?: Entity }; qr_code?: { entity?: Entity } } };

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook secret is not set." }, { status: 503 });

  const raw = await request.text();
  const given = request.headers.get("x-razorpay-signature") || "";
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(expected), b = Buffer.from(given);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ error: "Bad signature." }, { status: 401 });

  let event: Event;
  try { event = JSON.parse(raw); } catch { return NextResponse.json({ error: "Bad body." }, { status: 400 }); }
  const payment = event.payload?.payment?.entity, order = event.payload?.order?.entity, refund = event.payload?.refund?.entity;
  const orderId = encodeURIComponent(payment?.order_id || order?.id || "");

  switch (event.event) {
    case "payment.captured":
    case "order.paid":
      if (orderId && payment?.id) await supabasePatch("florii_sponsors", `razorpay_order_id=eq.${orderId}&status=in.(created,failed)`, {
        status: "paid", razorpay_payment_id: payment.id, paid_at: new Date().toISOString(),
        ...(payment.amount ? { amount: payment.amount } : {}), ...(payment.currency ? { currency: payment.currency } : {}),
      });
      break;
    case "qr_code.credited": {
      // a UPI payment to one of our single-use QR codes (the QR id is stored as the reference)
      const qrId = encodeURIComponent(event.payload?.qr_code?.entity?.id || "");
      if (qrId && payment?.id) await supabasePatch("florii_sponsors", `razorpay_order_id=eq.${qrId}&status=in.(created,failed)`, { status: "paid", razorpay_payment_id: payment.id, paid_at: new Date().toISOString(), ...(payment.amount ? { amount: payment.amount } : {}) });
      break;
    }
    case "payment.failed":
      if (orderId) await supabasePatch("florii_sponsors", `razorpay_order_id=eq.${orderId}&status=eq.created`, { status: "failed" });
      break;
    case "refund.processed":
    case "payment.refunded": {
      const paymentId = encodeURIComponent(refund?.payment_id || payment?.id || "");
      if (paymentId) await supabasePatch("florii_sponsors", `razorpay_payment_id=eq.${paymentId}`, { status: "refunded", featured: false });
      break;
    }
  }
  // always acknowledge, so the gateway doesn't keep retrying events that aren't ours
  return NextResponse.json({ ok: true });
}
