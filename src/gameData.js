import {
  Coins, TreePine, Mountain, Wheat, Warehouse, Home, Shield, Hammer,
  Store, Tent, Sparkles, Sprout, Anchor, Pickaxe, Eye, Flag,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Map / zone geometry
// ---------------------------------------------------------------------------

export const ZONE_COLS = 30;
export const ZONE_ROWS = 22;
export const ZONE_GRID_COLS = 2;
export const ZONE_GRID_ROWS = 2;
export const COLS = ZONE_COLS * ZONE_GRID_COLS;
export const ROWS = ZONE_ROWS * ZONE_GRID_ROWS;
export const TILE = 24;
export const TOWNHALL_ROW = 11;
export const TOWNHALL_COL = 15;

export const idx = (r, c) => r * COLS + c;
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const zoneIndexOf = (r, c) => Math.floor(r / ZONE_ROWS) * ZONE_GRID_COLS + Math.floor(c / ZONE_COLS);
export const zoneIndexOfTile = (index) => zoneIndexOf(Math.floor(index / COLS), index % COLS);

export const ZONE_META = [
  { id: 0, name: "Heimat", rowStart: 0, colStart: 0, tier: 0 },
  { id: 1, name: "Ostgebiet", rowStart: 0, colStart: ZONE_COLS, tier: 1 },
  { id: 2, name: "Südgebiet", rowStart: ZONE_ROWS, colStart: 0, tier: 1 },
  { id: 3, name: "Fernes Gebiet", rowStart: ZONE_ROWS, colStart: ZONE_COLS, tier: 2 },
];

export const ZONE_UNLOCK_COST = {
  1: { gold: 250, holz: 120, stein: 80 },
  2: { gold: 500, holz: 250, stein: 180 },
};
export const ZONE_DEFENSE = { 1: 20, 2: 35 };

export const FIRST_RAID_DELAY = 150;
export const SAVE_KEY = "kingdom-world-save-v1";

// ---------------------------------------------------------------------------
// Regions (visual theme only)
// ---------------------------------------------------------------------------

export const REGIONS = {
  europa: { name: "Europa", palette: { grass: "#7CAD5C", wald: ["#3F6B3A", "#4B7A44"], fels: ["#8C8375", "#9A9186"], wasser: ["#3E82B8", "#4C93C9"], gold: "#D8A94E", mine: ["#6B6459", "#7A7266"] } },
  aegypten: { name: "Ägypten", palette: { grass: "#D8C384", wald: ["#8C7A3F", "#9C8A4A"], fels: ["#B59A6A", "#C4A876"], wasser: ["#4C93C9", "#5AA3D6"], gold: "#E8C468", mine: ["#8A7A55", "#977F63"] } },
  peking: { name: "Ostasien", palette: { grass: "#8FB86B", wald: ["#3A6B3A", "#488048"], fels: ["#8C8375", "#9A9186"], wasser: ["#3E82B8", "#4C93C9"], gold: "#D8A94E", mine: ["#6B6459", "#7A7266"] } },
  groenland: { name: "Grönland", palette: { grass: "#D7E6E2", wald: ["#5C8A80", "#6C9A90"], fels: ["#A9B8B6", "#B8C6C4"], wasser: ["#6BAAD6", "#7ABAE6"], gold: "#E8D9A0", mine: ["#9AAAA6", "#A8B6B2"] } },
  sibirien: { name: "Sibirien", palette: { grass: "#CFE0D8", wald: ["#3F5C4A", "#4B6C56"], fels: ["#8C9A96", "#9AA8A4"], wasser: ["#5C93B8", "#6AA3C8"], gold: "#D8C888", mine: ["#7A8A84", "#889892"] } },
};

// ---------------------------------------------------------------------------
// Buildings / tools / resources / crafting
// ---------------------------------------------------------------------------

export const BUILDING_TYPES = {
  holzfaeller: { name: "Holzfäller-Hütte", icon: TreePine, color: "#5C7A45", cost: { gold: 50 }, produces: { holz: 3 } },
  steinbruch: { name: "Steinbruch", icon: Mountain, color: "#8C8375", cost: { gold: 60, holz: 20 }, produces: { stein: 3 } },
  bauernhof: { name: "Bauernhof", icon: Wheat, color: "#C99A3E", cost: { gold: 40, holz: 10 }, produces: { nahrung: 4 } },
  markt: { name: "Markt", icon: Store, color: "#B5843C", cost: { gold: 70, holz: 20 }, produces: {} },
  lager: { name: "Lager", icon: Warehouse, color: "#6B5B45", cost: { gold: 80, stein: 30 }, produces: {}, capBonus: 100 },
  haus: { name: "Haus", icon: Home, color: "#A9642F", cost: { gold: 30, holz: 15 }, produces: {}, popBonus: 2 },
  kaserne: { name: "Kaserne", icon: Tent, color: "#6E5230", cost: { gold: 90, holz: 40 }, produces: {}, troopBonus: 1 },
  wachposten: { name: "Wachposten", icon: Eye, color: "#4A5A3A", cost: { holz: 60, stein: 40 }, produces: {}, garrisonBuilding: true },
  mauer: { name: "Mauer", icon: Shield, color: "#6E6E68", cost: { stein: 20 }, produces: {} },
  schmiede: { name: "Schmiede", icon: Hammer, color: "#4A4A48", cost: { gold: 100, stein: 50, holz: 30 }, produces: {}, unlocksCraft: true },
  bruecke: { name: "Brücke", icon: Anchor, color: "#8B6B4A", cost: { holz: 40, stein: 20 }, produces: {}, buildOnWater: true },
  aussenposten: { name: "Außenposten", icon: Flag, color: "#3E6B4A", cost: {}, produces: {}, notBuildable: true },
};

export const TOOLS = { tool_pflanzen: { name: "Baum pflanzen", icon: Sprout, color: "#4B7A44", cost: { holz: 5 } } };

export const RESOURCE_META = {
  gold: { label: "Gold", icon: Coins, color: "#D8A94E" },
  holz: { label: "Holz", icon: TreePine, color: "#7A9256" },
  stein: { label: "Stein", icon: Mountain, color: "#8C8375" },
  nahrung: { label: "Nahrung", icon: Wheat, color: "#C77B3E" },
  erz: { label: "Erz", icon: Pickaxe, color: "#9AA0A6" },
};

export const JOB_META = {
  holzfaeller: { label: "Holzfäller", color: RESOURCE_META.holz.color },
  steinbruch: { label: "Steinmetz", color: RESOURCE_META.stein.color },
  bauernhof: { label: "Bauer", color: RESOURCE_META.nahrung.color },
  markt: { label: "Händler", color: RESOURCE_META.gold.color },
};

export const NODE_DEFS = {
  holz: { name: "Waldlager", icon: TreePine, cost: { nahrung: 5 }, time: 8, reward: { holz: 40 } },
  fels: { name: "Felsenlager", icon: Mountain, cost: { nahrung: 8 }, time: 12, reward: { stein: 35 } },
  gold: { name: "Goldhaufen", icon: Sparkles, cost: { nahrung: 10 }, time: 15, reward: { gold: 70 } },
  erz: { name: "Tiefe Mine", icon: Pickaxe, cost: { nahrung: 20 }, time: 30, reward: { erz: 60 } },
};

export const CRAFTS = [
  { id: "werkzeug", name: "Werkzeug", cost: { holz: 20, erz: 15 }, time: 8 },
  { id: "schwert", name: "Schwert", cost: { erz: 25, gold: 20 }, time: 12 },
  { id: "ruestung", name: "Rüstung", cost: { erz: 35, stein: 20 }, time: 15 },
];

export const TUTORIAL_STEPS = [
  "Willkommen in deinem neuen Reich! Das braune Feld in der Mitte ist dein Rathaus.",
  "Wähle unten ein Gebäude aus und tippe auf ein freies Feld deiner Landfarbe, um es zu bauen.",
  "Tippe direkt auf einen Baum, um Holz zu bekommen – oder auf Wald/Fels/Gold-Symbole, um einen Trupp loszuschicken.",
  "Im Fluss kannst du nach Gold suchen, und mit einer Brücke drüber bauen. Achtung: Feinde greifen irgendwann an – Mauern und Wachposten schützen dich! Mit Escape kommst du jederzeit ins Menü.",
  "Die Karte hat weitere, zunächst gesperrte Gebiete mit feindlichen Dörfern. Baue eine Kaserne, warte auf Truppen, und besiege das Dorf, um das Gebiet freizuschalten. Stationiere Truppen an einem Wachposten, um Angriffe abzuwehren.",
];

export const START_RESOURCES = { gold: 150, holz: 60, stein: 40, nahrung: 40, erz: 0 };
export const BASE_CAP = 300;

// ---------------------------------------------------------------------------
// Map generation
// ---------------------------------------------------------------------------

function generateZoneTerrain(terrain, nodes, rowStart, colStart) {
  const forestWidth = 2 + Math.floor(Math.random() * 3);
  const rockWidth = 2 + Math.floor(Math.random() * 3);
  for (let r = 0; r < ZONE_ROWS; r++) for (let c = 0; c < forestWidth; c++) if (Math.random() < 0.72) terrain[idx(rowStart + r, colStart + c)] = "wald";
  for (let r = 0; r < ZONE_ROWS; r++) for (let c = ZONE_COLS - rockWidth; c < ZONE_COLS; c++) if (Math.random() < 0.72) terrain[idx(rowStart + r, colStart + c)] = "fels";

  const safeMin = forestWidth + 2;
  const safeMax = ZONE_COLS - rockWidth - 5;
  const goldR = 1 + Math.floor(Math.random() * (ZONE_ROWS - 6));
  const goldC = safeMin + Math.floor(Math.random() * Math.max(1, safeMax - safeMin));
  for (let r = goldR; r < goldR + 3 && r < ZONE_ROWS; r++) for (let c = goldC; c < goldC + 3 && c < ZONE_COLS; c++) terrain[idx(rowStart + r, colStart + c)] = "gold";

  let mineR, mineC, tries = 0;
  do {
    mineR = 1 + Math.floor(Math.random() * (ZONE_ROWS - 6));
    mineC = safeMin + Math.floor(Math.random() * Math.max(1, safeMax - safeMin));
    tries++;
  } while (Math.abs(mineR - goldR) < 4 && Math.abs(mineC - goldC) < 4 && tries < 20);
  for (let r = mineR; r < mineR + 3 && r < ZONE_ROWS; r++) for (let c = mineC; c < mineC + 3 && c < ZONE_COLS; c++) terrain[idx(rowStart + r, colStart + c)] = "mine";

  const amp = 1.5 + Math.random() * 2.5;
  const phase = Math.random() * Math.PI * 2;
  const baseOffset = Math.floor(Math.random() * 7) - 3;
  for (let r = 0; r < ZONE_ROWS; r++) {
    let center = Math.round(ZONE_COLS / 2 + baseOffset + Math.sin(r / 2.2 + phase) * amp);
    center = clamp(center, forestWidth + 1, ZONE_COLS - rockWidth - 3);
    terrain[idx(rowStart + r, colStart + center)] = "wasser";
    terrain[idx(rowStart + r, colStart + Math.min(center + 1, ZONE_COLS - 1))] = "wasser";
  }

  const poolOf = (type) => {
    const arr = [];
    for (let r = 0; r < ZONE_ROWS; r++) for (let c = 0; c < ZONE_COLS; c++) if (terrain[idx(rowStart + r, colStart + c)] === type) arr.push(idx(rowStart + r, colStart + c));
    return arr;
  };
  const woodPool = poolOf("wald"); if (woodPool.length) nodes[pickRandom(woodPool)] = "holz";
  const rockPool = poolOf("fels"); if (rockPool.length) nodes[pickRandom(rockPool)] = "fels";
  const goldPool = poolOf("gold"); if (goldPool.length) nodes[pickRandom(goldPool)] = "gold";
  const minePool = poolOf("mine"); if (minePool.length) nodes[pickRandom(minePool)] = "erz";
}

export function generateMap() {
  const terrain = new Array(COLS * ROWS).fill("grass");
  const nodes = {};
  const npcVillages = {};

  ZONE_META.forEach((zone) => {
    generateZoneTerrain(terrain, nodes, zone.rowStart, zone.colStart);

    if (zone.tier === 0) {
      terrain[idx(TOWNHALL_ROW, TOWNHALL_COL)] = "grass";
      [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
        const rr = TOWNHALL_ROW + dr, cc = TOWNHALL_COL + dc;
        if (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS) terrain[idx(rr, cc)] = "grass";
      });
    } else {
      let vr = zone.rowStart + Math.floor(ZONE_ROWS / 2);
      let vc = zone.colStart + Math.floor(ZONE_COLS / 2);
      let tries = 0;
      while (terrain[idx(vr, vc)] !== "grass" && tries < 40) {
        vr = zone.rowStart + 2 + Math.floor(Math.random() * (ZONE_ROWS - 4));
        vc = zone.colStart + 2 + Math.floor(Math.random() * (ZONE_COLS - 4));
        tries++;
      }
      terrain[idx(vr, vc)] = "grass";
      npcVillages[zone.id] = { tileIndex: idx(vr, vc), defense: ZONE_DEFENSE[zone.tier] };
    }
  });

  return { terrain, nodes, npcVillages };
}

