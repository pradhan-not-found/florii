import { SiteHeader } from "./components/site-header";
import { GardenFooter } from "./components/garden-footer";
import { Icon } from "./components/icons";
import { Garden } from "./components/garden";
import { SponsorBed } from "./components/sponsor-bed";
import { Bento } from "./components/landing-sections";

export default function Home() {
  return <>
    <SiteHeader />
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <Garden height={340} plants={22} taper className="hero-garden" />
          <div className="hero-body">
            <h1 id="hero-title">Make the<br />web bloom.</h1>
            <div className="hero-side">
              <p>Bring your UI to life with 28 hand-painted flowers and five decorations. Animated SVG components for React, free and open source.</p>
              <div className="hero-actions">
                <a className="btn btn-dark" href="/flowers/">Browse the flowers <Icon name="arrow" size={15} /></a>
                <a className="btn btn-ghost" href="/docs/">Get started</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Bento />
      <SponsorBed />
    </main>
    <GardenFooter />
  </>;
}
