import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Coins, TreePine, Mountain, Wheat, Warehouse, Home, Shield, Hammer,
  Landmark, Users, Pickaxe, Store, Tent, Sparkles, Sprout, Anchor,
  Swords, Skull, Egg, ZoomIn, ZoomOut, RotateCcw, X, Menu, Settings, ScrollText,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const COLS = 30;
const ROWS = 22;
const TILE = 24;
const TOWNHALL_ROW = 11;
const TOWNHALL_COL = 15;
const idx = (r, c) => r * COLS + c;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const REGIONS = {
  europa: { name: "Europa", palette: { grass: "#7CAD5C", wald: ["#3F6B3A", "#4B7A44"], fels: ["#8C8375", "#9A9186"], wasser: ["#3E82B8", "#4C93C9"], gold: "#D8A94E", mine: ["#6B6459", "#7A7266"] } },
  aegypten: { name: "Ägypten", palette: { grass: "#D8C384", wald: ["#8C7A3F", "#9C8A4A"], fels: ["#B59A6A", "#C4A876"], wasser: ["#4C93C9", "#5AA3D6"], gold: "#E8C468", mine: ["#8A7A55", "#977F63"] } },
  peking: { name: "Ostasien", palette: { grass: "#8FB86B", wald: ["#3A6B3A", "#488048"], fels: ["#8C8375", "#9A9186"], wasser: ["#3E82B8", "#4C93C9"], gold: "#D8A94E", mine: ["#6B6459", "#7A7266"] } },
  groenland: { name: "Grönland", palette: { grass: "#D7E6E2", wald: ["#5C8A80", "#6C9A90"], fels: ["#A9B8B6", "#B8C6C4"], wasser: ["#6BAAD6", "#7ABAE6"], gold: "#E8D9A0", mine: ["#9AAAA6", "#A8B6B2"] } },
  sibirien: { name: "Sibirien", palette: { grass: "#CFE0D8", wald: ["#3F5C4A", "#4B6C56"], fels: ["#8C9A96", "#9AA8A4"], wasser: ["#5C93B8", "#6AA3C8"], gold: "#D8C888", mine: ["#7A8A84", "#889892"] } },
};

const BUILDING_TYPES = {
  holzfaeller: { name: "Holzfäller-Hütte", icon: TreePine, color: "#5C7A45", cost: { gold: 50 }, produces: { holz: 3 } },
  steinbruch: { name: "Steinbruch", icon: Mountain, color: "#8C8375", cost: { gold: 60, holz: 20 }, produces: { stein: 3 } },
  bauernhof: { name: "Bauernhof", icon: Wheat, color: "#C99A3E", cost: { gold: 40, holz: 10 }, produces: { nahrung: 4 } },
  markt: { name: "Markt", icon: Store, color: "#B5843C", cost: { gold: 70, holz: 20 }, produces: {} },
  lager: { name: "Lager", icon: Warehouse, color: "#6B5B45", cost: { gold: 80, stein: 30 }, produces: {}, capBonus: 100 },
  haus: { name: "Haus", icon: Home, color: "#A9642F", cost: { gold: 30, holz: 15 }, produces: {}, popBonus: 2 },
  kaserne: { name: "Kaserne", icon: Tent, color: "#6E5230", cost: { gold: 90, holz: 40 }, produces: {}, troopBonus: 1 },
  mauer: { name: "Mauer", icon: Shield, color: "#6E6E68", cost: { stein: 20 }, produces: {} },
  schmiede: { name: "Schmiede", icon: Hammer, color: "#4A4A48", cost: { gold: 100, stein: 50, holz: 30 }, produces: {}, unlocksCraft: true },
  bruecke: { name: "Brücke", icon: Anchor, color: "#8B6B4A", cost: { holz: 40, stein: 20 }, produces: {}, buildOnWater: true },
};

const TOOLS = { tool_pflanzen: { name: "Baum pflanzen", icon: Sprout, color: "#4B7A44", cost: { holz: 5 } } };

const RESOURCE_META = {
  gold: { label: "Gold", icon: Coins, color: "#D8A94E" },
  holz: { label: "Holz", icon: TreePine, color: "#7A9256" },
  stein: { label: "Stein", icon: Mountain, color: "#8C8375" },
  nahrung: { label: "Nahrung", icon: Wheat, color: "#C77B3E" },
  erz: { label: "Erz", icon: Pickaxe, color: "#9AA0A6" },
};

const NODE_DEFS = {
  holz: { name: "Waldlager", icon: TreePine, cost: { nahrung: 5 }, time: 8, reward: { holz: 40 } },
  fels: { name: "Felsenlager", icon: Mountain, cost: { nahrung: 8 }, time: 12, reward: { stein: 35 } },
  gold: { name: "Goldhaufen", icon: Sparkles, cost: { nahrung: 10 }, time: 15, reward: { gold: 70 } },
  erz: { name: "Tiefe Mine", icon: Pickaxe, cost: { nahrung: 20 }, time: 30, reward: { erz: 60 } },
};

const CRAFTS = [
  { id: "werkzeug", name: "Werkzeug", cost: { holz: 20, erz: 15 }, time: 8 },
  { id: "schwert", name: "Schwert", cost: { erz: 25, gold: 20 }, time: 12 },
  { id: "ruestung", name: "Rüstung", cost: { erz: 35, stein: 20 }, time: 15 },
];

const TUTORIAL_STEPS = [
  "Willkommen in deinem neuen Reich! Das braune Feld in der Mitte ist dein Rathaus.",
  "Wähle unten ein Gebäude aus und tippe auf ein freies Feld deiner Landfarbe, um es zu bauen.",
  "Tippe direkt auf einen Baum, um Holz zu bekommen – oder auf Wald/Fels/Gold-Symbole, um einen Trupp loszuschicken.",
  "Im Fluss kannst du nach Gold suchen, und mit einer Brücke drüber bauen. Achtung: Feinde greifen gelegentlich an – Mauern schützen dich! Mit Escape kommst du jederzeit ins Menü.",
];