export function getTileBg(region, type) {
  const p = REGIONS[region].palette;
  if (type === "grass") return p.grass;
  if (type === "gold") return p.gold;
  if (type === "wald") return `repeating-linear-gradient(135deg, ${p.wald[0]}, ${p.wald[0]} 5px, ${p.wald[1]} 5px, ${p.wald[1]} 10px)`;
  if (type === "fels") return `repeating-linear-gradient(135deg, ${p.fels[0]}, ${p.fels[0]} 5px, ${p.fels[1]} 5px, ${p.fels[1]} 10px)`;
  if (type === "wasser") return `repeating-linear-gradient(120deg, ${p.wasser[0]}, ${p.wasser[0]} 6px, ${p.wasser[1]} 6px, ${p.wasser[1]} 12px)`;
  if (type === "mine") return `repeating-linear-gradient(135deg, ${p.mine[0]}, ${p.mine[0]} 5px, ${p.mine[1]} 5px, ${p.mine[1]} 10px)`;
  return p.grass;
}

// ---------------------------------------------------------------------------
// Small pure helpers
// ---------------------------------------------------------------------------

export function canAfford(resources, cost) { return Object.entries(cost).every(([k, v]) => (resources[k] || 0) >= v); }
export function pay(resources, cost) { const n = { ...resources }; Object.entries(cost).forEach(([k, v]) => (n[k] -= v)); return n; }
export function clampCap(resources, cap) { const n = { ...resources }; Object.keys(n).forEach((k) => (n[k] = Math.max(0, Math.min(n[k], cap)))); return n; }

