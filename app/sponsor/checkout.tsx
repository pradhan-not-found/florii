"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Botanical } from "@/packages/florii/src";
import { Icon } from "../components/icons";

export type SponsorDetails = { product: string; link: string; description: string; email: string };
const STORAGE_KEY = "florii-sponsor";
const PRICE = "$49.99";

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayInstance = { open: () => void; on: (event: string, handler: (data: { error?: { description?: string } }) => void) => void };
declare global { interface Window { Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance } }

/** Razorpay locks page scrolling while its window is open; make sure it is released afterwards. */
function unlockScroll() {
  for (const el of [document.body, document.documentElement]) { el.style.overflow = ""; el.style.position = ""; el.style.top = ""; el.style.height = ""; }
}

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

/** Saves the sponsor's details for the checkout page. Kept in this tab only. */
export function saveSponsorDetails(details: SponsorDetails) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(details)); } catch { /* storage unavailable */ }
}
function readSponsorDetails(): SponsorDetails | null {
  try { const raw = sessionStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) as SponsorDetails : null; } catch { return null; }
}

/** The sponsor form: product, link, description and email. Used in the landing-page window and as a fallback on the checkout page. */
export function SponsorForm({ onSubmit, initial }: { onSubmit: (details: SponsorDetails) => void; initial?: SponsorDetails | null }) {
  const [product, setProduct] = useState(initial?.product ?? "");
  const [link, setLink] = useState(initial?.link ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const submit = (event: FormEvent) => { event.preventDefault(); onSubmit({ product: product.trim(), link: link.trim(), description: description.trim(), email: email.trim() }); };
  return <form className="sponsor-form" onSubmit={submit}>
    <div className="pay-fields">
      <label><span className="pay-label">product</span><input required maxLength={80} value={product} onChange={event => setProduct(event.target.value)} placeholder="e.g. Acme Studio" /></label>
      <label><span className="pay-label">link <em>where it points</em></span><input required maxLength={200} value={link} onChange={event => setLink(event.target.value)} placeholder="example.com" inputMode="url" autoComplete="url" /></label>
      <label><span className="pay-label">description <em>up to 200 characters</em></span><textarea maxLength={200} rows={2} value={description} onChange={event => setDescription(event.target.value)} placeholder="Short description highlighting what your product does." /><span className="pay-count">{description.length}/200</span></label>
      <label><span className="pay-label">email <em>where we reach you</em></span><input required type="email" maxLength={160} value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
    </div>
    <button type="submit" className="btn btn-dark pay-go">continue to payment <Icon name="arrow" size={15} /></button>
  </form>;
}

/** Checkout page: a summary of the sponsor's details and the Razorpay payment. */
export function SponsorCheckout() {
  const [details, setDetails] = useState<SponsorDetails | null>(null);
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<"idle" | "working" | "paid" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => { setDetails(readSponsorDetails()); setReady(true); }, []);

  async function pay() {
    if (!details) return;
    setStatus("working"); setMessage("");
    try {
      const loaded = await loadRazorpay();
      if (!loaded || !window.Razorpay) throw new Error("Couldn't reach the payment service. Check your connection and try again.");
      const response = await fetch("/api/razorpay/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(details) });
      const order = await response.json();
      if (!response.ok) throw new Error(order.error || "Couldn't start the payment.");
      const checkout = new window.Razorpay({
        key: order.keyId, order_id: order.orderId, amount: order.amount, currency: order.currency,
        name: "florii", description: "Sponsor spot · " + details.product,
        image: window.location.origin + "/logo.png",
        prefill: { email: details.email }, theme: { color: "#131316" },
        handler: async (result: RazorpayResponse) => {
          unlockScroll();
          const check = await fetch("/api/razorpay/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result) });
          if (check.ok) { setStatus("paid"); setMessage(result.razorpay_payment_id); try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ } }
          else { setStatus("error"); setMessage("We couldn't confirm the payment. If you were charged, write to us with your payment ID."); }
        },
        modal: { ondismiss: () => { unlockScroll(); setStatus(current => (current === "working" ? "idle" : current)); } },
      });
      checkout.on("payment.failed", data => { unlockScroll(); setStatus("error"); setMessage(data.error?.description || "The payment didn't go through. No money was taken."); });
      checkout.open();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  if (!ready) return <div className="pay-card pay-loading" aria-busy="true" />;

  if (status === "paid" && details) return <div className="pay-card pay-done">
    <span aria-hidden="true"><Botanical name="Sunflower" size={96} animate="bloom" speed={3} title="" /></span>
    <h2>thank you for sponsoring florii.</h2>
    <p>{details.product} will be featured in our sponsor section soon. we&apos;ll reach you at {details.email}.</p>
    <p className="pay-ref">payment id · <code>{message}</code></p>
    <a className="btn btn-dark" href="/">back to the garden</a>
  </div>;

  if (!details || editing) return <div className="pay-card">
    <div className="pay-head"><h2>become a sponsor</h2><span className="pay-price">{PRICE}</span></div>
    <p className="pay-intro">tell us about your brand, then pay on the next step.</p>
    <SponsorForm initial={details} onSubmit={next => { saveSponsorDetails(next); setDetails(next); setEditing(false); }} />
  </div>;

  return <div className="pay-card">
    <div className="pay-head"><h2>order summary</h2><button className="pay-edit" onClick={() => setEditing(true)}>edit</button></div>
    <dl className="pay-summary">
      <div><dt>product</dt><dd>{details.product}</dd></div>
      <div><dt>link</dt><dd>{details.link}</dd></div>
      {details.description && <div><dt>description</dt><dd>{details.description}</dd></div>}
      <div><dt>email</dt><dd>{details.email}</dd></div>
    </dl>
    <div className="pay-total"><span>lifetime sponsor spot + shoutout on X</span><strong>{PRICE}</strong></div>
    <button className="btn btn-dark pay-go" onClick={pay} disabled={status === "working"}>
      {status === "working" ? "opening secure checkout…" : <>pay {PRICE} <Icon name="arrow" size={15} /></>}
    </button>
    {status === "error" && <p className="pay-error" role="alert">{message}</p>}
    <p className="pay-secure"><Icon name="check" size={13} /> secure payment by Razorpay · cards, UPI and wallets · international cards accepted</p>
  </div>;
}
