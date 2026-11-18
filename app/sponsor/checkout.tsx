"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import type { FormEvent } from "react";
import { Botanical } from "@/packages/florii/src";
import { Icon } from "../components/icons";

export type SponsorDetails = { product: string; link: string; description: string; email: string };
const STORAGE_KEY = "florii-sponsor";
const PRICE = "$49.99";
const PRICES = { card: "$49.99", upi: "₹4,199" } as const; // the server holds the real amounts
type Method = keyof typeof PRICES;

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayInstance = {
  open: () => void;
  on: (event: string, handler: (data: Record<string, unknown> & { error?: { description?: string } }) => void) => void;
  createPayment?: (data: Record<string, unknown>) => void;
};
declare global { interface Window { Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance } }

/** Razorpay locks page scrolling while its window is open; make sure it is released afterwards. */
function unlockScroll() {
  for (const el of [document.body, document.documentElement]) { el.style.overflow = ""; el.style.position = ""; el.style.top = ""; el.style.height = ""; }
}

const scripts: Record<string, Promise<boolean>> = {};
function loadScript(src: string): Promise<boolean> {
  return scripts[src] ??= new Promise(resolve => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => { delete scripts[src]; resolve(false); };
    document.body.appendChild(script);
  });
}
const loadHosted = () => loadScript("https://checkout.razorpay.com/v1/checkout.js");
const loadCustom = () => loadScript("https://checkout.razorpay.com/v1/razorpay.js");

