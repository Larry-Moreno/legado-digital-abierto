import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const schema = JSON.parse(await readFile(join(root, "data", "platforms.schema.json"), "utf8"));
const dataset = JSON.parse(await readFile(join(root, "data", "platforms.es.json"), "utf8"));

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);

if (!validate(dataset)) {
  console.error("El conjunto no cumple data/platforms.schema.json:");
  for (const error of validate.errors ?? []) {
    console.error(`- ${error.instancePath || "/"}: ${error.message}`);
  }
  process.exitCode = 1;
} else {
  console.log("El conjunto cumple data/platforms.schema.json");
}
