"use client";

import { projectLinks } from "@/config/project";
import { formatCount as format, useCounts } from "./use-counts";
import { Icon } from "./icons";

const compactCount = (value: number) => new Intl.NumberFormat("en-US", {
  notation: value >= 10000 ? "compact" : "standard",
  maximumFractionDigits: 1,
}).format(value);

/** Shows a number; when it changes, each digit that changed rolls to its new value, like a counter. */
function LiveCount({ value }: { value: number }) {
  const text = compactCount(value);
  return <span className="odo" aria-label={text}>
    {[...text].map((char, i) => /\d/.test(char)
      ? <span key={text.length - i} className="odo-digit" aria-hidden="true"><span style={{ transform: `translateY(-${Number(char) * 10}%)` }}>{"0123456789".split("").map(d => <span key={d}>{d}</span>)}</span></span>
      : <span key={"c" + (text.length - i)} aria-hidden="true">{char}</span>)}
  </span>;
}

export function SiteHeader() {
  const { stars, visitors } = useCounts();
  const starLabel = projectLinks.github
    ? `Star florii on GitHub${stars === null ? "" : ` (${format(stars)} stars)`}`
    : "GitHub repository coming soon";
  const starContent = <>
    <Icon name="github" size={16} />
    <span className="star-label">Star<span className="star-label-detail"> on GitHub</span></span>
    <span className="star-count" title={stars === null ? "Star count is currently unavailable" : `${format(stars)} GitHub stars`}><Icon name="star" size={12} filled />{stars === null ? "—" : compactCount(stars)}</span>
  </>;

  return <header className="site-header">
    <div className="container header-inner">
      <a href="/" className="logo logo-art" aria-label="florii home">
        <svg viewBox="0 0 70 30" width="84" height="36" fill="none" stroke="currentColor" strokeWidth="3.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 26V10C10 5.5 12.8 3 17 4.2" />
          <path d="M5.5 14H15" />
          <path d="M22 4V22C22 25 23.8 26.2 26.2 25.2" />
          <path d="M33 14C29.2 14 27 16.8 27 20.2C27 23.8 29.6 26 33 26C36.8 26 39 23.2 39 19.8C39 16.2 36.4 14 33 14Z" />
          <path d="M45 14.5V26" />
          <path d="M45 19.5C46.2 15.6 49 14 52.4 15" />
          <path d="M57.5 15V26" />
          <path d="M64.5 15V26" />
          <circle cx="57.5" cy="8.2" r="0.6" />
          <circle cx="64.5" cy="8.2" r="0.6" />
        </svg>
      </a>
      <nav className="header-nav" aria-label="Main">
        <a href="/flowers">flowers</a>
        <a href="/docs">docs</a>
        <a href="/gift">gift</a>
        <a href={projectLinks.npm} target="_blank" rel="noreferrer">npm</a>
        <a href="/#sponsors">sponsor</a>
      </nav>
      <div className="header-actions">
        <span className="visitors" title={visitors === null ? "Loading visitors" : `${format(visitors)} total visitors`} aria-live="polite">
          <i className="visitors-dot" aria-hidden="true" />
          <strong>{visitors === null ? <span className="live-count-wait" aria-label="Loading" /> : <LiveCount value={visitors} />}</strong>
          <span>visitors</span>
        </span>
        {projectLinks.github
          ? <a className="star-button" href={projectLinks.github} target="_blank" rel="noreferrer" aria-label={starLabel}>{starContent}</a>
          : <span className="star-button" aria-disabled="true" aria-label={starLabel} title={starLabel}>{starContent}</span>}
      </div>
    </div>
  </header>;
}