async function createOrder(details: SponsorDetails, method: Method) {
  const response = await fetch("/api/razorpay/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...details, method }) });
  const order = await response.json();
  if (!response.ok) throw new Error(order.error || "Couldn't start the payment.");
  return order as { orderId: string; amount: number; currency: string; keyId: string };
}

async function confirm(result: RazorpayResponse) {
  const check = await fetch("/api/razorpay/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result) });
  return check.ok;
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
    <button type="submit" className="btn btn-dark pay-go co-continue">Continue to payment</button>
  </form>;
}

/** The UPI QR: drawn on our page from the payment link, with the florii mark in the middle. */
function UpiQr({ link }: { link: string }) {
  const [svg, setSvg] = useState("");
  useEffect(() => { QRCode.toString(link, { type: "svg", margin: 0, errorCorrectionLevel: "H", color: { dark: "#131316", light: "#ffffff" } }).then(setSvg).catch(() => setSvg("")); }, [link]);
  return <div className="qr-frame">
    {svg ? <span className="qr-code" dangerouslySetInnerHTML={{ __html: svg }} /> : <span className="qr-code qr-wait" />}
    <span className="qr-mark" aria-hidden="true"><Botanical name="Daisy" size={34} title="" /></span>
  </div>;
}

/** Checkout page: the order summary and florii's own payment step (UPI QR or card). */
export function SponsorCheckout() {
  const [details, setDetails] = useState<SponsorDetails | null>(null);
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState(false);
  const [method, setMethod] = useState<Method>("card");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "qr" | "paid" | "error">("idle");
  const [message, setMessage] = useState("");
  const [qrLink, setQrLink] = useState("");
  const [seconds, setSeconds] = useState(0);
  const session = useRef(0);

  useEffect(() => { setDetails(readSponsorDetails()); setReady(true); }, []);
  useEffect(() => {
    if (status !== "qr") return;
    const timer = window.setInterval(() => setSeconds(left => {
      if (left <= 1) { window.clearInterval(timer); setStatus("error"); setMessage("The QR code expired. Make a new one to try again."); return 0; }
      return left - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  function done(paymentId: string) {
    setStatus("paid"); setMessage(paymentId);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }
  async function settle(result: RazorpayResponse) {
    if (await confirm(result)) done(result.razorpay_payment_id);
    else { setStatus("error"); setMessage("We couldn't confirm the payment. If you were charged, write to us with your payment ID."); }
  }
  const fail = (text: string) => { setStatus("error"); setMessage(text); };

  /** Cards: the secure card window, styled as florii and limited to cards. */
  async function payByCard() {
    if (!details) return;
    if (!name.trim()) { fail("Add your full name."); return; }
    setStatus("working"); setMessage("");
    try {
      if (!(await loadHosted()) || !window.Razorpay) throw new Error("Couldn't reach the payment service. Check your connection and try again.");
      const order = await createOrder(details, "card");
      const checkout = new window.Razorpay({
        key: order.keyId, order_id: order.orderId, amount: order.amount, currency: order.currency,
        name: "florii", description: "Sponsor spot · " + details.product,
        image: window.location.origin + "/logo.png",
        prefill: { email: details.email, name: name.trim() }, theme: { color: "#131316", backdrop_color: "rgba(212,239,255,.85)" },
        config: { display: { blocks: { card: { name: "Pay by card", instruments: [{ method: "card" }] } }, sequence: ["block.card"], preferences: { show_default_blocks: false } } },
        handler: (result: RazorpayResponse) => { unlockScroll(); settle(result); },
        modal: { ondismiss: () => { unlockScroll(); setStatus(current => (current === "working" ? "idle" : current)); } },
      });
      checkout.on("payment.failed", data => { unlockScroll(); fail(data.error?.description || "The payment didn't go through. No money was taken."); });
      checkout.open();
    } catch (error) { fail(error instanceof Error ? error.message : "Something went wrong."); }
  }

  /** UPI: we create the payment ourselves and draw its QR on this page. */
  async function payByUpi() {
    if (!details) return;
    if (!name.trim()) { fail("Add your full name."); return; }
    const contact = phone.replace(/\D/g, "").slice(-10);
    if (contact.length !== 10) { fail("Add your 10-digit mobile number. It's only used for the payment receipt."); return; }
    const mine = ++session.current;
    setStatus("working"); setMessage(""); setQrLink("");
    try {
      if (!(await loadCustom()) || !window.Razorpay) throw new Error("Couldn't reach the payment service. Check your connection and try again.");
      const order = await createOrder(details, "upi");
      const gateway = new window.Razorpay({ key: order.keyId, image: window.location.origin + "/logo.png" });
      if (!gateway.createPayment) throw new Error("UPI isn't available right now. Try paying by card.");
      let qrArrived = false;
      gateway.on("payment.upi.intent_url_generated", data => {
        if (session.current !== mine) return;
        qrArrived = true;
        const link = String(data.intent_url || "");
        if (link) { setQrLink(link); setSeconds(600); setStatus("qr"); }
      });
      gateway.on("payment.success", data => { if (session.current === mine) settle(data as unknown as RazorpayResponse); });
      gateway.on("payment.error", data => { if (session.current === mine) fail(data.error?.description || "The payment didn't go through. No money was taken."); });
      gateway.createPayment({ amount: order.amount, currency: order.currency, order_id: order.orderId, email: details.email, contact, method: "upi", "_[flow]": "intent" });
      // if the QR link doesn't arrive, finish the same UPI payment in the secure window instead
      window.setTimeout(() => { if (session.current === mine && !qrArrived) { session.current++; upiWindow(order); } }, 12000);
    } catch (error) { fail(error instanceof Error ? error.message : "Something went wrong."); }
  }

  /** Fallback for UPI: the secure window, styled as florii and limited to UPI. */
  async function upiWindow(order: { orderId: string; amount: number; currency: string; keyId: string }) {
    if (!details) return;
    if (!(await loadHosted()) || !window.Razorpay) { fail("Couldn't reach the payment service. Try paying by card."); return; }
    const checkout = new window.Razorpay({
      key: order.keyId, order_id: order.orderId, amount: order.amount, currency: order.currency,
      name: "florii", description: "Sponsor spot · " + details.product, image: window.location.origin + "/logo.png",
      prefill: { email: details.email, contact: phone.replace(/\D/g, "").slice(-10) }, theme: { color: "#131316", backdrop_color: "rgba(212,239,255,.85)" },
      config: { display: { blocks: { upi: { name: "Pay with UPI", instruments: [{ method: "upi" }] } }, sequence: ["block.upi"], preferences: { show_default_blocks: false } } },
      handler: (result: RazorpayResponse) => { unlockScroll(); settle(result); },
      modal: { ondismiss: () => { unlockScroll(); setStatus(current => (current === "working" ? "idle" : current)); } },
    });
    checkout.on("payment.failed", data => { unlockScroll(); fail(data.error?.description || "The payment didn't go through. No money was taken."); });
    checkout.open();
  }

  function cancelQr() { session.current++; setStatus("idle"); setQrLink(""); }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0"), ss = String(seconds % 60).padStart(2, "0");
  const pick = (m: Method) => { if (status === "qr") cancelQr(); setMethod(m); if (status === "error") setStatus("idle"); };
  const price = PRICES[method];

  const order = <aside className="co-order">
    <div className="co-order-inner">
      <div className="co-top">
        <a href="/" className="co-logo" aria-label="florii home">
          <svg viewBox="0 0 70 30" width="76" height="33" fill="none" stroke="currentColor" strokeWidth="3.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 26V10C10 5.5 12.8 3 17 4.2" /><path d="M5.5 14H15" /><path d="M22 4V22C22 25 23.8 26.2 26.2 25.2" />
            <path d="M33 14C29.2 14 27 16.8 27 20.2C27 23.8 29.6 26 33 26C36.8 26 39 23.2 39 19.8C39 16.2 36.4 14 33 14Z" />
            <path d="M45 14.5V26" /><path d="M45 19.5C46.2 15.6 49 14 52.4 15" /><path d="M57.5 15V26" /><path d="M64.5 15V26" />
            <circle cx="57.5" cy="8.2" r="0.6" /><circle cx="64.5" cy="8.2" r="0.6" />
          </svg>
        </a>
        {status !== "paid" && <label className="co-currency">
          <span className="sr-only">Currency</span>
          <select value={method} onChange={e => pick(e.target.value as Method)}>
            <option value="card">Pay in USD</option>
            <option value="upi">Pay in INR</option>
          </select>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </label>}
      </div>

      <div className="co-item">
        <span className="co-item-art" aria-hidden="true"><Botanical name="Sunflower" size={58} title="" /></span>
        <div className="co-item-text"><b>Sponsor spot</b><p>Lifetime listing on florii and a shoutout on X</p></div>
        <strong>{price}</strong>
      </div>

      {details && !editing && <div className="co-details">
        <div className="co-details-head"><span>Your listing</span>{status !== "paid" && <button className="co-link" onClick={() => { cancelQr(); setEditing(true); }}>Edit</button>}</div>
        <dl>
          <div><dt>Product</dt><dd>{details.product}</dd></div>
          <div><dt>Link</dt><dd>{details.link}</dd></div>
          {details.description && <div><dt>About</dt><dd>{details.description}</dd></div>}
        </dl>
      </div>}

      <div className="co-lines">
        <div><span>Subtotal</span><span>{price}</span></div>
        <div><span>Tax</span><span>{method === "upi" ? "₹0" : "$0.00"}</span></div>
        <div className="co-total"><span>Total</span><strong>{price}</strong></div>
      </div>
    </div>
    <div className="co-garden" aria-hidden="true">
      {(["Lavender", "Tulip", "Sunflower", "Daisy", "Rose", "Cosmos"] as const).map((name, i) => <span key={name} style={{ left: `${6 + i * 15}%`, bottom: (i % 2) * 14 - 18 }}><Botanical name={name} size={i === 2 ? 118 : 92} title="" /></span>)}
    </div>
  </aside>;

  let panel;
  if (!ready) panel = <div className="co-loading" aria-busy="true" />;
  else if (status === "paid" && details) panel = <div className="co-done">
    <span aria-hidden="true"><Botanical name="Sunflower" size={96} animate="bloom" speed={3} title="" /></span>
    <h1>Thank you for sponsoring florii.</h1>
    <p>{details.product} will be featured in our sponsor section soon. We&apos;ll reach you at {details.email}.</p>
    <p className="co-ref">Payment ID · <code>{message}</code></p>
    <a className="co-pay-btn" href="/">Back to the garden</a>
  </div>;
  else if (!details || editing) panel = <>
    <h1 className="co-title">Your details</h1>
    <p className="co-sub">Tell us about the product you want to feature.</p>
    <SponsorForm initial={details} onSubmit={next => { saveSponsorDetails(next); setDetails(next); setEditing(false); }} />
  </>;
  else if (status === "qr") panel = <div className="qr-panel" aria-live="polite">
    <div className="qr-top"><h1 className="co-title">Scan to pay</h1><strong>{PRICES.upi}</strong></div>
    <UpiQr link={qrLink} />
    <p className="qr-hint">Open any UPI app, scan the code and approve the payment.</p>
    <div className="qr-apps" aria-hidden="true"><span>Google Pay</span><span>PhonePe</span><span>Paytm</span><span>BHIM</span></div>
    <a className="co-pay-btn co-pay-ghost qr-open" href={qrLink}>Open a UPI app on this phone</a>
    <div className="qr-status"><span className="qr-pulse" /> Waiting for your payment · {mm}:{ss}</div>
    <button className="co-link" onClick={cancelQr}>Use another method</button>
  </div>;
  else panel = <>
    <h1 className="co-title">Contact information</h1>
    <label className="co-field"><span>Full name <i>*</i></span><input value={name} onChange={e => setName(e.target.value)} maxLength={80} autoComplete="name" placeholder="e.g. Jane Doe" /></label>
    <div className="co-field-row">
      <label className="co-field"><span>Email</span><input value={details.email} readOnly aria-readonly="true" /></label>
      <label className="co-field"><span>Phone {method === "upi" ? <i>*</i> : <em>(optional)</em>}</span>
        <span className="co-phone"><b>{method === "upi" ? "+91" : "+"}</b><input inputMode="tel" autoComplete="tel" maxLength={16} value={phone} onChange={e => setPhone(e.target.value)} placeholder={method === "upi" ? "98765 43210" : "phone number"} /></span>
      </label>
    </div>
    <h2 className="co-title co-title-gap">Payment method</h2>
    <div className="pay-methods" role="radiogroup" aria-label="Payment method">
      {(["upi", "card"] as Method[]).map(m => <button key={m} role="radio" aria-checked={method === m} className="pay-method" onClick={() => pick(m)}>
        <span className="pay-method-radio" aria-hidden="true" />
        <span className="pay-method-text"><b>{m === "upi" ? "UPI" : "Card"}</b><small>{m === "upi" ? "Scan a QR with any UPI app · India" : "Visa, Mastercard, Amex · worldwide"}</small></span>
        <span className="pay-method-icon" aria-hidden="true">{m === "upi" ? <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 18h3v3h-3zM14 20h1M20 14h1" /></svg> : <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M2.5 10h19M6.5 15h4" /></svg>}</span>
      </button>)}
    </div>
    <button className="co-pay-btn" onClick={method === "upi" ? payByUpi : payByCard} disabled={status === "working"}>
      {status === "working" ? (method === "upi" ? "Making your QR code…" : "Opening secure card form…") : method === "upi" ? `Show QR · ${PRICES.upi}` : `Pay ${PRICES.card}`}
    </button>
  </>;

  return <div className="co">
    {order}
    <section className="co-pay">
      <div className="co-pay-inner">
        {panel}
        {status === "error" && <p className="pay-error" role="alert">{message}</p>}
        <p className="co-foot"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="10.5" width="16" height="10.5" rx="2.5" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></svg> Payments are encrypted and processed securely. florii never sees your card details.</p>
        <nav className="co-legal" aria-label="Policies"><a href="/terms" target="_blank" rel="noopener">Terms</a><a href="/refunds" target="_blank" rel="noopener">Refund policy</a><a href="/privacy" target="_blank" rel="noopener">Privacy policy</a><a href="/contact" target="_blank" rel="noopener">Contact</a></nav>
      </div>
    </section>
  </div>;
}
