import { cpSync, existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const compiler = require.resolve("typescript/bin/tsc");
const result = spawnSync(process.execPath, [compiler, "--project", join(packageRoot, "tsconfig.json")], {
  cwd: packageRoot,
  stdio: "inherit",
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const stylesheet = join(packageRoot, "src", "styles.css");
if (!existsSync(stylesheet)) throw new Error("The package stylesheet is missing: src/styles.css");
mkdirSync(join(packageRoot, "dist"), { recursive: true });
cpSync(stylesheet, join(packageRoot, "dist", "styles.css"));
console.log("Built Florii ESM, TypeScript declarations, and stylesheet in packages/florii/dist.");
