import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(await readFile(join(root, "data", "platforms.es.json"), "utf8"));

const allowedHosts = new Set([
  "support.apple.com",
  "support.google.com",
  "www.facebook.com",
  "support.microsoft.com",
  "docs.github.com",
  "www.linkedin.com",
  "help.x.com",
  "help.dropbox.com",
  "securepayments.paypal.com",
  "help.pinterest.com"
]);

test("la V1 contiene exactamente diez plataformas", () => {
  assert.equal(data.platforms.length, 10);
});

test("los identificadores y fuentes son únicos", () => {
  assert.equal(new Set(data.platforms.map((item) => item.id)).size, data.platforms.length);
  assert.equal(new Set(data.platforms.map((item) => item.officialSource.url)).size, data.platforms.length);
});

test("todas las fichas cumplen el contrato editorial mínimo", () => {
  for (const platform of data.platforms) {
    assert.match(platform.id, /^[a-z0-9-]+$/);
    assert.ok(platform.name.length >= 1);
    assert.ok(platform.summary.length >= 40);
    assert.ok(platform.regionNote.length >= 10);
    for (const field of ["actions", "eligibleRequesters", "requirements", "steps", "warnings"]) {
      assert.ok(Array.isArray(platform[field]) && platform[field].length > 0, `${platform.id}.${field}`);
    }
    for (const action of platform.actions) {
      assert.ok(data.actionDefinitions[action.id], `${platform.id}: acción ${action.id} sin definición global`);
    }
    assert.equal(platform.verification.sourceType, "official");
    assert.match(platform.verification.reviewedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(new Date(`${platform.verification.reviewedAt}T00:00:00Z`) <= new Date(), `${platform.id} tiene fecha futura`);
  }
});

test("cada fuente usa HTTPS y un dominio oficial autorizado", () => {
  for (const platform of data.platforms) {
    const url = new URL(platform.officialSource.url);
    assert.equal(url.protocol, "https:");
    assert.ok(allowedHosts.has(url.hostname), `${platform.id}: dominio no autorizado ${url.hostname}`);
  }
});

test("el conjunto declara idioma, versión y descargo", () => {
  assert.equal(data.language, "es");
  assert.match(data.version, /^\d+\.\d+\.\d+$/);
  assert.match(data.lastDatasetReview, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(data.disclaimer, /No constituye asesoría legal/i);
});
