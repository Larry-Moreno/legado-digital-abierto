const DATA_URL = "data/platforms.es.json";
const STORAGE_KEY = "legado-digital-abierto:checklist:v1";
const ISSUE_URL = "https://github.com/Larry-Moreno/legado-digital-abierto/issues/new";

const grid = document.querySelector("#platform-grid");
const template = document.querySelector("#platform-card-template");
const searchInput = document.querySelector("#search");
const actionFilter = document.querySelector("#action-filter");
const filters = document.querySelector("#filters");
const resultsSummary = document.querySelector("#results-summary");
const datasetStatus = document.querySelector("#dataset-status");
const emptyState = document.querySelector("#empty-state");
const checklistContent = document.querySelector("#checklist-content");
const printButton = document.querySelector("#print-list");

let dataset;
let selectedIds = loadSelection();

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function createElement(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function appendList(container, heading, items, ordered = false, className = "") {
  container.append(createElement("h4", "", heading));
  const list = createElement(ordered ? "ol" : "ul", className);
  for (const item of items) list.append(createElement("li", "", item));
  container.append(list);
}

function loadSelection() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return new Set(Array.isArray(stored) ? stored.filter((item) => typeof item === "string") : []);
  } catch {
    return new Set();
  }
}

function saveSelection() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...selectedIds]));
  } catch {
    // La lista sigue funcionando durante la sesión si el navegador bloquea almacenamiento local.
  }
}

function formatDate(date) {
  return new Intl.DateTimeFormat("es", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

function searchableText(platform) {
  return normalize([
    platform.name,
    platform.category,
    platform.summary,
    platform.regionNote,
    ...platform.actions.map((action) => action.label),
    ...platform.eligibleRequesters,
    ...platform.requirements,
    ...platform.warnings
  ].join(" "));
}

function createCard(platform) {
  const card = template.content.firstElementChild.cloneNode(true);
  card.id = `plataforma-${platform.id}`;
  card.querySelector(".category").textContent = platform.category;
  card.querySelector("h3").textContent = platform.name;
  card.querySelector(".summary").textContent = platform.summary;
  card.querySelector(".region-note").textContent = `Cobertura: ${platform.regionNote}`;

  const badge = card.querySelector(".verification-badge");
  const verified = platform.verification.status === "verified";
  badge.textContent = verified ? "Fuente verificada" : "Revisión pendiente";
  if (!verified) badge.classList.add("unverified");

  const tags = card.querySelector(".action-tags");
  for (const action of platform.actions) {
    tags.append(createElement("span", "action-tag", action.label));
  }

  const details = card.querySelector(".detail-content");
  appendList(details, "Quién puede solicitarlo", platform.eligibleRequesters);
  appendList(details, "Información o documentos indicados", platform.requirements);
  appendList(details, "Ruta recomendada", platform.steps, true);
  appendList(details, "Advertencias", platform.warnings, false, "warning-list");

  const officialLink = card.querySelector(".official-link");
  officialLink.href = platform.officialSource.url;
  officialLink.setAttribute("aria-label", `Abrir fuente oficial de ${platform.name} en una pestaña nueva`);

  const toggle = card.querySelector(".checklist-toggle");
  updateToggle(toggle, platform);
  toggle.addEventListener("click", () => {
    if (selectedIds.has(platform.id)) selectedIds.delete(platform.id);
    else selectedIds.add(platform.id);
    saveSelection();
    updateToggle(toggle, platform);
    renderChecklist();
  });

  const permalink = card.querySelector(".permalink");
  permalink.href = `plataformas/${platform.id}/`;
  permalink.setAttribute("aria-label", `Abrir ficha enlazable de ${platform.name}`);

  const reportLink = card.querySelector(".report-link");
  const reportUrl = new URL(ISSUE_URL);
  reportUrl.searchParams.set("template", "platform-update.yml");
  reportUrl.searchParams.set("title", `[${platform.name}] `);
  reportLink.href = reportUrl.toString();
  reportLink.setAttribute("aria-label", `Informar un cambio en la ficha de ${platform.name} en GitHub`);

  card.querySelector(".review-date").textContent = `Revisado: ${formatDate(platform.verification.reviewedAt)} · ${platform.officialSource.title}`;
  return card;
}

function updateToggle(button, platform) {
  const selected = selectedIds.has(platform.id);
  button.setAttribute("aria-pressed", String(selected));
  button.textContent = selected ? "Quitar de mi lista" : "Añadir a mi lista";
}

function renderDirectory() {
  const query = normalize(searchInput.value);
  const action = actionFilter.value;
  const visible = dataset.platforms.filter((platform) => {
    const matchesText = !query || searchableText(platform).includes(query);
    const matchesAction = action === "all" || platform.actions.some((item) => item.id === action);
    return matchesText && matchesAction;
  });

  grid.replaceChildren(...visible.map(createCard));
  grid.classList.toggle("single-result", visible.length === 1);
  resultsSummary.textContent = `${visible.length} de ${dataset.platforms.length} plataformas`;
  emptyState.hidden = visible.length !== 0;
}

function renderChecklist() {
  const selected = dataset.platforms.filter((platform) => selectedIds.has(platform.id));
  if (selected.length === 0) {
    checklistContent.replaceChildren(createElement("p", "", "Añade plataformas desde el directorio para preparar una lista."));
    printButton.disabled = true;
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const platform of selected) {
    const item = createElement("article", "checklist-item");
    item.append(createElement("h3", "", platform.name));
    appendList(item, "Antes de abrir la fuente oficial", platform.requirements);
    const source = createElement("p");
    const link = createElement("a", "", "Fuente oficial");
    link.href = platform.officialSource.url;
    source.append(link, document.createTextNode(` · revisada el ${formatDate(platform.verification.reviewedAt)}`));
    item.append(source);
    fragment.append(item);
  }
  checklistContent.replaceChildren(fragment);
  printButton.disabled = false;
}

function populateActions() {
  for (const [id, label] of Object.entries(dataset.actionDefinitions).sort((a, b) => a[1].localeCompare(b[1], "es"))) {
    const option = createElement("option", "", label);
    option.value = id;
    actionFilter.append(option);
  }
}

async function start() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    dataset = await response.json();
    selectedIds = new Set([...selectedIds].filter((id) => dataset.platforms.some((platform) => platform.id === id)));
    saveSelection();
    populateActions();
    datasetStatus.textContent = `${dataset.platforms.length} fuentes oficiales · datos revisados el ${formatDate(dataset.lastDatasetReview)}`;
    renderDirectory();
    renderChecklist();
  } catch (error) {
    datasetStatus.textContent = "No se pudieron cargar las fichas";
    const message = createElement("p", "error-message", "Error al cargar los datos. Abre el sitio mediante un servidor local o consulta el archivo JSON.");
    grid.replaceChildren(message);
    console.error(error);
  }
}

filters.addEventListener("input", () => renderDirectory());
filters.addEventListener("reset", () => requestAnimationFrame(renderDirectory));
printButton.addEventListener("click", () => window.print());

start();
