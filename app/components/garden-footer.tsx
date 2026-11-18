import { projectLinks } from "@/config/project";
import { Wordmark } from "./wordmark";
import { LazyMount } from "./lazy-mount";

type FooterLink = { label: string; href: string; external?: boolean };

const github = projectLinks.github.replace(/\/$/, "");
const onGithub = (path: string) => (github ? github + path : "");

const columns: { title: string; links: FooterLink[] }[] = [
  { title: "Product", links: [
    { label: "Flowers", href: "/flowers" },
    { label: "Docs", href: "/docs" },
    { label: "npm", href: projectLinks.npm, external: true },
    { label: "Releases", href: onGithub("/releases"), external: true },
  ] },
  { title: "Contribute", links: [
    { label: "Submit a Flower", href: onGithub("/issues/new?title=New+flower%3A+"), external: true },
    { label: "Contribution Guide", href: onGithub("/blob/main/CONTRIBUTING.md"), external: true },
    { label: "Request a Flower", href: onGithub("/issues/new?title=Flower+request%3A+"), external: true },
    { label: "Flower Files", href: onGithub("/tree/main/packages/florii/src"), external: true },
  ] },
  { title: "Community", links: [
    { label: "GitHub", href: github, external: true },
    { label: "Sponsor (GitHub)", href: projectLinks.sponsor || "/#sponsors", external: Boolean(projectLinks.sponsor) },
    { label: "Buy Me a Coffee", href: projectLinks.coffee, external: true },
    { label: "X / Twitter", href: projectLinks.x, external: true },
    { label: "Issues & Feedback", href: onGithub("/issues"), external: true },
  ] },
  { title: "Legal", links: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refunds" },
    { label: "Contact", href: "/contact" },
    { label: "MIT License", href: onGithub("/blob/main/LICENSE") || "/about#license", external: Boolean(github) },
  ] },
];

export function GardenFooter() {
  return <footer className="garden-footer">
    <div className="container footer-top">
      {columns.map(column => <nav key={column.title} className="footer-col" aria-label={column.title}>
        <h3>{column.title}</h3>
        {column.links.map(link => link.href
          ? <a key={link.label} href={link.href} {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}>{link.label}</a>
          : <span key={link.label} title="Coming soon">{link.label}</span>)}
      </nav>)}
    </div>
    <div className="container"><LazyMount minHeight="32vw"><Wordmark /></LazyMount></div>
  </footer>;
}
