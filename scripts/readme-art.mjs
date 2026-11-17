// Renders the README artwork (banner, flower grid, decorations strip) from the real florii components.
// Run after building the package: node packages/florii/build.mjs && node scripts/readme-art.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as florii from "../packages/florii/dist/index.js";

const { Botanical, botanicalCatalog } = florii;
const out = new URL("../.github/assets/", import.meta.url);
mkdirSync(out, { recursive: true });

const font = readFileSync(new URL("../public/fonts/instrument-sans-latin.woff2", import.meta.url)).toString("base64");
const fontFace = `<style>@font-face{font-family:"Instrument Sans";src:url(data:font/woff2;base64,${font}) format("woff2");font-weight:400 700}text{font-family:"Instrument Sans",system-ui,sans-serif}</style>`;

/** Renders one flower and returns it as a nested <svg> placed at x, y with the given size. */
function flower(name, x, y, size, props = {}) {
  const markup = renderToStaticMarkup(h(Botanical, { name, size, title: "", ...props }));
  return markup.replace("<svg ", `<svg x="${x}" y="${y}" `).replace(/ class="[^"]*"/, "").replace(/ style="[^"]*"/, "");
}

const logo = (x, y, scale) => `<g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="#131316" stroke-width="3.7" stroke-linecap="round" stroke-linejoin="round">
  <path d="M10 26V10C10 5.5 12.8 3 17 4.2"/><path d="M5.5 14H15"/><path d="M22 4V22C22 25 23.8 26.2 26.2 25.2"/>
  <path d="M33 14C29.2 14 27 16.8 27 20.2C27 23.8 29.6 26 33 26C36.8 26 39 23.2 39 19.8C39 16.2 36.4 14 33 14Z"/>
  <path d="M45 14.5V26"/><path d="M45 19.5C46.2 15.6 49 14 52.4 15"/><path d="M57.5 15V26"/><path d="M64.5 15V26"/>
  <circle cx="57.5" cy="8.2" r="0.6"/><circle cx="64.5" cy="8.2" r="0.6"/></g>`;

// ---------- banner ----------
{
  const W = 1280, H = 560;
  const row = ["Tulip", "Sunflower", "Hibiscus", "Lavender", "Peony", "Daffodil", "Rose", "Lily", "Cosmos", "Iris", "Poppy", "Dahlia", "Bluebell", "Anemone"];
  let blooms = "";
  row.forEach((name, i) => {
    const size = 92 + ((i * 37) % 44);
    const x = 18 + i * ((W - 60) / row.length);
    blooms += flower(name, x, H - size - 8 + ((i % 3) * 6), size);
  });
  let grass = "";
  for (let i = 0; i < 260; i++) {
    const x = (i / 260) * W + ((i * 13) % 7);
    const hgt = 28 + ((i * 29) % 46);
    const lean = ((i * 17) % 13) - 6;
    const fill = ["#3f9e35", "#4cad3b", "#5fbf45", "#2f7d32", "#76c84f"][i % 5];
    grass += `<path d="M${x - 3} ${H} Q${x + lean * 0.4} ${H - hgt * 0.55} ${x + lean} ${H - hgt} Q${x + 2 + lean * 0.4} ${H - hgt * 0.55} ${x + 3} ${H}Z" fill="${fill}"/>`;
  }
  const cloud = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity=".95"><circle cx="72" cy="76" r="34"/><circle cx="122" cy="60" r="46"/><circle cx="170" cy="74" r="36"/><rect x="34" y="72" width="172" height="36" rx="18"/></g>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${fontFace}
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfeeff"/><stop offset=".6" stop-color="#e6f6ff"/><stop offset="1" stop-color="#f4fbff"/></linearGradient><clipPath id="r"><rect width="${W}" height="${H}" rx="28"/></clipPath></defs>
<g clip-path="url(#r)"><rect width="${W}" height="${H}" fill="url(#sky)"/>
${cloud(90, 40, 0.8)}${cloud(1010, 70, 0.62)}${cloud(560, 8, 0.45)}
${logo(W / 2 - 157, 78, 4.5)}
<text x="${W / 2}" y="268" text-anchor="middle" font-size="40" font-weight="600" letter-spacing="-1.4" fill="#131316">make the web bloom.</text>
<text x="${W / 2}" y="310" text-anchor="middle" font-size="20" fill="#44444d">hand-painted flower components for react · free and open source</text>
${blooms}${grass}</g></svg>`;
  writeFileSync(new URL("banner.svg", out), svg);
}

// ---------- flower grid ----------
{
  const items = botanicalCatalog;
  const cols = 6, cell = 200, cardW = 184, cardH = 196, gap = 16, pad = 24;
  const rows = Math.ceil(items.length / cols);
  const W = pad * 2 + cols * cardW + (cols - 1) * gap, H = pad * 2 + rows * cardH + (rows - 1) * gap;
  let cards = "";
  items.forEach((item, i) => {
    const x = pad + (i % cols) * (cardW + gap), y = pad + Math.floor(i / cols) * (cardH + gap);
    cards += `<rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="20" fill="#fff" stroke="#e7e7e4"/>`;
    cards += `<rect x="${x + 8}" y="${y + 8}" width="${cardW - 16}" height="${cardH - 52}" rx="14" fill="#f6f6f4"/>`;
    cards += flower(item.id, x + (cardW - 108) / 2, y + 22, 108);
    cards += `<text x="${x + cardW / 2}" y="${y + cardH - 18}" text-anchor="middle" font-size="16" font-weight="600" fill="#131316">${item.name.toLowerCase()}</text>`;
  });
  void cell;
  writeFileSync(new URL("flowers.svg", out), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${fontFace}<rect width="${W}" height="${H}" rx="28" fill="#fafaf8"/>${cards}</svg>`);
}

// ---------- decorations strip ----------
{
  const names = ["FlowerCorner", "BotanicalDivider", "VineBorder", "FlowerWreath", "FlowerGarland"];
  const labels = ["flower corner", "divider", "vine border", "flower wreath", "flower garland"];
  const cardW = 236, cardH = 200, gap = 16, pad = 24;
  const W = pad * 2 + names.length * cardW + (names.length - 1) * gap, H = pad * 2 + cardH;
  let cards = "";
  names.forEach((name, i) => {
    const x = pad + i * (cardW + gap), y = pad;
    const Comp = florii[name];
    const size = name === "FlowerCorner" || name === "FlowerWreath" ? 120 : 200;
    let markup = renderToStaticMarkup(h(Comp, { size, title: "" })).replace(/ class="[^"]*"/, "").replace(/ style="[^"]*"/, "");
    const w = Number(/width="([\d.]+)"/.exec(markup)?.[1] || size), hh = Number(/height="([\d.]+)"/.exec(markup)?.[1] || size);
    markup = markup.replace("<svg ", `<svg x="${x + (cardW - w) / 2}" y="${y + 12 + (cardH - 60 - hh) / 2}" `);
    cards += `<rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="20" fill="#fff" stroke="#e7e7e4"/><rect x="${x + 8}" y="${y + 8}" width="${cardW - 16}" height="${cardH - 54}" rx="14" fill="#f6f6f4"/>${markup}`;
    cards += `<text x="${x + cardW / 2}" y="${y + cardH - 18}" text-anchor="middle" font-size="16" font-weight="600" fill="#131316">${labels[i]}</text>`;
  });
  writeFileSync(new URL("decorations.svg", out), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${fontFace}<rect width="${W}" height="${H}" rx="28" fill="#fafaf8"/>${cards}</svg>`);
}

console.log("README artwork written to .github/assets/");
