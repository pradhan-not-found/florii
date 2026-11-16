# Florii

A botanical React component library with a Next.js catalog and playground. The interface uses a white background and peach typography. The application lives directly in this folder; the reusable package lives in `packages/florii/`.

Florii includes 20 original SVG botanicals, five decorative compositions, six animation presets, and TypeScript types. The package is in local development and is **not published to npm**. `florii` is a proposed package name, not a claim of registry availability.

## Run the catalog

```sh
npm install
npm run dev
```

Open http://localhost:3000. Edit the catalog in `app/` and the library in `packages/florii/src/`.

For a static production preview:

```sh
npm run build
npm start
```

The Next.js export is written to `out/`. The local preview server uses http://127.0.0.1:3000; set `PORT` to change the port.

## Build and install the library locally

```sh
node packages/florii/build.mjs
npm pack ./packages/florii
```

The build generates ESM JavaScript, TypeScript declarations, source maps, and CSS in `packages/florii/dist/`. Packing creates `florii-0.1.0.tgz` in the current directory. Install that tarball in another React app:

```sh
npm install /path/to/florii-0.1.0.tgz
```

Then import a component and the shared stylesheet:

```tsx
import "florii/styles.css";
import { Daisy } from "florii";

export function Example() {
  return <Daisy size={64} color="#c98264" animate="sway" speed={4} />;
}
```

In a Next.js App Router project, import the CSS once from `app/layout.tsx`. See [the package README](packages/florii/README.md) for the component API. Registry installation with `npm install florii` is a future step after the owner verifies the name and publishes; nothing here has been published automatically.

## Project links

GitHub and sponsorship destinations are intentionally unset until the owner supplies them. Configure them in an untracked `.env.local` file:

```dotenv
NEXT_PUBLIC_GITHUB_URL=
NEXT_PUBLIC_SPONSOR_URL=
```

Set each to the actual public HTTPS URL when available, then restart the development server or rebuild the static site. `config/project.ts` validates these URLs and returns an empty string for missing or invalid values. These variables are public configuration, so do not put secrets in them. No repository, contributor count, or donation destination is fabricated.

## Contributing and license

See [CONTRIBUTING.md](CONTRIBUTING.md) for local contribution steps and artwork requirements. Original source code and original botanical SVG art are covered by [MIT](LICENSE). Third-party assets, if retained in `public/`, keep their own licenses and credits; the root license does not relicense them. Self-hosted font licenses are in `public/fonts/`.
