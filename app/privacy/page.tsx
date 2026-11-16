import type { Metadata } from "next";
import { SiteHeader } from "../components/site-header";
import { GardenFooter } from "../components/garden-footer";

export const metadata: Metadata = { title: "Privacy Policy · florii", description: "What the florii website does and does not collect." };

export default function Page() {
  return <>
    <SiteHeader />
    <main className="container prose">
      <h1>Privacy Policy</h1>
      <p className="prose-lead">florii is a static website and an open-source package. We keep data collection to the minimum needed to run it.</p>
      <h2>What we collect</h2>
      <p>The site has no accounts, no advertising, and no tracking cookies. Fonts and artwork are served from this site, not from third-party font or image services.</p>
      <h2>Requests to other services</h2>
      <ul>
        <li><strong>GitHub.</strong> When the star count is shown, your browser asks the public GitHub API for it. GitHub receives your IP address as it would for any web request.</li>
        <li><strong>Visitor counter.</strong> When the visitor total is shown, your browser asks a counting service for the number. No name, email, or account is sent.</li>
        <li><strong>Sponsorship.</strong> Sponsor links open the sponsorship platform's own page, where payments happen. florii never sees or stores your card details.</li>
      </ul>
      <h2>Storage in your browser</h2>
      <p>The site keeps the star and visitor numbers in session storage so pages load faster. It is cleared when you close the tab.</p>
      <h2>The npm package</h2>
      <p>The florii package runs entirely inside your app. It makes no network requests and collects nothing.</p>
      <h2>Questions</h2>
      <p>Open an issue on the project's GitHub repository and we will answer there.</p>
    </main>
    <GardenFooter />
  </>;
}
