import type { Metadata } from "next";
import { SiteHeader } from "./components/site-header";
import { GardenFooter } from "./components/garden-footer";
import { NotFoundArt } from "./components/not-found-art";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page wandered off into the garden.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <>
    <SiteHeader />
    <main className="not-found">
      <NotFoundArt />
      <h1>this page wandered off.</h1>
      <p>it may have moved, or it never bloomed at all. try one of these instead.</p>
      <div className="not-found-actions">
        <a className="btn btn-dark" href="/">back to the garden</a>
        <a className="btn btn-ghost" href="/flowers">browse the flowers</a>
        <a className="btn btn-ghost" href="/docs">read the docs</a>
      </div>
    </main>
    <GardenFooter />
  </>;
}
