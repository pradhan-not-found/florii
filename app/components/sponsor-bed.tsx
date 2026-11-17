"use client";

import { useRef, useState } from "react";
import { projectLinks } from "@/config/project";
import { Icon } from "./icons";
import { Garden } from "./garden";

const amounts = [10, 25, 50, 100];
const sunflowers = ["Sunflower" as const];
const plots = 6;

/** Sponsor garden: a meadow with open plots at its centre. Each plot takes a logo and opens checkout. */
export function SponsorBed() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [amount, setAmount] = useState(25);
  const [custom, setCustom] = useState("");
  const total = custom ? Math.max(1, Math.floor(Number(custom)) || 0) : amount;
  const open = () => dialog.current?.showModal();

  return <section className="container section" id="sponsors" aria-labelledby="sponsors-title">
    <div className="sponsor-card">
      <div className="sponsor-left">
        <h2 id="sponsors-title">our sponsors</h2>
        <p className="sponsor-caption">the people and teams who keep florii growing.</p>
        <button className="btn btn-dark" onClick={open}>become a sponsor <Icon name="arrow" size={15} /></button>
      </div>
      <div className="sponsor-sunflowers" aria-hidden="true"><Garden height={130} plants={5} density={0.3} heads={sunflowers} taper /></div>
      <div className="sponsor-grid" role="group" aria-label="Sponsor plots">
        {Array.from({ length: 21 }, (_, index) => index < plots
          ? <button key={index} className="plot-cell plot-open" onClick={open} aria-label={"Sponsor plot " + (index + 1) + ", open checkout"}><span aria-hidden="true">+</span></button>
          : <span key={index} className="plot-cell plot-empty" aria-hidden="true" />)}
      </div>
    </div>

    <dialog ref={dialog} className="checkout" aria-labelledby="checkout-title" onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}>
      <div className="checkout-body">
        <button className="checkout-close" onClick={() => dialog.current?.close()} aria-label="Close">×</button>
        <h3 id="checkout-title">sponsor florii</h3>
        <p>your logo grows in the garden, and your support funds new flowers.</p>
        <div className="amounts" role="group" aria-label="Amount">
          {amounts.map(value => <button key={value} aria-pressed={!custom && amount === value} onClick={() => { setAmount(value); setCustom(""); }}>${value}</button>)}
          <label className="custom-amount"><span>$</span><input inputMode="numeric" placeholder="other" value={custom} onChange={event => setCustom(event.target.value.replace(/[^0-9]/g, ""))} aria-label="Custom amount in dollars" /></label>
        </div>
        <a className="btn btn-dark checkout-go" href={`/sponsor?amount=${total}`}>continue to checkout · ${total} <Icon name="arrow" size={14} /></a>
        <p className="checkout-note">secure payment by Razorpay. international cards accepted.</p>
      </div>
    </dialog>
  </section>;
}
