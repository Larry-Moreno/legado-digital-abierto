import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "docs");
const siteUrl = "https://larry-moreno.github.io/legado-digital-abierto";
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

const documentation = [
  { slug: "metodologia", file: "METHODOLOGY.md", title: "Metodología editorial" },
  { slug: "contribuir", file: "CONTRIBUTING.md", title: "Contribuir" },
  { slug: "privacidad", file: "PRIVACY.md", title: "Privacidad" },
  { slug: "seguridad", file: "SECURITY.md", title: "Seguridad" },
  { slug: "licencia-datos", file: "LICENSE-DATA.md", title: "Licencia de los datos" }
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderInline(value) {
  const source = String(value);
  const pattern = /`([^`]+)`|(https:\/\/[^\s)]+)/g;
  let outputText = "";
  let lastIndex = 0;
  for (const match of source.matchAll(pattern)) {
    outputText += escapeHtml(source.slice(lastIndex, match.index));
    if (match[1] !== undefined) outputText += `<code>${escapeHtml(match[1])}</code>`;
    else outputText += `<a href="${escapeHtml(match[2])}" target="_blank" rel="noopener noreferrer">${escapeHtml(match[2])}</a>`;
    lastIndex = match.index + match[0].length;
  }
  return outputText + escapeHtml(source.slice(lastIndex));
}

function renderMarkdown(markdown) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const html = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index].trimEnd();
    if (!line.trim()) {
      index += 1;
      continue;
    }
    const heading = /^(#{1,4})\s+(.+)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      index += 1;
      continue;
    }
    const unordered = /^-\s+(.+)$/.exec(line);
    if (unordered) {
      const items = [];
      while (index < lines.length) {
        const item = /^-\s+(.+)$/.exec(lines[index].trimEnd());
        if (!item) break;
        items.push(`<li>${renderInline(item[1])}</li>`);
        index += 1;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }
    const ordered = /^\d+\.\s+(.+)$/.exec(line);
    if (ordered) {
      const items = [];
      while (index < lines.length) {
        const item = /^\d+\.\s+(.+)$/.exec(lines[index].trimEnd());
        if (!item) break;
        items.push(`<li>${renderInline(item[1])}</li>`);
        index += 1;
      }
      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }
    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^(#{1,4})\s+|^-\s+|^\d+\.\s+/.test(lines[index].trim())) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
  }
  return html.join("\n");
}

function pageShell({ title, description, canonical, body, pageClass = "" }) {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="theme-color" content="#163b35">
  <meta name="referrer" content="no-referrer">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self'; base-uri 'none'; form-action 'none'; upgrade-insecure-requests">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <title>${escapeHtml(title)} | Legado Digital Abierto</title>
  <link rel="canonical" href="${canonical}">
  <link rel="stylesheet" href="../../styles.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="../../" aria-label="Legado Digital Abierto, inicio"><span class="brand-mark" aria-hidden="true">LD</span><span>Legado Digital Abierto</span></a>
    <nav aria-label="Navegación principal"><a href="../../#directorio">Directorio</a><a href="../../#lista">Mi lista</a><a href="../../#metodologia">Metodología</a></nav>
  </header>
  <main class="content-page ${pageClass}">
    <a class="back-link" href="../../">← Volver al directorio</a>
    ${body}
  </main>
</body>
</html>\n`;
}

function list(title, items, ordered = false) {
  const tag = ordered ? "ol" : "ul";
  return `<h2>${escapeHtml(title)}</h2><${tag}>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</${tag}>`;
}

function platformPage(platform) {
  const canonical = `${siteUrl}/plataformas/${platform.id}/`;
  const body = `
    <p class="eyebrow">Ficha verificada</p>
    <h1>${escapeHtml(platform.name)}</h1>
    <p class="lead">${escapeHtml(platform.summary)}</p>
    <p><strong>Cobertura:</strong> ${escapeHtml(platform.regionNote)}</p>
    <div class="action-tags">${platform.actions.map((action) => `<span class="action-tag">${escapeHtml(action.label)}</span>`).join("")}</div>
    ${list("Quién puede solicitarlo", platform.eligibleRequesters)}
    ${list("Información o documentos indicados", platform.requirements)}
    ${list("Ruta recomendada", platform.steps, true)}
    ${list("Advertencias", platform.warnings)}
    <section class="source-panel" aria-labelledby="source-title">
      <h2 id="source-title">Fuente oficial</h2>
      <p><a href="${escapeHtml(platform.officialSource.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(platform.officialSource.title)}</a></p>
      <p>Revisada el ${escapeHtml(platform.verification.reviewedAt)}. Estado: ${platform.verification.status === "verified" ? "verificada" : "revisión pendiente"}.</p>
    </section>
    <p class="source-note">Información general. No constituye asesoría legal ni garantiza el resultado de una solicitud.</p>`;
  return pageShell({
    title: `${platform.name}: gestión de una cuenta tras un fallecimiento`,
    description: platform.summary,
    canonical,
    body,
    pageClass: "platform-page"
  });
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const item of files) {
  await cp(join(root, item), join(output, item), { recursive: true });
}

for (const document of documentation) {
  const markdown = await readFile(join(root, document.file), "utf8");
  const target = join(output, "documentacion", document.slug);
  await mkdir(target, { recursive: true });
  const body = `${renderMarkdown(markdown)}<p class="source-note">Documento fuente: <a href="../../${document.file}">${document.file}</a>.</p>`;
  await writeFile(join(target, "index.html"), pageShell({
    title: document.title,
    description: `${document.title} de Legado Digital Abierto.`,
    canonical: `${siteUrl}/documentacion/${document.slug}/`,
    body
  }));
}

const dataset = JSON.parse(await readFile(join(root, "data", "platforms.es.json"), "utf8"));
for (const platform of dataset.platforms) {
  const target = join(output, "plataformas", platform.id);
  await mkdir(target, { recursive: true });
  await writeFile(join(target, "index.html"), platformPage(platform));
}

const sitemapUrls = [
  `${siteUrl}/`,
  ...documentation.map((document) => `${siteUrl}/documentacion/${document.slug}/`),
  ...dataset.platforms.map((platform) => `${siteUrl}/plataformas/${platform.id}/`)
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile(join(output, "sitemap.xml"), sitemap);
await writeFile(join(output, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);

console.log(`Build estático publicable creado en ${output}`);