// ---------------------------------------------------------------------------
// Global styles (fonts, keyframes, hover/press states, 3D + fog effects)
// ---------------------------------------------------------------------------

export const GLOBAL_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

@keyframes marketPulse {
  0% { box-shadow: 0 0 0 0 rgba(216,169,78,0.55); }
  100% { box-shadow: 0 0 16px 8px rgba(216,169,78,0); }
}
.market-pulse { position: absolute; inset: 0; border-radius: 4px; animation: marketPulse 0.7s ease-out; pointer-events: none; }

@keyframes waterShimmer {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.08); }
}
.tile-water { animation: waterShimmer 3.5s ease-in-out infinite; }

@keyframes dotBob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-1.5px); }
}
.dot-bob { animation: dotBob 1.6s ease-in-out infinite; }

.reduce-motion .tile-water,
.reduce-motion .dot-bob,
.reduce-motion .market-pulse {
  animation: none !important;
}

.kw-btn { transition: transform 0.12s ease, filter 0.12s ease; }
.kw-btn:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
.kw-btn:active:not(:disabled) { transform: translateY(0); filter: brightness(0.95); }

.kw-tile { transition: filter 0.12s ease; }
.kw-tile:hover { filter: brightness(1.18); }

.kw-building { box-shadow: inset 0 -3px 0 rgba(0,0,0,0.18), inset 0 2px 0 rgba(255,255,255,0.14); }

.kw-building-3d {
  box-shadow: inset 0 -3px 0 rgba(0,0,0,0.18), inset 0 2px 0 rgba(255,255,255,0.14), 0 3px 0 rgba(0,0,0,0.22), 0 6px 7px rgba(0,0,0,0.28);
}

.kw-townhall { position: relative; }
.kw-townhall::after { content: ""; position: absolute; top: -4px; left: 50%; transform: translateX(-50%); width: 3px; height: 9px; background: #C24A4A; border-radius: 1px 1px 0 0; }

.zone-fog { position: absolute; inset: 0; background: rgba(10,14,10,0.55); pointer-events: none; }
`;
