"use client";

import { projectLinks } from "@/config/project";
import { formatCount as format, useCounts } from "./use-counts";
import { Icon } from "./icons";

const compactCount = (value: number) => new Intl.NumberFormat("en-US", {
  notation: value >= 10000 ? "compact" : "standard",
  maximumFractionDigits: 1,
}).format(value);

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
      <a href="/" className="logo" aria-label="florii home">
        <svg
          className="logo-svg"
          viewBox="0 0 80 32"
          width="80"
          height="32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <text
            x="0"
            y="23"
            fill="currentColor"
            fontFamily='var(--sans), "Instrument Sans", -apple-system, sans-serif'
            fontSize="26"
            fontWeight="600"
            letterSpacing="-0.045em"
          >
            florii
          </text>
          <g transform="translate(59, 2) scale(0.62)">
            <path
              d="M9.21243 13.1822C9.2343 13.1822 9.97934 13.1822 11.2653 13.1294C23.9929 12.6076 14.717 -8.49899 3.50135 8.39529C-1.04315 15.2407 4.60988 19.8393 10.7663 21.4182C12.1719 21.7404 13.1444 21.8736 14.7039 22.0486"
              stroke="#1C00CA"
              strokeWidth="3.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </a>
      <nav className="header-nav" aria-label="Main">
        <a href="/flowers/">flowers</a>
        <a href="/docs/">docs</a>
        <a href={projectLinks.npm} target="_blank" rel="noreferrer">npm</a>
        <a href="/#sponsors">sponsor</a>
      </nav>
      <div className="header-actions">
        <span className="visitors" title={visitors === null ? "Visitor statistics are currently unavailable" : `${format(visitors)} total visitors`}>
          <i className="visitors-dot" aria-hidden="true" />
          <strong>{visitors === null ? "—" : compactCount(visitors)}</strong>
          <span>visitors</span>
        </span>
        {projectLinks.github
          ? <a className="star-button" href={projectLinks.github} target="_blank" rel="noreferrer" aria-label={starLabel}>{starContent}</a>
          : <span className="star-button" aria-disabled="true" aria-label={starLabel} title={starLabel}>{starContent}</span>}
      </div>
    </div>
  </header>;
}