const START_RESOURCES = { gold: 150, holz: 60, stein: 40, nahrung: 40, erz: 0 };
const BASE_CAP = 300;

function generateMap() {
  const terrain = new Array(COLS * ROWS).fill("grass");
  const nodes = {};

  const forestWidth = 2 + Math.floor(Math.random() * 3);
  const rockWidth = 2 + Math.floor(Math.random() * 3);
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < forestWidth; c++) if (Math.random() < 0.72) terrain[idx(r, c)] = "wald";
  for (let r = 0; r < ROWS; r++) for (let c = COLS - rockWidth; c < COLS; c++) if (Math.random() < 0.72) terrain[idx(r, c)] = "fels";

  const safeMin = forestWidth + 2;
  const safeMax = COLS - rockWidth - 5;
  const goldR = 1 + Math.floor(Math.random() * (ROWS - 6));
  const goldC = safeMin + Math.floor(Math.random() * Math.max(1, safeMax - safeMin));
  for (let r = goldR; r < goldR + 3 && r < ROWS; r++) for (let c = goldC; c < goldC + 3 && c < COLS; c++) terrain[idx(r, c)] = "gold";

  let mineR, mineC, tries = 0;
  do {
    mineR = 1 + Math.floor(Math.random() * (ROWS - 6));
    mineC = safeMin + Math.floor(Math.random() * Math.max(1, safeMax - safeMin));
    tries++;
  } while (Math.abs(mineR - goldR) < 4 && Math.abs(mineC - goldC) < 4 && tries < 20);
  for (let r = mineR; r < mineR + 3 && r < ROWS; r++) for (let c = mineC; c < mineC + 3 && c < COLS; c++) terrain[idx(r, c)] = "mine";

  const amp = 1.5 + Math.random() * 2.5;
  const phase = Math.random() * Math.PI * 2;
  const baseOffset = Math.floor(Math.random() * 7) - 3;
  for (let r = 0; r < ROWS; r++) {
    let center = Math.round(COLS / 2 + baseOffset + Math.sin(r / 2.2 + phase) * amp);
    center = clamp(center, forestWidth + 1, COLS - rockWidth - 3);
    terrain[idx(r, center)] = "wasser";
    terrain[idx(r, Math.min(center + 1, COLS - 1))] = "wasser";
  }

  terrain[idx(TOWNHALL_ROW, TOWNHALL_COL)] = "grass";
  [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
    const rr = TOWNHALL_ROW + dr, cc = TOWNHALL_COL + dc;
    if (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS) terrain[idx(rr, cc)] = "grass";
  });

  const poolOf = (type) => { const arr = []; terrain.forEach((t, i) => { if (t === type) arr.push(i); }); return arr; };
  const woodPool = poolOf("wald"); if (woodPool.length) nodes[pickRandom(woodPool)] = "holz";
  const rockPool = poolOf("fels"); if (rockPool.length) nodes[pickRandom(rockPool)] = "fels";
  const goldPool = poolOf("gold"); if (goldPool.length) nodes[pickRandom(goldPool)] = "gold";
  const minePool = poolOf("mine"); if (minePool.length) nodes[pickRandom(minePool)] = "erz";

  return { terrain, nodes };
}

function getTileBg(region, type) {
  const p = REGIONS[region].palette;
  if (type === "grass") return p.grass;
  if (type === "gold") return p.gold;
  if (type === "wald") return `repeating-linear-gradient(135deg, ${p.wald[0]}, ${p.wald[0]} 5px, ${p.wald[1]} 5px, ${p.wald[1]} 10px)`;
  if (type === "fels") return `repeating-linear-gradient(135deg, ${p.fels[0]}, ${p.fels[0]} 5px, ${p.fels[1]} 5px, ${p.fels[1]} 10px)`;
  if (type === "wasser") return `repeating-linear-gradient(120deg, ${p.wasser[0]}, ${p.wasser[0]} 6px, ${p.wasser[1]} 6px, ${p.wasser[1]} 12px)`;
  if (type === "mine") return `repeating-linear-gradient(135deg, ${p.mine[0]}, ${p.mine[0]} 5px, ${p.mine[1]} 5px, ${p.mine[1]} 10px)`;
  return p.grass;
}

function canAfford(resources, cost) { return Object.entries(cost).every(([k, v]) => (resources[k] || 0) >= v); }
function pay(resources, cost) { const n = { ...resources }; Object.entries(cost).forEach(([k, v]) => (n[k] -= v)); return n; }
function clampCap(resources, cap) { const n = { ...resources }; Object.keys(n).forEach((k) => (n[k] = Math.max(0, Math.min(n[k], cap)))); return n; }

// ---------------------------------------------------------------------------
// UI pieces
// ---------------------------------------------------------------------------

function ResourceBar({ resources, cap }) {
  return (
    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
      {Object.entries(RESOURCE_META).map(([key, meta]) => {
        const Icon = meta.icon;
        const val = Math.floor(resources[key] || 0);
        const atCap = val >= cap;
        return (
          <div key={key} title={`${meta.label}: ${val} / ${cap}`} style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(255,255,255,0.1)", padding: "5px 9px", borderRadius: "8px", minWidth: "64px" }}>
            <Icon size={14} color={meta.color} />
            <span style={{ color: atCap ? "#E8A57C" : "#F3F7EE", fontWeight: 600, fontSize: "12px" }}>{val}</span>
          </div>
        );
      })}
    </div>
  );
}

function ProgressBar({ pct, color }) {
  return (
    <div style={{ width: "100%", height: "5px", background: "rgba(0,0,0,0.18)", borderRadius: "4px", overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, transition: "width 1s linear" }} />
    </div>
  );
}

