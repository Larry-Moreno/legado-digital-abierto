import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(join(root, "index.html"), "utf8");
const app = await readFile(join(root, "app.js"), "utf8");
const css = await readFile(join(root, "styles.css"), "utf8");

test("la página declara estructura accesible básica", () => {
  assert.match(html, /<html lang="es">/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /<main id="contenido">/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /<label[^>]+for="search"/);
  assert.match(css, /prefers-reduced-motion/);
});

test("los enlaces externos del template aíslan la pestaña", () => {
  assert.match(html, /target="_blank" rel="noopener noreferrer"/);
});

test("la interfaz carga el conjunto versionado y no declara endpoints de envío", () => {
  assert.match(app, /data\/platforms\.es\.json/);
  assert.doesNotMatch(app, /fetch\([^)]*,\s*\{[^}]*method:\s*["']POST["']/s);
  assert.doesNotMatch(app, /XMLHttpRequest|WebSocket|sendBeacon/);
});

test("existen enlaces visibles a privacidad, seguridad, metodología y contribución", () => {
  for (const file of ["PRIVACY.md", "SECURITY.md", "METHODOLOGY.md", "CONTRIBUTING.md"]) {
    assert.match(html, new RegExp(file.replace(".", "\\.")));
  }
});
