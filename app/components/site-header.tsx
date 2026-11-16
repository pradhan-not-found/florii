"use client";

import { projectLinks } from "@/config/project";
import { formatCount as format, useCounts } from "./use-counts";
import { Icon } from "./icons";

export function SiteHeader() {
  const { stars, visitors } = useCounts();
  return <header className="site-header">
    <div className="container header-inner">
      <a href="/" className="logo" aria-label="florii home">florii</a>
      <nav className="header-nav" aria-label="Main">
        <a href="/flowers/">Flowers</a>
        <a href="/docs/">Docs</a>
        <a href={projectLinks.npm} target="_blank" rel="noreferrer">npm</a>
        <a href="/#sponsors">Sponsor</a>
      </nav>
      <div className="header-actions">
        <span className="visitors" title="People who have visited"><i aria-hidden="true" /><strong>{visitors === null ? "—" : format(visitors)}</strong> visitors</span>
        {projectLinks.github
          ? <a className="star-button" href={projectLinks.github} target="_blank" rel="noreferrer"><Icon name="github" size={16} /> Star <span className="star-icon"><Icon name="star" size={14} filled /></span><span className="star-count">{stars === null ? "—" : format(stars)}</span></a>
          : <span className="star-button" title="GitHub repository coming soon"><Icon name="github" size={16} /> Star <span className="star-icon"><Icon name="star" size={14} filled /></span><span className="star-count">—</span></span>}
      </div>
    </div>
  </header>;
}
