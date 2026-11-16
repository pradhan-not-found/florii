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
      <a href="/" className="logo" aria-label="florii home">florii</a>
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
