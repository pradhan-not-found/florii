import { SiteHeader } from "./components/site-header";
import { GardenFooter } from "./components/garden-footer";
import { SponsorBed } from "./components/sponsor-bed";
import { Bento } from "./components/landing-sections";
import { End, Faq, Hero, Statement, Steps, Uses } from "./components/home";
import s from "./home.module.css";

export default function Home() {
  return <>
    <SiteHeader />
    <main className={s.page}>
      <Hero />
      <Statement />
      <Uses />
      <div className={`${s.block} ${s.features}`}><Bento /></div>
      <Steps />
      <SponsorBed />
      <Faq />
      <End />
    </main>
    <GardenFooter />
  </>;
}
