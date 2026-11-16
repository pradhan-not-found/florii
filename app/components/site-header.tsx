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
          className="logo-art"
          viewBox="0 0 114 36"
          width="106"
          height="34"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* f */}
          <path d="M 14 15 C 14 8 16 3 19 3 C 21 3 21 7 19.5 13 L 14 32" />
          <path d="M 8 15 Q 14 14 20 15" />
          {/* l */}
          <path d="M 25 5 L 25 27 C 25 29 26 30 28 30" />
          {/* o */}
          <path d="M 41 16 C 35 16 33 21 34 25 C 35 29 40 31 43 29 C 46 27 47 20 42 16 Z" />
          {/* r */}
          <path d="M 51 17 L 51 29" />
          <path d="M 51 20 C 54 16 59 16 61 19" />
          {/* i */}
          <path d="M 68 17 L 68 28 C 68 29.5 69 30 70.5 30" />
          <circle cx="68" cy="10.5" r="1.4" fill="currentColor" stroke="none" />
          {/* i */}
          <path d="M 77 17 L 77 28 C 77 29.5 78 30 79.5 30" />
          <circle cx="77" cy="10.5" r="1.4" fill="currentColor" stroke="none" />
          {/* heart */}
          <g transform="translate(83, 1) scale(0.62)">
            <path
              d="M9.21243 13.1822C9.2343 13.1822 9.97934 13.1822 11.2653 13.1294C23.9929 12.6076 14.717 -8.49899 3.50135 8.39529C-1.04315 15.2407 4.60988 19.8393 10.7663 21.4182C12.1719 21.7404 13.1444 21.8736 14.7039 22.0486"
              stroke="#1C00CA"
              strokeWidth="3.7"
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
