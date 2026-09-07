import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "dist");
const files = [
  "index.html",
  "styles.css",
  "app.js",
  "data",
  "PRIVACY.md",
  "SECURITY.md",
  "METHODOLOGY.md",
  "CONTRIBUTING.md",
  "LICENSE-DATA.md"
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const item of files) {
  await cp(join(root, item), join(output, item), { recursive: true });
}
console.log(`Build estático creado en ${output}`);