function SpawnScreen({ onPick }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #BFE3D6 0%, #8FBFA8 45%, #4C8C6B 100%)", padding: "24px", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');`}</style>
      <div style={{ maxWidth: "420px", width: "100%", background: "#F3F7EE", borderRadius: "16px", padding: "26px 22px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
        <div style={{ fontFamily: "Cinzel, serif", fontSize: "22px", fontWeight: 700, color: "#1F3B2C", marginBottom: "8px" }}>Wähle deinen Startort</div>
        <div style={{ fontSize: "12.5px", color: "#5C6B5A", marginBottom: "18px" }}>Vereinfachte Vorschau: die Region ändert aktuell nur das Farbthema deiner Karte.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {Object.entries(REGIONS).map(([key, r]) => (
            <button key={key} onClick={() => onPick(key)} style={{ padding: "14px 8px", borderRadius: "10px", border: "none", background: r.palette.grass, color: "#1F3B2C", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>{r.name}</button>
          ))}
          <button onClick={() => onPick(Object.keys(REGIONS)[Math.floor(Math.random() * Object.keys(REGIONS).length)])}
            style={{ gridColumn: "1 / -1", padding: "12px", borderRadius: "10px", border: "2px dashed #1F3B2C", background: "transparent", color: "#1F3B2C", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>🎲 Zufällig</button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function KingdomWorld() {
  const [region, setRegion] = useState(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [mapData, setMapData] = useState(generateMap);
  const { terrain, nodes } = mapData;
  const [buildings, setBuildings] = useState({ [idx(TOWNHALL_ROW, TOWNHALL_COL)]: "rathaus" });
  const [resources, setResources] = useState(START_RESOURCES);
  const [selectedType, setSelectedType] = useState(null);
  const [expeditions, setExpeditions] = useState([]);
  const [tab, setTab] = useState("basis");
  const [crafts, setCrafts] = useState([]);
  const [inventory, setInventory] = useState({ werkzeug: 0, schwert: 0, ruestung: 0 });
  const [villagersOn, setVillagersOn] = useState(true);
  const [villagerDots, setVillagerDots] = useState([]);
  const [guardDots, setGuardDots] = useState([]);
  const [chickenDots, setChickenDots] = useState([]);
  const [message, setMessage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 56 });
  const [raidTimer, setRaidTimer] = useState(55);
  const [gameOver, setGameOver] = useState(false);
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [raidsPaused, setRaidsPaused] = useState(false);
  const [raidMin, setRaidMin] = useState(50);
  const [raidMax, setRaidMax] = useState(80);
  const [raidLog, setRaidLog] = useState([]);
  const [devPopBonus, setDevPopBonus] = useState(0);
  const [selectedInfo, setSelectedInfo] = useState(null);

  const tickRef = useRef(0);
  const dragRef = useRef({ down: false, dragging: false, sx: 0, sy: 0, px: 0, py: 0 });
  const suppressClickRef = useRef(false);
  const resourcesRef = useRef(resources);
  const searchCooldownRef = useRef({});

  useEffect(() => { resourcesRef.current = resources; }, [resources]);

  const houseCount = Object.values(buildings).filter((b) => b === "haus").length;
  const lagerCount = Object.values(buildings).filter((b) => b === "lager").length;
  const kaserneCount = Object.values(buildings).filter((b) => b === "kaserne").length;
  const mauerCount = Object.values(buildings).filter((b) => b === "mauer").length;
  const marktCount = Object.values(buildings).filter((b) => b === "markt").length;
  const bauernhofIndices = Object.entries(buildings).filter(([, v]) => v === "bauernhof").map(([k]) => Number(k));
  const hasSchmiede = Object.values(buildings).includes("schmiede");
  const population = 2 + houseCount * 2 + devPopBonus;
  const cap = BASE_CAP + lagerCount * 100;
  const maxTroops = 1 + kaserneCount;

  const flash = useCallback((text) => {
    setMessage(text);
    setTimeout(() => setMessage((m) => (m === text ? null : m)), 2400);
  }, []);

  function isPassable(index) { return !(terrain[index] === "wasser" && buildings[index] !== "bruecke"); }
  function pctToIndex(xPct, yPct) {
    const c = clamp(Math.floor((xPct / 100) * COLS), 0, COLS - 1);
    const r = clamp(Math.floor((yPct / 100) * ROWS), 0, ROWS - 1);
    return idx(r, c);
  }

  // Escape key -> pause menu
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && region && !gameOver) {
        setShowDevPanel(false);
        setShowPauseMenu((s) => !s);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [region, gameOver]);

  useEffect(() => {
    if (!region) return;
    const count = villagersOn ? Math.min(population, 6) : 0;
    setVillagerDots((prev) => {
      const next = [...prev];
      while (next.length < count) next.push({ id: next.length, x: 46 + Math.random() * 10, y: 46 + Math.random() * 10 });
      return next.slice(0, count);
    });
  }, [population, villagersOn, region]);

  useEffect(() => {
    if (!region) return;
    const count = villagersOn ? Math.min(kaserneCount * 2, 4) : 0;
    setGuardDots((prev) => {
      const next = [...prev];
      while (next.length < count) next.push({ id: next.length, x: 46 + Math.random() * 10, y: 46 + Math.random() * 10 });
      return next.slice(0, count);
    });
  }, [kaserneCount, villagersOn, region]);

  useEffect(() => {
    if (!region) return;
    const count = Math.min(bauernhofIndices.length, 4);
    setChickenDots((prev) => {
      const next = [...prev];
      while (next.length < count) {
        const homeIdx = bauernhofIndices[next.length];
        const r = Math.floor(homeIdx / COLS), c = homeIdx % COLS;
        next.push({ id: next.length, x: ((c + 0.5) / COLS) * 100, y: ((r + 0.5) / ROWS) * 100, hx: ((c + 0.5) / COLS) * 100, hy: ((r + 0.5) / ROWS) * 100 });
      }
      return next.slice(0, count);
    });
  }, [bauernhofIndices.length, region]);

  useEffect(() => {
    if (!region || gameOver) return;
    const interval = setInterval(() => {
      tickRef.current += 1;
      const t = tickRef.current;

      if (t % 4 === 0) {
        setResources((prev) => {
          const gain = {};
          Object.values(buildings).forEach((type) => {
            const def = BUILDING_TYPES[type];
            if (def?.produces) Object.entries(def.produces).forEach(([k, v]) => (gain[k] = (gain[k] || 0) + v));
          });
          let next = { ...prev };
          Object.entries(gain).forEach(([k, v]) => (next[k] = (next[k] || 0) + v));
          for (let i = 0; i < marktCount; i++) if (next.nahrung >= 8) { next.nahrung -= 8; next.gold += 10; }
          return clampCap(next, cap);
        });
      }

      setExpeditions((prev) => prev.map((e) => ({ ...e, remaining: e.remaining - 1 })).filter((e) => {
        if (e.remaining <= 0) {
          const def = NODE_DEFS[e.key];
          setResources((r) => clampCap({ ...r, ...Object.fromEntries(Object.entries(def.reward).map(([k, v]) => [k, (r[k] || 0) + v])) }, cap));
          flash(`Trupp zurück von "${def.name}": +${Object.entries(def.reward).map(([k, v]) => `${v} ${RESOURCE_META[k].label}`).join(", ")}`);
          return false;
        }
        return true;
      }));

      setCrafts((prev) => prev.map((c) => ({ ...c, remaining: c.remaining - 1 })).filter((c) => {
        if (c.remaining <= 0) {
          const def = CRAFTS.find((x) => x.id === c.id);
          setInventory((inv) => ({ ...inv, [c.id]: (inv[c.id] || 0) + 1 }));
          flash(`Schmiede fertig: ${def.name}`);
          return false;
        }
        return true;
      }));

      setVillagerDots((prev) => prev.map((v) => {
        const nx = clamp(v.x + (Math.random() * 10 - 5), 4, 96);
        const ny = clamp(v.y + (Math.random() * 10 - 5), 4, 96);
        return isPassable(pctToIndex(nx, ny)) ? { ...v, x: nx, y: ny } : v;
      }));
      setGuardDots((prev) => prev.map((v) => {
        const nx = clamp(v.x + (Math.random() * 8 - 4), 4, 96);
        const ny = clamp(v.y + (Math.random() * 8 - 4), 4, 96);
        return isPassable(pctToIndex(nx, ny)) ? { ...v, x: nx, y: ny } : v;
      }));
      setChickenDots((prev) => prev.map((c) => ({ ...c, x: clamp(c.hx + (Math.random() * 8 - 4), 0, 100), y: clamp(c.hy + (Math.random() * 8 - 4), 0, 100) })));

      if (!raidsPaused) {
        setRaidTimer((prev) => {
          if (prev > 1) return prev - 1;
          const damage = Math.max(10, 45 - mauerCount * 6);
          const cur = resourcesRef.current;
          let remaining = damage;
          const next = { ...cur };
          ["gold", "nahrung", "stein", "holz"].forEach((key) => {
            if (remaining <= 0) return;
            const take = Math.min(next[key], remaining);
            next[key] -= take; remaining -= take;
          });
          setResources(clampCap(next, cap));
          const total = next.gold + next.holz + next.stein + next.nahrung + next.erz;
          flash(mauerCount > 0 ? `Feinde griffen an! Eure ${mauerCount} Mauer(n) haben viel abgewehrt. -${damage} Ressourcen` : `Feinde griffen ungehindert an! -${damage} Ressourcen. Baue Mauern zum Schutz!`);
          setRaidLog((log) => [{ id: `${Date.now()}-${Math.random()}`, sec: t, damage, mauerCount }, ...log].slice(0, 20));
          if (total <= 5) setGameOver(true);
          return raidMin + Math.floor(Math.random() * Math.max(1, raidMax - raidMin));
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [buildings, cap, region, gameOver, marktCount, mauerCount, flash, raidsPaused, raidMin, raidMax]);

  function handleTileClick(index) {
    if (suppressClickRef.current) { suppressClickRef.current = false; return; }
    const terrainType = terrain[index];
    const nodeKey = nodes[index];

    if (selectedType === "tool_pflanzen") {
      if (terrainType !== "grass" || buildings[index] || nodeKey) { flash("Hier kannst du keinen Baum pflanzen."); return; }
      const tool = TOOLS.tool_pflanzen;
      if (!canAfford(resources, tool.cost)) { flash("Nicht genug Holz."); return; }
      setResources((r) => pay(r, tool.cost));
      setMapData((prev) => { const t = [...prev.terrain]; t[index] = "wald"; return { ...prev, terrain: t }; });
      flash("Baum gepflanzt.");
      return;
    }

    if (selectedType) {
      const def = BUILDING_TYPES[selectedType];
      const onWaterOk = def.buildOnWater && terrainType === "wasser";
      if (!onWaterOk && terrainType !== "grass") { flash("Hier kannst du nicht bauen – das ist eine Ressourcenfläche."); return; }
      if (buildings[index]) { flash("Hier steht schon etwas."); return; }
      if (!canAfford(resources, def.cost)) { flash("Nicht genug Rohstoffe."); return; }
      setResources((r) => pay(r, def.cost));
      setBuildings((b) => ({ ...b, [index]: selectedType }));
      flash(`${def.name} gebaut.`);
      return;
    }

    if (nodeKey) {
      const def = NODE_DEFS[nodeKey];
      if (expeditions.some((e) => e.key === nodeKey)) { flash("Dort ist schon ein Trupp unterwegs."); return; }
      if (expeditions.length >= maxTroops) { flash(`Alle Trupps im Einsatz (max. ${maxTroops}). Baue eine Kaserne für mehr.`); return; }
      if (!canAfford(resources, def.cost)) { flash("Nicht genug Nahrung für den Trupp."); return; }
      setResources((r) => pay(r, def.cost));
      setExpeditions((prev) => [...prev, { key: nodeKey, remaining: def.time, total: def.time }]);
      flash(`Trupp unterwegs zu "${def.name}" …`);
      return;
    }

    if (terrainType === "wald" && !buildings[index]) {
      setMapData((prev) => { const t = [...prev.terrain]; t[index] = "grass"; return { ...prev, terrain: t }; });
      const gain = 5 + Math.floor(Math.random() * 6);
      setResources((r) => clampCap({ ...r, holz: r.holz + gain }, cap));
      flash(`Baum gefällt: +${gain} Holz`);
      return;
    }

    if (terrainType === "wasser" && buildings[index] !== "bruecke") {
      const last = searchCooldownRef.current[index] || -999;
      if (tickRef.current - last < 8) { flash("Warte kurz, bevor du hier wieder suchst."); return; }
      searchCooldownRef.current[index] = tickRef.current;
      if (Math.random() < 0.6) {
        const gain = 5 + Math.floor(Math.random() * 11);
        setResources((r) => clampCap({ ...r, gold: r.gold + gain }, cap));
        flash(`Im Fluss gefunden: +${gain} Gold`);
      } else flash("Nichts gefunden diesmal.");
      return;
    }

    if (buildings[index]) { setSelectedInfo(index); return; }
  }

  function startCraft(craft) {
    if (crafts.some((c) => c.id === craft.id)) return;
    if (!canAfford(resources, craft.cost)) { flash("Nicht genug Rohstoffe für die Schmiede."); return; }
    setResources((r) => pay(r, craft.cost));
    setCrafts((prev) => [...prev, { id: craft.id, remaining: craft.time, total: craft.time }]);
  }

  function onPointerDown(e) { dragRef.current = { down: true, dragging: false, sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y }; }
  function onPointerMove(e) {
    const d = dragRef.current;
    if (!d.down) return;
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) d.dragging = true;
    if (d.dragging) setPan({ x: d.px + dx, y: d.py + dy });
  }
  function onPointerUp() {
    if (dragRef.current.dragging) suppressClickRef.current = true;
    dragRef.current.down = false; dragRef.current.dragging = false;
  }
  function onWheel(e) { e.preventDefault(); setZoom((z) => Math.min(2.2, Math.max(0.5, z - e.deltaY * 0.001))); }
  function resetView() { setZoom(1); setPan({ x: 0, y: 56 }); }

  function restartGame() {
    setMapData(generateMap());
    setBuildings({ [idx(TOWNHALL_ROW, TOWNHALL_COL)]: "rathaus" });
    setResources(START_RESOURCES);
    setSelectedType(null);
    setExpeditions([]);
    setCrafts([]);
    setInventory({ werkzeug: 0, schwert: 0, ruestung: 0 });
    setVillagerDots([]);
    setGuardDots([]);
    setChickenDots([]);
    setRaidTimer(raidMin);
    setGameOver(false);
    setRaidLog([]);
    setShowPauseMenu(false);
    tickRef.current = 0;
  }

  if (!region) return <SpawnScreen onPick={setRegion} />;

  const TABS = [
    { id: "basis", label: "Basis", icon: Landmark },
    { id: "schmiede", label: "Schmiede", icon: Hammer },
    { id: "ereignisse", label: "Ereignisse", icon: ScrollText },
  ];
  const raidWarning = raidTimer <= 10 && !raidsPaused;

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "linear-gradient(160deg, #BFE3D6 0%, #8FBFA8 45%, #4C8C6B 100%)", padding: "16px", fontFamily: "Inter, sans-serif", display: "flex", justifyContent: "center", boxSizing: "border-box" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');`}</style>

      <div style={{ width: "100%", maxWidth: "780px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <div style={{ fontFamily: "Cinzel, serif", fontSize: "19px", fontWeight: 700, color: "#1F3B2C" }}>Reich · {REGIONS[region].name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#1F3B2C", fontWeight: 600, cursor: "pointer" }}>
              <input type="checkbox" checked={villagersOn} onChange={(e) => setVillagersOn(e.target.checked)} />
              <Users size={13} /> Bewohner ({population})
            </label>
            <button onClick={() => setShowPauseMenu(true)} title="Menü (Escape)" style={{ background: "rgba(37,68,51,0.18)", border: "none", borderRadius: "8px", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1F3B2C" }}>
              <Menu size={16} />
            </button>
            <button onClick={() => setShowDevPanel(true)} title="Entwickler-Menü" style={{ background: "rgba(37,68,51,0.18)", border: "none", borderRadius: "8px", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1F3B2C" }}>
              <Settings size={16} />
            </button>
          </div>
        </div>

        <div style={{ background: "#254433", borderRadius: "12px", padding: "9px 11px", marginBottom: "10px" }}>
          <ResourceBar resources={resources} cap={cap} />
        </div>

        {raidWarning && !gameOver && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#7A2E2E", color: "#FCEAEA", fontSize: "12px", fontWeight: 700, padding: "7px 11px", borderRadius: "8px", marginBottom: "10px" }}>
            <Swords size={14} /> Angriff in {raidTimer}s – Mauern schützen dich!
          </div>
        )}
        {message && !gameOver && (
          <div style={{ background: "#254433", color: "#F3F7EE", fontSize: "12px", padding: "7px 11px", borderRadius: "8px", marginBottom: "10px" }}>{message}</div>
        )}
        {expeditions.length > 0 && !gameOver && (
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "10px" }}>
            {expeditions.map((e) => {
              const def = NODE_DEFS[e.key];
              return (
                <div key={e.key} style={{ background: "rgba(255,255,255,0.55)", borderRadius: "8px", padding: "6px 10px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#1F3B2C", marginBottom: "3px" }}>Trupp: {def.name} · noch {e.remaining}s</div>
                  <ProgressBar pct={100 - (e.remaining / e.total) * 100} color="#3A6B3E" />
                </div>
              );
            })}
          </div>
        )}

        {!gameOver && (
          <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
            {TABS.map((t) => {
              const Icon = t.icon; const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", borderRadius: "8px", border: "none", cursor: "pointer", background: active ? "#3E6B4A" : "rgba(37,68,51,0.18)", color: active ? "#F3F7EE" : "#254433", fontWeight: 600, fontSize: "13px" }}>
                  <Icon size={14} /> {t.label}
                </button>
              );
            })}
          </div>
        )}

        {gameOver ? (
          <div style={{ background: "#F3F7EE", borderRadius: "16px", padding: "26px 20px", textAlign: "center" }}>
            <Skull size={30} color="#7A2E2E" style={{ marginBottom: "10px" }} />
            <div style={{ fontFamily: "Cinzel, serif", fontSize: "20px", fontWeight: 700, color: "#1F3B2C", marginBottom: "8px" }}>Deine Stadt ist gefallen</div>
            <div style={{ fontSize: "14px", color: "#3A3630", marginBottom: "18px" }}>Zu viele unbeantwortete Angriffe haben eure Vorräte aufgezehrt.</div>
            <button onClick={restartGame} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "10px", border: "none", background: "#254433", color: "#F3F7EE", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>
              <RotateCcw size={16} /> Neu beginnen
            </button>
          </div>
        ) : tab === "basis" ? (
          <>
            <div style={{ position: "relative", flex: 1 }}>
              <div onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} onWheel={onWheel}
                style={{ position: "relative", height: "min(68vh, 640px)", borderRadius: "12px", overflow: "hidden", background: "#2C5240", touchAction: "none", cursor: "grab", border: "3px solid #1F3B2C" }}>
                <div style={{ position: "absolute", left: 0, top: 0, width: COLS * TILE, height: ROWS * TILE, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "top left" }}>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, ${TILE}px)`, gridTemplateRows: `repeat(${ROWS}, ${TILE}px)` }}>
                    {terrain.map((t, i) => {
                      const building = buildings[i];
                      const nodeKey = nodes[i];
                      const bDef = building ? BUILDING_TYPES[building] : null;
                      const nDef = nodeKey ? NODE_DEFS[nodeKey] : null;
                      const isTownhall = building === "rathaus";
                      return (
                        <div key={i} onClick={() => handleTileClick(i)} title={isTownhall ? "Rathaus" : bDef?.name || nDef?.name || t}
                          style={{ width: TILE, height: TILE, position: "relative", background: bDef ? bDef.color : isTownhall ? "#8C5A2B" : getTileBg(region, t), border: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          {isTownhall && <Landmark size={15} color="#F3F7EE" />}
                          {bDef && <bDef.icon size={14} color="#F3F7EE" />}
                          {!building && nDef && <nDef.icon size={14} color="#FFF7DE" style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.6))" }} />}
                        </div>
                      );
                    })}
                  </div>
                  {villagerDots.map((v) => (
                    <div key={`v${v.id}`} style={{ position: "absolute", left: `${v.x}%`, top: `${v.y}%`, width: "6px", height: "6px", borderRadius: "50%", background: "#F3E7C9", transition: "left 1s linear, top 1s linear", boxShadow: "0 0 0 1.5px rgba(0,0,0,0.4)" }} />
                  ))}
                  {guardDots.map((v) => (
                    <div key={`g${v.id}`} style={{ position: "absolute", left: `${v.x}%`, top: `${v.y}%`, width: "7px", height: "7px", borderRadius: "2px", background: "#A13A3A", transition: "left 1s linear, top 1s linear", boxShadow: "0 0 0 1.5px rgba(0,0,0,0.4)" }} title="Wache" />
                  ))}
                  {chickenDots.map((c) => (
                    <div key={`c${c.id}`} style={{ position: "absolute", left: `${c.x}%`, top: `${c.y}%`, transition: "left 1.2s linear, top 1.2s linear" }}>
                      <Egg size={8} color="#F5F0DA" style={{ filter: "drop-shadow(0 0 1px rgba(0,0,0,0.5))" }} />
                    </div>
                  ))}
                  {raidWarning && (() => {
                    const thX = ((TOWNHALL_COL + 0.5) / COLS) * 100;
                    const thY = ((TOWNHALL_ROW + 0.5) / ROWS) * 100;
                    const progress = (10 - raidTimer) / 10;
                    const ex = 2 + (thX - 2) * progress;
                    const ey = 2 + (thY - 2) * progress;
                    return (
                      <div style={{ position: "absolute", left: `${ex}%`, top: `${ey}%`, transition: "left 1s linear, top 1s linear" }}>
                        <Swords size={13} color="#C24A4A" style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.7))" }} />
                      </div>
                    );
                  })()}
                </div>
                <div style={{ position: "absolute", bottom: "8px", right: "8px", display: "flex", flexDirection: "column", gap: "5px" }}>
                  <button onClick={() => setZoom((z) => Math.min(2.2, z + 0.2))} style={zoomBtnStyle}><ZoomIn size={14} /></button>
                  <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))} style={zoomBtnStyle}><ZoomOut size={14} /></button>
                  <button onClick={resetView} style={zoomBtnStyle}><RotateCcw size={14} /></button>
                </div>
              </div>

              {tutorialStep !== null && tutorialStep < TUTORIAL_STEPS.length && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(20,30,24,0.55)", borderRadius: "12px", display: "flex", alignItems: "flex-end", padding: "14px" }}>
                  <div style={{ background: "#F3F7EE", borderRadius: "10px", padding: "14px", width: "100%" }}>
                    <div style={{ fontSize: "13px", color: "#1F3B2C", marginBottom: "10px", lineHeight: 1.4 }}>{TUTORIAL_STEPS[tutorialStep]}</div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <button onClick={() => setTutorialStep(null)} style={{ background: "transparent", border: "none", color: "#5C6B5A", fontSize: "12px", cursor: "pointer" }}>Überspringen</button>
                      <button onClick={() => setTutorialStep((s) => (s + 1 < TUTORIAL_STEPS.length ? s + 1 : null))} style={{ background: "#254433", color: "#F3F7EE", border: "none", borderRadius: "6px", padding: "6px 14px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                        {tutorialStep + 1 < TUTORIAL_STEPS.length ? "Weiter" : "Los geht's"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ fontSize: "11px", fontWeight: 600, color: "#1F3B2C", margin: "10px 0 6px", opacity: 0.8 }}>
              Ziehen zum Verschieben, Scrollen zum Zoomen · Bäume direkt antippen zum Fällen · im Fluss nach Gold suchen · Escape = Menü
            </div>
            <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
              {Object.entries(BUILDING_TYPES).map(([key, def]) => {
                const Icon = def.icon; const affordable = canAfford(resources, def.cost); const selected = selectedType === key;
                return (
                  <button key={key} onClick={() => setSelectedType(selected ? null : key)}
                    style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "8px 10px", borderRadius: "10px", border: selected ? "2px solid #1F3B2C" : "2px solid transparent", background: "#F3F7EE", cursor: "pointer", opacity: affordable ? 1 : 0.5, minWidth: "78px" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: def.color, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={14} color="#F3F7EE" /></div>
                    <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#1F3B2C", textAlign: "center" }}>{def.name}</div>
                    <div style={{ fontSize: "9.5px", color: "#5C6B5A", textAlign: "center" }}>{Object.entries(def.cost).map(([k, v]) => `${v} ${RESOURCE_META[k].label}`).join(", ")}</div>
                  </button>
                );
              })}
              {Object.entries(TOOLS).map(([key, def]) => {
                const Icon = def.icon; const affordable = canAfford(resources, def.cost); const selected = selectedType === key;
                return (
                  <button key={key} onClick={() => setSelectedType(selected ? null : key)}
                    style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "8px 10px", borderRadius: "10px", border: selected ? "2px solid #1F3B2C" : "2px dashed #5C6B5A", background: "#F3F7EE", cursor: "pointer", opacity: affordable ? 1 : 0.5, minWidth: "78px" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: def.color, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={14} color="#F3F7EE" /></div>
                    <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#1F3B2C", textAlign: "center" }}>{def.name}</div>
                    <div style={{ fontSize: "9.5px", color: "#5C6B5A", textAlign: "center" }}>{Object.entries(def.cost).map(([k, v]) => `${v} ${RESOURCE_META[k].label}`).join(", ")}</div>
                  </button>
                );
              })}
            </div>
            {selectedType && (
              <button onClick={() => setSelectedType(null)} style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", borderRadius: "8px", border: "none", background: "rgba(37,68,51,0.18)", color: "#1F3B2C", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}>
                <X size={13} /> Auswahl aufheben
              </button>
            )}
          </>
        ) : tab === "schmiede" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {!hasSchmiede ? (
              <div style={{ fontSize: "13px", color: "#1F3B2C", background: "rgba(243,247,238,0.7)", padding: "14px", borderRadius: "8px", textAlign: "center" }}>Du brauchst zuerst eine Schmiede auf deiner Basis, um hier etwas herzustellen.</div>
            ) : (
              <>
                <div style={{ display: "flex", gap: "8px" }}>
                  {Object.entries(inventory).map(([k, v]) => {
                    const def = CRAFTS.find((c) => c.id === k);
                    return (
                      <div key={k} style={{ flex: 1, background: "rgba(243,247,238,0.7)", borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                        <div style={{ fontSize: "11px", color: "#5C6B5A" }}>{def.name}</div>
                        <div style={{ fontSize: "16px", fontWeight: 700, color: "#1F3B2C" }}>{v}</div>
                      </div>
                    );
                  })}
                </div>
                {CRAFTS.map((craft) => {
                  const active = crafts.find((c) => c.id === craft.id);
                  const affordable = canAfford(resources, craft.cost);
                  return (
                    <div key={craft.id} style={{ background: "#F3F7EE", borderRadius: "10px", padding: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontWeight: 700, color: "#1F3B2C", fontSize: "14px" }}>{craft.name}</div>
                          <div style={{ fontSize: "12px", color: "#5C6B5A" }}>Kosten: {Object.entries(craft.cost).map(([k, v]) => `${v} ${RESOURCE_META[k].label}`).join(", ")} · {craft.time}s</div>
                        </div>
                        <button onClick={() => startCraft(craft)} disabled={!!active || !affordable}
                          style={{ padding: "8px 14px", borderRadius: "8px", border: "none", fontWeight: 600, fontSize: "13px", background: active ? "#8C8375" : "#4A4A48", color: "#F3F7EE", cursor: active || !affordable ? "default" : "pointer" }}>
                          {active ? `${active.remaining}s` : "Schmieden"}
                        </button>
                      </div>
                      {active && <div style={{ marginTop: "8px" }}><ProgressBar pct={100 - (active.remaining / active.total) * 100} color="#4A4A48" /></div>}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "12px", color: "#1F3B2C", background: "rgba(243,247,238,0.7)", padding: "10px", borderRadius: "8px" }}>
              Angriffs-Log. Hinweis: Verluste an Dorfbewohnern werden aktuell nicht simuliert, nur Ressourcenschaden.
            </div>
            {raidLog.length === 0 && <div style={{ fontSize: "13px", color: "#5C6B5A", padding: "10px" }}>Noch keine Angriffe erlebt.</div>}
            {raidLog.map((e) => (
              <div key={e.id} style={{ background: "#F3F7EE", borderRadius: "8px", padding: "9px 12px", fontSize: "12.5px", color: "#1F3B2C" }}>
                Sekunde {e.sec}: <strong>-{e.damage} Ressourcen</strong> · Mauern zum Zeitpunkt: {e.mauerCount}
              </div>
            ))}
          </div>
        )}
      </div>

      {showPauseMenu && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(20,30,24,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#F3F7EE", borderRadius: "16px", padding: "22px", width: "280px", textAlign: "center" }}>
            <div style={{ fontFamily: "Cinzel, serif", fontSize: "18px", fontWeight: 700, color: "#1F3B2C", marginBottom: "16px" }}>Menü</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button onClick={() => setShowPauseMenu(false)} style={menuBtnStyle}>Weiterspielen</button>
              <button onClick={() => setShowDevPanel(true)} style={menuBtnStyle}><Settings size={13} style={{ marginRight: "6px" }} />Entwickler-Menü</button>
              <button onClick={restartGame} style={menuBtnStyle}>Neu starten</button>
              <button onClick={() => { setShowPauseMenu(false); setRegion(null); }} style={{ ...menuBtnStyle, background: "rgba(122,46,46,0.15)", color: "#7A2E2E" }}>Zur Regionswahl</button>
            </div>
          </div>
        </div>
      )}

      {showDevPanel && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(20,30,24,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }}>
          <div style={{ background: "#F3F7EE", borderRadius: "16px", padding: "22px", width: "300px" }}>
            <div style={{ fontFamily: "Cinzel, serif", fontSize: "16px", fontWeight: 700, color: "#1F3B2C", marginBottom: "14px" }}>Entwickler-Menü</div>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#1F3B2C", marginBottom: "12px", cursor: "pointer" }}>
              <input type="checkbox" checked={raidsPaused} onChange={(e) => setRaidsPaused(e.target.checked)} /> Angriffe pausieren
            </label>
            <div style={{ fontSize: "12px", color: "#1F3B2C", marginBottom: "4px" }}>Angriffsintervall (Sekunden)</div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
              <input type="number" value={raidMin} min={5} onChange={(e) => setRaidMin(Number(e.target.value))} style={inputStyle} />
              <input type="number" value={raidMax} min={5} onChange={(e) => setRaidMax(Number(e.target.value))} style={inputStyle} />
            </div>
            <button onClick={() => setRaidTimer(1)} style={{ ...menuBtnStyle, marginBottom: "8px" }}>Angriff jetzt auslösen</button>

            <div style={{ fontSize: "12px", color: "#1F3B2C", margin: "14px 0 4px", fontWeight: 700 }}>Welt</div>
            <button onClick={restartGame} style={{ ...menuBtnStyle, marginBottom: "12px" }}>🎲 Neue Zufallswelt generieren</button>

            <div style={{ fontSize: "12px", color: "#1F3B2C", margin: "4px 0 4px", fontWeight: 700 }}>Ressourcen setzen</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "10px" }}>
              {Object.keys(RESOURCE_META).map((key) => (
                <input key={key} type="number" value={Math.floor(resources[key])}
                  onChange={(e) => setResources((r) => ({ ...r, [key]: Number(e.target.value) }))}
                  style={inputStyle} title={RESOURCE_META[key].label} placeholder={RESOURCE_META[key].label} />
              ))}
            </div>
            <div style={{ fontSize: "12px", color: "#1F3B2C", marginBottom: "4px", fontWeight: 700 }}>Bonus-Bewohner</div>
            <input type="number" value={devPopBonus} onChange={(e) => setDevPopBonus(Number(e.target.value))} style={{ ...inputStyle, marginBottom: "12px" }} />

            <button onClick={() => setShowDevPanel(false)} style={menuBtnStyle}>Schließen</button>
          </div>
        </div>
      )}

      {selectedInfo !== null && buildings[selectedInfo] && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(20,30,24,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 55 }}
          onClick={() => setSelectedInfo(null)}>
          <div style={{ background: "#F3F7EE", borderRadius: "16px", padding: "20px", width: "260px", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            {buildings[selectedInfo] === "rathaus" ? (
              <>
                <Landmark size={24} color="#8C5A2B" style={{ marginBottom: "8px" }} />
                <div style={{ fontFamily: "Cinzel, serif", fontSize: "16px", fontWeight: 700, color: "#1F3B2C", marginBottom: "8px" }}>Rathaus</div>
                <div style={{ fontSize: "12.5px", color: "#3A3630", lineHeight: 1.5 }}>
                  Zentrum deines Reichs.<br />Bevölkerung: {population}<br />Lagerkapazität: {cap} pro Rohstoff<br />Max. gleichzeitige Trupps: {maxTroops}
                </div>
              </>
            ) : (() => {
              const def = BUILDING_TYPES[buildings[selectedInfo]];
              const Icon = def.icon;
              return (
                <>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: def.color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}><Icon size={18} color="#F3F7EE" /></div>
                  <div style={{ fontFamily: "Cinzel, serif", fontSize: "16px", fontWeight: 700, color: "#1F3B2C", marginBottom: "8px" }}>{def.name}</div>
                  <div style={{ fontSize: "12.5px", color: "#3A3630", lineHeight: 1.5 }}>
                    {def.produces && Object.keys(def.produces).length > 0
                      ? `Produziert: ${Object.entries(def.produces).map(([k, v]) => `+${v} ${RESOURCE_META[k].label}`).join(", ")} alle 4s`
                      : def.popBonus ? `Erhöht Bevölkerung um ${def.popBonus}`
                      : def.capBonus ? `Erhöht Lagerkapazität um ${def.capBonus}`
                      : def.troopBonus ? `Erhöht maximale Trupps um ${def.troopBonus}`
                      : def.unlocksCraft ? "Schaltet die Schmiede frei"
                      : "Keine aktive Produktion."}
                  </div>
                </>
              );
            })()}
            <button onClick={() => setSelectedInfo(null)} style={{ ...menuBtnStyle, marginTop: "14px" }}>Schließen</button>
          </div>
        </div>
      )}
    </div>
  );
}

const zoomBtnStyle = { width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "rgba(31,59,44,0.85)", color: "#F3F7EE", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };
const menuBtnStyle = { padding: "10px 14px", borderRadius: "8px", border: "none", background: "rgba(37,68,51,0.12)", color: "#1F3B2C", fontWeight: 600, fontSize: "13px", cursor: "pointer" };
const inputStyle = { width: "100%", padding: "7px", borderRadius: "6px", border: "1px solid #C9C4B4", fontSize: "13px" };
