"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Botanical } from "@/packages/florii/src";
import type { BotanicalName } from "@/packages/florii/src";
import { Icon } from "../components/icons";

export type SponsorDetails = { product: string; link: string; description: string; email: string; leadId?: string };
const COUNTRIES = [
  ["IN", "India", "+91"], ["US", "United States", "+1"], ["GB", "United Kingdom", "+44"], ["CA", "Canada", "+1"], ["AU", "Australia", "+61"], ["DE", "Germany", "+49"],
  ["FR", "France", "+33"], ["NL", "Netherlands", "+31"], ["SG", "Singapore", "+65"], ["AE", "United Arab Emirates", "+971"], ["JP", "Japan", "+81"], ["BR", "Brazil", "+55"],
] as const;
const STORAGE_KEY = "florii-sponsor";
const PRICE = "$49.99";
const PRICES = { card: "$49.99", upi: "₹4,199" } as const;
type Method = keyof typeof PRICES;
/** Amount choices in the smallest unit. The first is the minimum; the server checks the bounds again. */
const AMOUNTS: Record<Method, number[]> = { card: [4999, 9900, 19900], upi: [419900, 829900, 1659900] };
const LIMITS: Record<Method, [number, number]> = { card: [4999, 500000], upi: [419900, 42000000] };
const money = (minor: number, method: Method) => new Intl.NumberFormat(method === "upi" ? "en-IN" : "en-US", { style: "currency", currency: method === "upi" ? "INR" : "USD", minimumFractionDigits: method === "upi" || minor % 100 === 0 ? 0 : 2, maximumFractionDigits: 2 }).format(minor / 100);
const REGIONS = ["India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Netherlands", "Singapore", "United Arab Emirates", "Japan", "Brazil", "Other"];

/** A country's flag, served from /public/flags (emoji flags don't show on Windows). */
// eslint-disable-next-line @next/next/no-img-element
const Flag = ({ code }: { code: string }) => <img className="flag" src={`/flags/${code.toLowerCase()}.svg`} alt="" width={20} height={14} />;
const REGION_FLAGS: Record<string, string> = { India: "in", "United States": "us", "United Kingdom": "gb", Canada: "ca", Australia: "au", Germany: "de", France: "fr", Netherlands: "nl", Singapore: "sg", "United Arab Emirates": "ae", Japan: "jp", Brazil: "br" };

