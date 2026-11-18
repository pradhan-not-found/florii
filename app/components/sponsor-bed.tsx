"use client";

import { useEffect, useRef, useState } from "react";
import { projectLinks } from "@/config/project";
import { Icon } from "./icons";
import { Favicon, SponsorForm, saveSponsorDetails } from "../sponsor/checkout";
import { Garden } from "./garden";

const sunflowers = ["Sunflower" as const];
const plots = 6;
const cells = 21;
type Sponsor = { name: string; link: string };

/** Sponsor garden: a meadow with open plots at its centre. Each plot takes a logo and opens checkout. */
export function SponsorBed() {
  const dialog = useRef<HTMLDialogElement>(null);
  const open = () => dialog.current?.showModal();
  // paid sponsors appear here on their own, a few seconds after the payment goes through
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  useEffect(() => {
    const load = () => fetch("/api/sponsors").then(r => r.ok ? r.json() : null).then(data => { if (Array.isArray(data?.sponsors)) setSponsors(data.sponsors); }).catch(() => {});
    load();
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") load(); }, 30_000);
    return () => window.clearInterval(timer);
  }, []);
  const taken = sponsors.slice(0, cells - 1);
  // always leave six open plots after the sponsors, so there is room for the next one
  const openPlots = Math.min(cells - taken.length, plots);

  return <section className="container section" id="sponsors" aria-labelledby="sponsors-title">
    <div className="sponsor-card">
      <div className="sponsor-left">
        <h2 id="sponsors-title">our sponsors</h2>
        <p className="sponsor-caption">the people and teams who keep florii growing.</p>
        <button className="btn btn-dark" onClick={open}>become a sponsor <Icon name="arrow" size={15} /></button>
      </div>
      <div className="sponsor-sunflowers" aria-hidden="true"><Garden height={130} plants={5} density={0.3} heads={sunflowers} taper /></div>
      <div className="sponsor-grid" role="group" aria-label="Sponsor plots">
        {taken.map(sponsor => {
          const face = <><Favicon link={sponsor.link} size={28} /><span className="plot-initial" aria-hidden="true">{sponsor.name.charAt(0).toUpperCase()}</span><span className="plot-name">{sponsor.name}</span></>;
          return sponsor.link
            ? <a key={sponsor.name + sponsor.link} className="plot-cell plot-taken" href={sponsor.link} target="_blank" rel="sponsored noopener noreferrer" aria-label={sponsor.name}>{face}</a>
            : <span key={sponsor.name} className="plot-cell plot-taken" aria-label={sponsor.name}>{face}</span>;
        })}
        {Array.from({ length: cells - taken.length }, (_, index) => index < openPlots
          ? <button key={"open" + index} className="plot-cell plot-open" onClick={open} aria-label={"Sponsor plot " + (taken.length + index + 1) + ", open checkout"}><span aria-hidden="true">+</span></button>
          : <span key={"empty" + index} className="plot-cell plot-empty" aria-hidden="true" />)}
      </div>
    </div>

    <dialog ref={dialog} onClose={() => { document.body.style.overflow = ""; document.documentElement.style.overflow = ""; }} className="checkout" aria-labelledby="checkout-title" onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}>
      <div className="checkout-body">
        <button className="checkout-close" onClick={() => dialog.current?.close()} aria-label="Close">×</button>
        <svg className="checkout-logo" viewBox="0 0 70 30" width="76" height="33" fill="none" stroke="currentColor" strokeWidth="3.7" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="florii"><path d="M10 26V10C10 5.5 12.8 3 17 4.2" /><path d="M5.5 14H15" /><path d="M22 4V22C22 25 23.8 26.2 26.2 25.2" /><path d="M33 14C29.2 14 27 16.8 27 20.2C27 23.8 29.6 26 33 26C36.8 26 39 23.2 39 19.8C39 16.2 36.4 14 33 14Z" /><path d="M45 14.5V26" /><path d="M45 19.5C46.2 15.6 49 14 52.4 15" /><path d="M57.5 15V26" /><path d="M64.5 15V26" /><circle cx="57.5" cy="8.2" r="0.6" /><circle cx="64.5" cy="8.2" r="0.6" /></svg>
        <div className="checkout-title-row"><h3 id="checkout-title">become a sponsor</h3><span className="pay-price">$49.99</span></div>
                <p>tell us about your brand and pay on the next page. get featured in our sponsor section soon.</p>
        <SponsorForm onSubmit={details => { saveSponsorDetails(details); window.location.href = "/sponsor"; }} />
      </div>
    </dialog>
  </section>;
}
