import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataset = JSON.parse(await readFile(join(root, "data", "platforms.es.json"), "utf8"));
const tolerated = new Set([401, 403, 405, 429]);

async function check(platform) {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(platform.officialSource.url, {
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "LegadoDigitalAbierto-LinkChecker/1.0" }
      });
      clearTimeout(timeout);
      if (response.ok || tolerated.has(response.status)) {
        return { name: platform.name, status: response.status, ok: true, tolerated: tolerated.has(response.status) };
      }
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
    }
  }
  return { name: platform.name, ok: false, error: lastError?.message ?? "Error desconocido" };
}

const results = [];
for (let index = 0; index < dataset.platforms.length; index += 3) {
  results.push(...await Promise.all(dataset.platforms.slice(index, index + 3).map(check)));
}

for (const result of results) {
  if (result.ok) {
    const note = result.tolerated ? " (bloqueo automatizado tolerado; requiere revisión manual)" : "";
    console.log(`OK ${result.status} ${result.name}${note}`);
  } else {
    console.error(`FAIL ${result.name}: ${result.error}`);
  }
}

const failures = results.filter((result) => !result.ok);
if (failures.length > 0) process.exitCode = 1;