/** A small, styled dropdown (the browser's own select list can't be styled). */
function Dropdown<T extends string>({ value, options, onChange, label, className = "", disabled, show }: {
  value: T; options: { value: T; label: string; hint?: string; flag?: string }[]; onChange: (value: T) => void; label: string; className?: string; disabled?: boolean; show?: (option: { value: T; label: string }) => string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const index = Math.max(0, options.findIndex(o => o.value === value));
  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => { if (!box.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  function key(event: React.KeyboardEvent) {
    if (event.key === "Escape") { setOpen(false); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) { setOpen(true); setActive(index); return; }
      setActive(a => (a + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
    }
    if ((event.key === "Enter" || event.key === " ") && open) { event.preventDefault(); onChange(options[active].value); setOpen(false); }
  }
  const current = options[index];
  return <div className={"dd " + className} ref={box}>
    <button type="button" className="dd-button" aria-haspopup="listbox" aria-expanded={open} aria-label={label} disabled={disabled} onClick={() => { setOpen(o => !o); setActive(index); }} onKeyDown={key}>
      {current.flag && <Flag code={current.flag} />}<span>{show ? show(current) : current.label}</span>
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
    </button>
    {open && <ul className="dd-list" role="listbox" aria-label={label}>
      {options.map((option, i) => <li key={option.value} role="option" aria-selected={option.value === value} className={i === active ? "is-active" : ""} onMouseEnter={() => setActive(i)} onMouseDown={event => { event.preventDefault(); onChange(option.value); setOpen(false); }}>
        {option.flag && <Flag code={option.flag} />}<span>{option.label}</span>{option.hint && <em>{option.hint}</em>}
        {option.value === value && <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>}
      </li>)}
    </ul>}
  </div>;
}

/* the networks' own marks, served from /public/pay */
// eslint-disable-next-line @next/next/no-img-element
const Mark = ({ src, alt, height }: { src: string; alt: string; height: number }) => <img src={src} alt={alt} height={height} className="pay-mark" />;

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

async function createOrder(details: SponsorDetails, method: Method, contact: { name: string; phone: string; country: string; address: string; amount: number }) {
  const response = await fetch("/api/razorpay/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...details, ...contact, method }) });
  const order = await response.json();
  if (!response.ok) throw new Error(order.error || "Couldn't start the payment.");
  return order as { orderId: string; amount: number; currency: string; keyId: string };
}

async function confirm(result: RazorpayResponse) {
  const check = await fetch("/api/razorpay/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result) });
  return check.ok;
}

/** The site's real icon, read from its own page by our /api/favicon route (shown once the link looks like a real domain). */
function hostOf(link: string) {
  try { const host = new URL(/^https?:\/\//i.test(link.trim()) ? link.trim() : `https://${link.trim()}`).hostname; return /\.[a-z]{2,}$/i.test(host) ? host : ""; } catch { return ""; }
}

/**
 * Looks at a loaded logo and says whether it is nearly white or nearly black, so it can be given a
 * contrasting tile (a white logo on a white page would otherwise vanish). Works because our icon route is same-origin.
 */
export function toneOf(img: HTMLImageElement): string[] {
  try {
    const size = 16, canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return [];
    ctx.drawImage(img, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);
    let total = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 60) continue; // ignore transparent pixels
      total += (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255; count++;
    }
    if (!count) return [];
    const light = total / count;
    return light > 0.8 ? ["is-light"] : light < 0.2 ? ["is-dark"] : [];
  } catch { return []; }
}

export function Favicon({ link, size = 16 }: { link: string; size?: number }) {
  const host = hostOf(link);
  const [failed, setFailed] = useState("");
  if (!host || failed === host) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="favicon" src={`/api/favicon?url=${encodeURIComponent(host)}`} alt="" width={size} height={size} loading="lazy" referrerPolicy="no-referrer" onLoad={e => { e.currentTarget.classList.add("is-loaded", ...toneOf(e.currentTarget)); }} onError={() => setFailed(host)} />;
}

/** Saves the sponsor's details for the checkout page. Kept in this tab only. */
export function saveSponsorDetails(details: SponsorDetails) {
  let leadId = details.leadId;
  try { leadId ||= (JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null") as SponsorDetails | null)?.leadId; } catch { /* storage unavailable */ }
  leadId ||= crypto.randomUUID();
  const saved = { ...details, leadId };
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch { /* storage unavailable */ }
  // record the sponsor straight away (keepalive: it survives the page changing)
  void fetch("/api/sponsor/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(saved), keepalive: true }).catch(() => {});
  return saved;
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
      <label><span className="pay-label">link <em>where it points</em></span><span className="link-field"><Favicon link={link} /><input required maxLength={200} value={link} onChange={event => setLink(event.target.value)} placeholder="example.com" inputMode="url" autoComplete="url" /></span></label>
      <label><span className="pay-label">description <em>up to 200 characters</em></span><textarea maxLength={200} rows={2} value={description} onChange={event => setDescription(event.target.value)} placeholder="Short description highlighting what your product does." /><span className="pay-count">{description.length}/200</span></label>
      <label><span className="pay-label">email <em>where we reach you</em></span><input required type="email" maxLength={160} value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
    </div>
    <button type="submit" className="btn btn-dark pay-go co-continue">Continue to payment</button>
  </form>;
}

/** The UPI QR: a single-use code for the exact amount, made by our server and shown right here. */
function UpiQr({ image }: { image: string }) {
  const [loaded, setLoaded] = useState(false);
  return <div className="qr-frame">
    {!loaded && <span className="qr-code qr-wait" />}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="qr-image" src={image} alt="UPI QR code" onLoad={() => setLoaded(true)} style={loaded ? undefined : { position: "absolute", opacity: 0 }} />
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
  const [country, setCountry] = useState("US");
  const [region, setRegion] = useState("United States");
  const [address, setAddress] = useState("");
  const [choice, setChoice] = useState(0); // index into AMOUNTS, or -1 for a custom amount
  const [custom, setCustom] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "qr" | "paid" | "error">("idle");
  const [message, setMessage] = useState("");
  const [qr, setQr] = useState<{ id: string; image: string } | null>(null);
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
    if (!address.trim()) { fail("Add your billing address."); return; }
    if (!amountOk) { fail(`Choose an amount of at least ${money(LIMITS[method][0], method)}.`); return; }
    setStatus("working"); setMessage("");
    try {
      if (!(await loadHosted()) || !window.Razorpay) throw new Error("Couldn't reach the payment service. Check your connection and try again.");
      const order = await createOrder(details, "card", { name: name.trim(), phone: dial(phone), country: region, address: address.trim(), amount });
      const checkout = new window.Razorpay({
        key: order.keyId, order_id: order.orderId, amount: order.amount, currency: order.currency,
        name: "florii", description: "Sponsor spot · " + details.product,
        image: window.location.origin + "/logo.png",
        prefill: { email: details.email, name: name.trim() }, theme: { color: "#131316", backdrop_color: "rgba(255,255,255,.92)" },
        config: { display: { blocks: { card: { name: "Pay by card", instruments: [{ method: "card" }] } }, sequence: ["block.card"], preferences: { show_default_blocks: false } } },
        handler: (result: RazorpayResponse) => { unlockScroll(); settle(result); },
        modal: { ondismiss: () => { unlockScroll(); setStatus(current => (current === "working" ? "idle" : current)); } },
      });
      checkout.on("payment.failed", data => { unlockScroll(); fail(data.error?.description || "The payment didn't go through. No money was taken."); });
      checkout.open();
    } catch (error) { fail(error instanceof Error ? error.message : "Something went wrong."); }
  }

  /** UPI: our server makes a single-use QR for this amount; we show it and check every few seconds until it's paid. */
  async function payByUpi() {
    if (!details) return;
    if (!name.trim()) { fail("Add your full name."); return; }
    if (!address.trim()) { fail("Add your billing address."); return; }
    if (!amountOk) { fail(`Choose an amount of at least ${money(LIMITS[method][0], method)}.`); return; }
    const mine = ++session.current;
    setStatus("working"); setMessage(""); setQr(null);
    try {
      const response = await fetch("/api/razorpay/upi", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...details, name: name.trim(), phone: dial(phone), country: region, address: address.trim(), amount }) });
      const made = await response.json();
      if (!response.ok) throw new Error(made.error || "Couldn't make the QR code. Please try again.");
      if (session.current !== mine) return;
      setQr({ id: made.id, image: made.image }); setSeconds(Math.max(60, made.closeBy - Math.floor(Date.now() / 1000))); setStatus("qr");
      const check = async () => {
        if (session.current !== mine) return;
        const result = await fetch(`/api/razorpay/upi?id=${encodeURIComponent(made.id)}`, { cache: "no-store" }).then(r => r.json()).catch(() => null);
        if (session.current !== mine) return;
        if (result?.paid) { done(result.paymentId); return; }
        window.setTimeout(check, 3000);
      };
      window.setTimeout(check, 4000);
    } catch (error) { if (session.current === mine) fail(error instanceof Error ? error.message : "Something went wrong."); }
  }

  function cancelQr() { session.current++; setStatus("idle"); setQr(null); }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0"), ss = String(seconds % 60).padStart(2, "0");
  const dialCode = COUNTRIES.find(c => c[0] === country)?.[2] ?? "+1";
  function dial(value: string) { const digits = value.replace(/\D/g, ""); return digits ? `${dialCode} ${digits}` : ""; }
  const pick = (m: Method) => { if (status === "qr") cancelQr(); setMethod(m); if (m === "upi") { setCountry("IN"); setRegion("India"); } if (choice === -1) setCustom(""); if (status === "error") setStatus("idle"); };
  const customMinor = Math.round((Number(custom.replace(/[^\d.]/g, "")) || 0) * 100);
  const amount = choice >= 0 ? AMOUNTS[method][choice] : customMinor;
  const amountOk = amount >= LIMITS[method][0] && amount <= LIMITS[method][1];
  const price = money(amountOk ? amount : LIMITS[method][0], method);

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
        {status !== "paid" && <Dropdown className="dd-currency" label="Currency" value={method} onChange={pick} options={[{ value: "card", label: "Pay in USD" }, { value: "upi", label: "Pay in INR" }]} />}
      </div>

      <div className="co-item">
        <span className="co-item-art" aria-hidden="true"><Botanical name="Sunflower" size={58} title="" /></span>
        <div className="co-item-text"><b>Sponsor spot</b><p>{amountOk && amount > LIMITS[method][0] ? `Lifetime listing and a shoutout on X, plus ${money(amount - LIMITS[method][0], method)} extra support` : "Lifetime listing on florii and a shoutout on X"}</p></div>
        <strong>{price}</strong>
      </div>

      {details && !editing && <div className="co-details">
        <div className="co-details-head"><span>Your listing</span>{status !== "paid" && <button className="co-link" onClick={() => { cancelQr(); setEditing(true); }}>Edit</button>}</div>
        <dl>
          <div><dt>Product</dt><dd className="co-product"><Favicon link={details.link} />{details.product}</dd></div>
          <div><dt>Link</dt><dd>{details.link}</dd></div>
          {details.description && <div><dt>About</dt><dd>{details.description}</dd></div>}
        </dl>
      </div>}

      <div className="co-lines">
        <div><span>Subtotal</span><span>{price}</span></div>
        <div><span>Tax</span><span>{money(0, method)}</span></div>
        <div className="co-total"><span>Total</span><strong>{price}</strong></div>
      </div>
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
    <SponsorForm initial={details} onSubmit={next => { setDetails(saveSponsorDetails({ ...next, leadId: details?.leadId })); setEditing(false); }} />
  </>;
  else if (status === "qr") panel = <div className="qr-panel" aria-live="polite">
    <div className="qr-top"><h1 className="co-title">Scan to pay</h1><strong>{price}</strong></div>
    {qr && <UpiQr image={qr.image} />}
    <p className="qr-hint">Open any UPI app, scan the code and approve the payment.</p>
    <div className="qr-apps" aria-hidden="true"><span>Google Pay</span><span>PhonePe</span><span>Paytm</span><span>BHIM</span></div>
    <div className="qr-status"><span className="qr-pulse" /> Waiting for your payment · {mm}:{ss}</div>
    <button className="co-link" onClick={cancelQr}>Use another method</button>
  </div>;
  else panel = <>
    <h1 className="co-title">Contact information</h1>
    <label className="co-field"><span>Full name <i>*</i></span><input value={name} onChange={e => setName(e.target.value)} maxLength={80} autoComplete="name" placeholder="e.g. Jane Doe" /></label>
    <div className="co-field-row">
      <label className="co-field"><span>Email <i>*</i></span><input type="email" value={details.email} title={details.email} autoComplete="email" onChange={e => setDetails({ ...details, email: e.target.value })} onBlur={() => setDetails(saveSponsorDetails(details))} /></label>
      <div className="co-field"><span>Phone {method === "upi" ? <i>*</i> : <em>(optional)</em>}</span>
        <span className="co-phone">
          <Dropdown className="dd-code" label="Country code" value={country} onChange={setCountry} disabled={method === "upi"} show={o => o.value} options={COUNTRIES.map(([code, label, prefix]) => ({ value: code as string, label, hint: prefix, flag: code }))} />
          <b>{dialCode}</b>
          <input aria-label="Phone number" inputMode="tel" autoComplete="tel-national" maxLength={16} value={phone} onChange={e => setPhone(e.target.value)} placeholder={method === "upi" ? "98765 43210" : ""} />
        </span>
      </div>
    </div>

    <div className="co-field"><span>Billing address <i>*</i></span>
      <div className="co-address">
        <Dropdown className="dd-region" label="Country or region" value={region} onChange={setRegion} options={REGIONS.map(r => ({ value: r, label: r, flag: REGION_FLAGS[r] }))} />
        <input aria-label="Address" value={address} onChange={e => setAddress(e.target.value)} maxLength={200} autoComplete="street-address" placeholder="Address, city, postal code" />
      </div>
    </div>

    <div className="co-field"><span>Amount</span>
      {choice === -1
        ? <>
          <div className="co-amount-box is-custom">
            <span className="co-custom-in"><b>{method === "upi" ? "₹" : "$"}</b><input autoFocus inputMode="decimal" value={custom} onChange={e => setCustom(e.target.value)} placeholder={(LIMITS[method][0] / 100).toFixed(method === "upi" ? 0 : 2)} aria-label="Custom amount" /></span>
            <button className="co-link" onClick={() => { setChoice(0); setCustom(""); }}>Standard price</button>
          </div>
          <small className={"co-hint" + (custom && !amountOk ? " is-error" : "")}>Minimum {money(LIMITS[method][0], method)}</small>
        </>
        : <div className="co-amount-box">
          <strong>{money(LIMITS[method][0], method)}</strong>
          <button className="co-link" onClick={() => { setChoice(-1); setCustom(""); }}>Custom amount</button>
        </div>}
    </div>

    <div className="co-field"><span>Payment method</span>
      <div className="co-paylist" role="radiogroup" aria-label="Payment method">
        <button role="radio" aria-checked={method === "upi"} onClick={() => pick("upi")}>
          <span className="pay-method-radio" aria-hidden="true" /><b>UPI</b>
          <span className="pay-marks"><Mark src="/pay/upi.svg" alt="UPI" height={22} /></span>
        </button>
        <button role="radio" aria-checked={method === "card"} onClick={() => pick("card")}>
          <span className="pay-method-radio" aria-hidden="true" /><b>Card</b>
          <span className="pay-marks"><Mark src="/pay/visa.svg" alt="Visa" height={12} /><Mark src="/pay/mastercard.svg" alt="Mastercard" height={18} /><Mark src="/pay/amex.svg" alt="American Express" height={20} /></span>
        </button>
      </div>
    </div>

    <button className="co-pay-btn" onClick={method === "upi" ? payByUpi : payByCard} disabled={status === "working"}>
      {status === "working" ? (method === "upi" ? "Making your QR code…" : "Opening secure card form…") : method === "upi" ? `Show QR · ${price}` : `Pay ${price}`}
    </button>
  </>;

  return <div className="co">
    {order}
    <section className="co-pay">
      <div className="co-pay-inner">
        {panel}
        {status === "error" && <p className="pay-error" role="alert">{message}</p>}
        <footer className="co-footer">
          <p className="co-foot"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="10.5" width="16" height="10.5" rx="2.5" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></svg>Secured with end-to-end encryption</p>
          <nav className="co-legal" aria-label="Policies"><a href="/terms" target="_blank" rel="noopener">Terms</a><a href="/refunds" target="_blank" rel="noopener">Refunds</a><a href="/privacy" target="_blank" rel="noopener">Privacy</a><a href="/contact" target="_blank" rel="noopener">Contact</a></nav>
        </footer>
      </div>
    </section>
  </div>;
}
