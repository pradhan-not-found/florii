"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Botanical } from "@/packages/florii/src";
import { Icon } from "../components/icons";

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayInstance = { open: () => void; on: (event: string, handler: (data: { error?: { description?: string } }) => void) => void };
declare global { interface Window { Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance } }

/** Loads Razorpay's checkout script once. */
function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise(resolve => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function SponsorCheckout() {
  const [product, setProduct] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "paid" | "error">("idle");
  const [message, setMessage] = useState("");

  async function pay(event: FormEvent) {
    event.preventDefault();
    setStatus("working"); setMessage("");
    try {
      const ready = await loadRazorpay();
      if (!ready || !window.Razorpay) throw new Error("Couldn't reach the payment service. Check your connection and try again.");
      const response = await fetch("/api/razorpay/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product, link, description, email }) });
      const order = await response.json();
      if (!response.ok) throw new Error(order.error || "Couldn't start the payment.");

      const checkout = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "florii",
        description: "Sponsor spot · " + product,
        image: window.location.origin + "/logo.png",
        prefill: { email },
        theme: { color: "#131316" },
        handler: async (result: RazorpayResponse) => {
          const check = await fetch("/api/razorpay/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result) });
          if (check.ok) { setStatus("paid"); setMessage(result.razorpay_payment_id); }
          else { setStatus("error"); setMessage("We couldn't confirm the payment. If you were charged, write to us with your payment ID."); }
        },
        modal: { ondismiss: () => setStatus(current => (current === "working" ? "idle" : current)) },
      });
      checkout.on("payment.failed", data => { setStatus("error"); setMessage(data.error?.description || "The payment didn't go through. No money was taken."); });
      checkout.open();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  if (status === "paid") return <div className="pay-card pay-done">
    <span className="pay-done-art" aria-hidden="true"><Botanical name="Sunflower" size={96} animate="bloom" speed={3} title="" /></span>
    <h2>thank you for sponsoring florii.</h2>
    <p>{product} will be featured in our sponsor section soon. we'll reach you at {email}.</p>
    <p className="pay-ref">payment id · <code>{message}</code></p>
    <a className="btn btn-dark" href="/">back to the garden</a>
  </div>;

  return <form className="pay-card" onSubmit={pay}>
    <div className="pay-head">
      <h2>become a sponsor</h2>
      <span className="pay-price">$49.99</span>
    </div>
    <p className="pay-intro">tell us about your brand and pay on the next page. get featured in our sponsor section soon.</p>

    <div className="pay-fields">
      <label><span className="pay-label">product</span><input required maxLength={80} value={product} onChange={event => setProduct(event.target.value)} placeholder="e.g. Acme Studio" /></label>
      <label><span className="pay-label">link <em>where it points</em></span><input required maxLength={200} value={link} onChange={event => setLink(event.target.value)} placeholder="example.com" inputMode="url" autoComplete="url" /></label>
      <label><span className="pay-label">description <em>up to 200 characters</em></span><textarea maxLength={200} rows={3} value={description} onChange={event => setDescription(event.target.value)} placeholder="Short description highlighting what your product does." /><span className="pay-count">{description.length}/200</span></label>
      <label><span className="pay-label">email <em>where we reach you</em></span><input required type="email" maxLength={160} value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
    </div>

    <button type="submit" className="btn btn-dark pay-go" disabled={status === "working"}>
      {status === "working" ? "opening secure checkout…" : <>continue to payment <Icon name="arrow" size={15} /></>}
    </button>
    {status === "error" && <p className="pay-error" role="alert">{message}</p>}

    <p className="pay-secure"><Icon name="check" size={13} /> secure payment by Razorpay · cards, UPI and wallets · international cards accepted</p>
  </form>;
}
