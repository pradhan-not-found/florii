# Contributing to Florii

Florii is a React botanical library and a Next.js catalog. Contributions can improve the original SVG artwork, accessibility, animations, examples, or documentation.

The public repository URL has not been supplied yet. Work locally for now. Once the owner configures the real GitHub link, use that repository's issue and pull request workflow.

## Local setup

```sh
npm install
npm run dev
```

The app is in `app/`. Library components and their shared stylesheet are in `packages/florii/src/`.

## Make a change

1. Keep a change focused on one component, behavior, or documentation improvement.
2. Use original SVG geometry. Do not copy another icon library, trace copyrighted artwork, or submit generated assets whose provenance or redistribution rights are unclear.
3. For a new botanical, add its named component, its `Botanical` dispatch entry, its type, and its `botanicalCatalog` entry together.
4. Preserve predictable size and color props. Use the shared CSS conventions rather than adding an animation framework for a small effect.
5. Keep decoration out of the accessibility tree unless it has a meaningful `title`. Make meaningful controls usable with a keyboard.
6. Respect `prefers-reduced-motion`. Check a new animation at both its ordinary and reduced-motion settings.
7. Update examples and documentation when the public API changes. Avoid invented project links, community statistics, sponsors, or testimonials.

## Check the result

```sh
npm run typecheck
node packages/florii/build.mjs
npm run build
npm pack ./packages/florii --dry-run
```

Preview affected components at small and large sizes, in the mobile catalog, and with both dark and light color choices. For package changes, install a generated tarball in a React application and verify both `import { Daisy } from "florii"` and `import "florii/styles.css"` resolve.

Do not commit `node_modules`, generated build directories, local environment files, or package tarballs. Include a brief description of the problem, the resulting behavior, and the checks you completed when sharing a change.

## Licensing

Contributions of original code and botanical art are accepted under the project's MIT license. You must have the right to contribute every submitted asset. Preserve existing copyright and license notices. Third-party fonts and other separately licensed assets retain their own terms; do not represent them as original Florii artwork.

## Publication

This local package has not been published. Creating a tarball does not publish it. The owner must verify the package name, review the package contents, and explicitly decide when to publish. Repository and sponsorship URLs should only be configured from destinations the owner provides.
