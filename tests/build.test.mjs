import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "docs");

test("el build contiene la portada, documentación y archivos de descubrimiento", async () => {
  for (const path of [
    "index.html",
    "robots.txt",
    "sitemap.xml",
    "documentacion/metodologia/index.html",
    "documentacion/contribuir/index.html",
    "documentacion/privacidad/index.html",
    "documentacion/seguridad/index.html",
    "documentacion/licencia-datos/index.html"
  ]) {
    await access(join(output, path));
  }
});

test("el build genera una ficha navegable por plataforma", async () => {
  const dataset = JSON.parse(await readFile(join(root, "data", "platforms.es.json"), "utf8"));
  for (const platform of dataset.platforms) {
    const html = await readFile(join(output, "plataformas", platform.id, "index.html"), "utf8");
    assert.match(html, new RegExp(`<h1>${platform.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</h1>`));
    assert.match(html, /Fuente oficial/);
    assert.match(html, /rel="canonical"/);
  }
});

test("el sitemap enumera portada, documentos y diez fichas", async () => {
  const sitemap = await readFile(join(output, "sitemap.xml"), "utf8");
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 16);
  assert.match(sitemap, /plataformas\/google\//);
});
