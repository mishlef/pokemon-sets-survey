/* ============================================================
   State
   ============================================================ */

const STORAGE_KEY = "pokemon-set-survey-state-v1";

// counts[pokemonName][setName] = integer
// counts[pokemonName]["__otherLabel"] = free text for what "Other" was
let counts = loadState();
let expandedPokemon = null;
let searchQuery = "";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore corrupt storage */ }
  return {};
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
}

function getCount(pokemon, set) {
  return (counts[pokemon] && counts[pokemon][set]) || 0;
}

function setCount(pokemon, set, value) {
  value = Math.max(0, parseInt(value, 10) || 0);
  if (!counts[pokemon]) counts[pokemon] = {};
  counts[pokemon][set] = value;
  saveState();
}

function pokemonEntryTotal(pokemon) {
  const entry = counts[pokemon];
  if (!entry) return 0;
  return Object.keys(entry)
    .filter(k => k !== "__otherLabel")
    .reduce((sum, k) => sum + (entry[k] || 0), 0);
}

/* ============================================================
   Rendering — Survey grid
   ============================================================ */

const gridEl = document.getElementById("pokemon-grid");
const progressLabel = document.getElementById("progress-label");

function spriteUrl(slug) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${slug}.png`;
}

function renderGrid() {
  const filtered = POKEMON_DATA.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  gridEl.innerHTML = "";

  filtered.forEach(p => {
    if (expandedPokemon === p.name) {
      gridEl.appendChild(buildExpandedCard(p));
    } else {
      gridEl.appendChild(buildCollapsedCard(p));
    }
  });

  const loggedCount = POKEMON_DATA.filter(p => pokemonEntryTotal(p.name) > 0).length;
  progressLabel.textContent = `${loggedCount} / ${POKEMON_DATA.length} Pokémon logged`;
}

function buildCollapsedCard(p) {
  const card = document.createElement("div");
  const total = pokemonEntryTotal(p.name);
  card.className = "card" + (total > 0 ? " has-entries" : "");
  card.innerHTML = `
    <div class="card-top">
      <img class="sprite" src="${spriteUrl(p.sprite)}" alt="${p.name}" loading="lazy" onerror="this.style.visibility='hidden'">
      <div class="card-name">${p.name}</div>
    </div>
    ${total > 0 ? `<div class="card-count-badge">${total} logged</div>` : ""}
  `;
  card.addEventListener("click", () => {
    expandedPokemon = p.name;
    renderGrid();
    setTimeout(() => {
      const el = document.getElementById("expand-" + p.name);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 0);
  });
  return card;
}

function buildExpandedCard(p) {
  const wrap = document.createElement("div");
  wrap.className = "card-expand";
  wrap.id = "expand-" + p.name;

  const header = document.createElement("div");
  header.className = "card-expand-header";
  header.innerHTML = `
    <img class="sprite" src="${spriteUrl(p.sprite)}" alt="${p.name}" onerror="this.style.visibility='hidden'">
    <div class="name">${p.name}</div>
    <button class="close-btn" aria-label="Close">×</button>
  `;
  header.querySelector(".close-btn").addEventListener("click", () => {
    expandedPokemon = null;
    renderGrid();
  });
  wrap.appendChild(header);

  p.sets.forEach(setName => {
    wrap.appendChild(buildSetRow(p.name, setName));
  });

  // "Other" catch-all row
  const otherRow = document.createElement("div");
  otherRow.className = "set-row other-row";
  const otherLabel = (counts[p.name] && counts[p.name].__otherLabel) || "";
  otherRow.innerHTML = `
    <input type="text" class="other-label-input" placeholder="Other set (optional note)" value="${escapeAttr(otherLabel)}" style="flex:1; margin-right:10px;">
  `;
  const otherStepper = buildStepper(p.name, "Other");
  otherRow.appendChild(otherStepper);
  otherRow.querySelector(".other-label-input").addEventListener("input", (e) => {
    if (!counts[p.name]) counts[p.name] = {};
    counts[p.name].__otherLabel = e.target.value;
    saveState();
  });
  wrap.appendChild(otherRow);

  return wrap;
}

function buildSetRow(pokemonName, setName) {
  const row = document.createElement("div");
  row.className = "set-row";
  const label = document.createElement("div");
  label.className = "set-name";
  label.textContent = setName;
  row.appendChild(label);
  row.appendChild(buildStepper(pokemonName, setName));
  return row;
}

function buildStepper(pokemonName, setName) {
  const stepper = document.createElement("div");
  stepper.className = "stepper";

  const minus = document.createElement("button");
  minus.textContent = "–";
  minus.addEventListener("click", () => {
    setCount(pokemonName, setName, getCount(pokemonName, setName) - 1);
    renderGrid();
  });

  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.value = getCount(pokemonName, setName);
  input.addEventListener("change", () => {
    setCount(pokemonName, setName, input.value);
    renderGrid();
  });

  const plus = document.createElement("button");
  plus.textContent = "+";
  plus.addEventListener("click", () => {
    setCount(pokemonName, setName, getCount(pokemonName, setName) + 1);
    renderGrid();
  });

  stepper.appendChild(minus);
  stepper.appendChild(input);
  stepper.appendChild(plus);
  return stepper;
}

function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}

document.getElementById("search").addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderGrid();
});

document.getElementById("clear-btn").addEventListener("click", () => {
  if (!confirm("Clear all logged counts? This can't be undone.")) return;
  counts = {};
  saveState();
  renderGrid();
});

/* ============================================================
   CSV export + submission
   ============================================================ */

function buildRows() {
  const rows = [];
  POKEMON_DATA.forEach(p => {
    const entry = counts[p.name];
    if (!entry) return;
    p.sets.concat(["Other"]).forEach(setName => {
      const count = entry[setName] || 0;
      if (count > 0) {
        const label = setName === "Other" && entry.__otherLabel ? entry.__otherLabel : "";
        rows.push({ pokemon: p.name, set: setName, other_note: label, count });
      }
    });
  });
  return rows;
}

function toCsv(rows) {
  const header = "pokemon,set,other_note,count";
  const lines = rows.map(r =>
    [r.pokemon, r.set, r.other_note, r.count]
      .map(v => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header, ...lines].join("\n");
}

document.getElementById("export-csv-btn").addEventListener("click", () => {
  const rows = buildRows();
  if (rows.length === 0) {
    setStatus("Nothing logged yet — nothing to export.", "error");
    return;
  }
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pokemon-set-survey-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  setStatus(`Exported ${rows.length} rows.`, "success");
});

document.getElementById("submit-btn").addEventListener("click", async () => {
  const rows = buildRows();
  if (rows.length === 0) {
    setStatus("Nothing logged yet — nothing to submit.", "error");
    return;
  }
  if (!WEBHOOK_URL) {
    setStatus("No webhook configured (see config.js) — use Export CSV instead.", "error");
    return;
  }
  setStatus("Submitting…", "");
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors", // Apps Script web apps don't return readable CORS headers by default
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ submitted_at: new Date().toISOString(), rows }),
    });
    // no-cors means we can't read the response — treat the absence of a thrown error as success
    setStatus(`Submitted ${rows.length} rows. Thank you!`, "success");
  } catch (err) {
    setStatus("Submission failed — check your connection and try again.", "error");
  }
});

function setStatus(msg, kind) {
  const el = document.getElementById("status-msg");
  el.textContent = msg;
  el.className = "status-msg" + (kind ? " " + kind : "");
}

/* ============================================================
   Tabs
   ============================================================ */

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.panel).classList.add("active");
    document.getElementById("survey-footer").style.display =
      btn.dataset.panel === "survey-panel" ? "flex" : "none";
  });
});

/* ============================================================
   Team Tally Tool — parses Showdown export format
   ============================================================ */

function parseShowdownExport(text) {
  // A new Pokémon entry starts with a line like: "Name @ Item" or just "Name"
  // (Showdown also allows "Nickname (Species) @ Item" and gender markers like "(M)"/"(F)")
  const lines = text.split("\n");
  const tally = {}; // key: "Pokemon||Item" -> count

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (!line.includes("@")) continue; // only lines declaring an item mark a new mon here
    // Skip lines that are clearly not the header line (Ability:, EVs:, moves starting with "-")
    if (/^(Ability|EVs|IVs|Level|Shiny|Happiness|Tera Type)\s*:/i.test(line)) continue;
    if (line.startsWith("-")) continue;

    const [namePart, itemPartRaw] = line.split("@");
    let name = namePart.trim();
    // Strip gender markers first, e.g. "Landorus-Therian (M)" -> "Landorus-Therian"
    name = name.replace(/\s*\((M|F)\)\s*$/i, "").trim();
    // Strip nickname: "Nickname (Species)" -> Species
    const speciesMatch = name.match(/\(([^)]+)\)/);
    if (speciesMatch) name = speciesMatch[1].trim();

    const item = (itemPartRaw || "").trim() || "(no item)";

    const key = name + "||" + item;
    tally[key] = (tally[key] || 0) + 1;
  }

  return Object.entries(tally)
    .map(([key, count]) => {
      const [pokemon, item] = key.split("||");
      return { pokemon, item, count };
    })
    .sort((a, b) => b.count - a.count || a.pokemon.localeCompare(b.pokemon));
}

document.getElementById("tally-run-btn").addEventListener("click", () => {
  const text = document.getElementById("tally-input").value;
  const results = parseShowdownExport(text);
  const tbody = document.getElementById("tally-tbody");
  tbody.innerHTML = "";
  if (results.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3">No "Name @ Item" lines found. Make sure you pasted the standard export format.</td></tr>`;
    return;
  }
  results.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${r.pokemon}</td><td>${r.item}</td><td>${r.count}</td>`;
    tbody.appendChild(tr);
  });
});

document.getElementById("tally-clear-btn").addEventListener("click", () => {
  document.getElementById("tally-input").value = "";
  document.getElementById("tally-tbody").innerHTML = "";
});

/* ============================================================
   Init
   ============================================================ */

renderGrid();
