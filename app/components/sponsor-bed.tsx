"use client";

import { useRef, useState } from "react";
import { projectLinks } from "@/config/project";
import { Icon } from "./icons";
import styles from "./sponsor-bed.module.css";

const amounts = [10, 25, 50, 100];

/** Builds a checkout link on the configured platform, preselecting the amount where supported. */
function checkoutLink(amount: number, monthly: boolean): string {
  if (!projectLinks.sponsor) return "";
  const url = new URL(projectLinks.sponsor);
  if (url.hostname.endsWith("opencollective.com")) {
    url.pathname = url.pathname.replace(/\/$/, "") + "/donate";
    url.searchParams.set("amount", String(amount));
    url.searchParams.set("interval", monthly ? "month" : "oneTime");
  } else if (url.hostname === "github.com" && url.pathname.startsWith("/sponsors/")) {
    url.pathname = url.pathname.replace(/\/$/, "") + "/sponsorships";
    url.searchParams.set("amount", String(amount));
    url.searchParams.set("frequency", monthly ? "recurring" : "one-time");
  } else {
    url.searchParams.set("amount", String(amount));
  }
  return url.href;
}

export function SponsorBed() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [amount, setAmount] = useState(25);
  const [custom, setCustom] = useState("");
  const [monthly, setMonthly] = useState(true);
  const total = custom ? Math.max(1, Math.floor(Number(custom)) || 0) : amount;
  const href = checkoutLink(total, monthly);
  const open = () => dialog.current?.showModal();

  return <section className={`section ${styles.section}`} id="sponsors" aria-labelledby="sponsors-title">
    <div className="container">
      <div className={styles.panel}>
        <div className={styles.heading}>
          <div className={styles.intro}>
            <span className={styles.eyebrow}><Icon name="heart" size={14} /> Community supported</span>
            <h2 id="sponsors-title">Keep florii growing.</h2>
            <p>Your support helps us create new flowers and keep florii free and open source.</p>
          </div>
          <button type="button" className={`btn btn-dark ${styles.cta}`} onClick={open}>
            {href ? "Become a sponsor" : "Explore sponsorship"} <Icon name="arrow" size={15} />
          </button>
        </div>

        <div className={styles.spaces} role="group" aria-label="Sponsor opportunities">
          {[1, 2, 3, 4].map(space => <button
            key={space}
            type="button"
            className={styles.space}
            aria-label={`Explore sponsorship, logo space ${space}`}
            onClick={open}
          >
            <span className={styles.plus} aria-hidden="true">+</span>
            <span>Your logo here</span>
          </button>)}
        </div>

        <p className={styles.note}>{href
          ? "A little support makes room for more good things. Individuals and teams are welcome."
          : "Sponsorships are coming soon. Explore the options for individuals and teams."}</p>
      </div>
    </div>

    <dialog ref={dialog} className="checkout" aria-labelledby="checkout-title" onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}>
      <div className="checkout-body">
        <button className="checkout-close" onClick={() => dialog.current?.close()} aria-label="Close">×</button>
        <h3 id="checkout-title">Sponsor florii</h3>
        <p>Help fund new flowers and the ongoing work behind florii.</p>
        <div className="segmented" role="group" aria-label="Frequency">
          <button aria-pressed={monthly} onClick={() => setMonthly(true)}>Monthly</button>
          <button aria-pressed={!monthly} onClick={() => setMonthly(false)}>One-time</button>
        </div>
        <div className="amounts" role="group" aria-label="Amount">
          {amounts.map(value => <button key={value} aria-pressed={!custom && amount === value} onClick={() => { setAmount(value); setCustom(""); }}>${value}</button>)}
          <label className="custom-amount"><span>$</span><input inputMode="numeric" placeholder="Other" value={custom} onChange={event => setCustom(event.target.value.replace(/[^0-9]/g, ""))} aria-label="Custom amount in dollars" /></label>
        </div>
        {href
          ? <a className="btn btn-dark checkout-go" href={href} target="_blank" rel="noreferrer">Continue to checkout · ${total}{monthly ? " / month" : ""} <Icon name="external" size={14} /></a>
          : <button className="btn btn-dark checkout-go" disabled>Checkout unavailable</button>}
        <p className="checkout-note">{href ? "Continue to the sponsorship provider to complete your payment." : "Sponsorships aren't open yet. Check back soon."}</p>
      </div>
    </dialog>
  </section>;
}
