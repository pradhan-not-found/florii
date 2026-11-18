/**
 * Structured data (schema.org JSON-LD) so search engines and AI answer engines can understand
 * and cite each page accurately. Server only.
 */
import { botanicalCatalog } from "@/packages/florii/src";
import { questions } from "./faq";
import { site } from "./llms";

const sentence = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const id = (path: string, kind: string) => `${site}${path}#${kind}`;

/** Renders one JSON-LD block. `<` is escaped so the data can never close the script tag. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function breadcrumbs(name: string, path: string) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "florii", item: site + "/" },
      { "@type": "ListItem", position: 2, name, item: site + path },
    ],
  };
}

export function faqPage() {
  return {
    "@context": "https://schema.org", "@type": "FAQPage", "@id": id("/", "faq"),
    mainEntity: questions.map(([q, a]) => ({ "@type": "Question", name: sentence(q), acceptedAnswer: { "@type": "Answer", text: sentence(a) } })),
  };
}

export function installHowTo() {
  return {
    "@context": "https://schema.org", "@type": "HowTo", "@id": id("/docs", "howto"),
    name: "How to add hand-painted flowers to a React app with florii",
    totalTime: "PT2M",
    tool: [{ "@type": "HowToTool", name: "A React 18 or 19 app" }],
    step: [
      { "@type": "HowToStep", position: 1, name: "Install the package", text: "Run npm install florii (or pnpm add, yarn add, bun add)." },
      { "@type": "HowToStep", position: 2, name: "Import the styles", text: "Add import \"florii/styles.css\" once, for example in your root layout." },
      { "@type": "HowToStep", position: 3, name: "Plant a flower", text: "Import a flower such as Sunflower from florii and render <Sunflower size={96} animate=\"sway\" />." },
    ],
  };
}

export function flowerList() {
  return {
    "@context": "https://schema.org", "@type": "ItemList", "@id": id("/flowers", "list"),
    name: "florii flowers and botanicals", numberOfItems: botanicalCatalog.length,
    itemListElement: botanicalCatalog.map((item, index) => ({
      "@type": "ListItem", position: index + 1,
      item: { "@type": "CreativeWork", name: item.name, description: item.description, url: `${site}/flowers#${item.id}`, license: "https://opensource.org/licenses/MIT" },
    })),
  };
}
