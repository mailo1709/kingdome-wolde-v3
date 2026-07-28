import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Users, Landmark, Hammer, ScrollText, Swords, Skull, Egg,
  ZoomIn, ZoomOut, RotateCcw, X, Menu, Settings, Flag, Lock,
} from "lucide-react";
import {
  COLS, ROWS, TILE, TOWNHALL_ROW, TOWNHALL_COL, ZONE_COLS, ZONE_ROWS,
  idx, clamp, zoneIndexOfTile,
  REGIONS, BUILDING_TYPES, TOOLS, RESOURCE_META, JOB_META, NODE_DEFS, CRAFTS,
  TUTORIAL_STEPS, START_RESOURCES, BASE_CAP, GLOBAL_STYLES, SAVE_KEY, FIRST_RAID_DELAY,
  DEFAULT_RAID_MIN, DEFAULT_RAID_MAX,
  TROOP_CAP_PER_KASERNE, TROOP_GROWTH_INTERVAL_TICKS,
  ZONE_META, ZONE_UNLOCK_COST, SMOKE_BUILDINGS,
  generateMap, getTileBg, canAfford, pay, clampCap,
} from "./gameData";

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

function SpawnScreen({ onPick, savedGame, onContinue }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #BFE3D6 0%, #8FBFA8 45%, #4C8C6B 100%)", padding: "24px", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ maxWidth: "420px", width: "100%", background: "#F3F7EE", borderRadius: "16px", padding: "26px 22px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
        {savedGame && (
          <>
            <button className="kw-btn" onClick={onContinue} style={{ width: "100%", padding: "14px 8px", borderRadius: "10px", border: "none", background: "#254433", color: "#F3F7EE", fontWeight: 700, fontSize: "14px", cursor: "pointer", marginBottom: "10px" }}>
              Fortsetzen
            </button>
            <div style={{ fontSize: "11.5px", color: "#5C6B5A", marginBottom: "18px" }}>Ein gespeichertes Reich wurde gefunden. Oder starte neu:</div>
          </>
        )}
        <div style={{ fontFamily: "Cinzel, serif", fontSize: "22px", fontWeight: 700, color: "#1F3B2C", marginBottom: "8px" }}>Wähle deinen Startort</div>
        <div style={{ fontSize: "12.5px", color: "#5C6B5A", marginBottom: "18px" }}>Jede Kultur bringt einen eigenen kleinen Bonus mit.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {Object.entries(REGIONS).map(([key, r]) => (
            <button key={key} className="kw-btn" title={r.bonusLabel} onClick={() => onPick(key)} style={{ padding: "12px 8px", borderRadius: "10px", border: "none", background: r.palette.grass, color: "#1F3B2C", cursor: "pointer", display: "flex", flexDirection: "column", gap: "3px" }}>
              <span style={{ fontWeight: 700, fontSize: "13px" }}>{r.name}</span>
              <span style={{ fontSize: "9.5px", fontWeight: 500, lineHeight: 1.3, opacity: 0.85 }}>{r.bonusLabel}</span>
            </button>
          ))}
          <button className="kw-btn" onClick={() => onPick(Object.keys(REGIONS)[Math.floor(Math.random() * Object.keys(REGIONS).length)])}
            style={{ gridColumn: "1 / -1", padding: "12px", borderRadius: "10px", border: "2px dashed #1F3B2C", background: "transparent", color: "#1F3B2C", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>🎲 Zufällig</button>
        </div>
      </div>
    </div>
  );
}

function initialZonesUnlocked() {
  const z = {};
  ZONE_META.forEach((zone) => { z[zone.id] = zone.tier === 0; });
  return z;
}

function readSavedGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function KingdomWorld() {
  const [savedGame] = useState(readSavedGame);
  const [region, setRegion] = useState(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [mapData, setMapData] = useState(generateMap);
  const { terrain, nodes, npcVillages } = mapData;
  const [buildings, setBuildings] = useState({ [idx(TOWNHALL_ROW, TOWNHALL_COL)]: "rathaus" });
  const [resources, setResources] = useState(START_RESOURCES);
  const [zonesUnlocked, setZonesUnlocked] = useState(initialZonesUnlocked);
  const [troopPool, setTroopPool] = useState(0);
  const [garrisons, setGarrisons] = useState({});
  const [zoneAttackPanel, setZoneAttackPanel] = useState(null);
  const [zoneAssaults, setZoneAssaults] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [expeditions, setExpeditions] = useState([]);
  const [tab, setTab] = useState("basis");
  const [crafts, setCrafts] = useState([]);
  const [inventory, setInventory] = useState({ werkzeug: 0, schwert: 0, ruestung: 0 });
  const [villagersOn, setVillagersOn] = useState(true);
  const [effects3D, setEffects3D] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [villagerDots, setVillagerDots] = useState([]);
  const [guardDots, setGuardDots] = useState([]);
  const [chickenDots, setChickenDots] = useState([]);
  const [jobDots, setJobDots] = useState([]);
  const [raidEnemies, setRaidEnemies] = useState([]);
  const [marketPulse, setMarketPulse] = useState(0);
  const [message, setMessage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 56 });
  const [raidTimer, setRaidTimer] = useState(FIRST_RAID_DELAY);
  const [gameOver, setGameOver] = useState(false);
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [raidsPaused, setRaidsPaused] = useState(false);
  const [raidMin, setRaidMin] = useState(DEFAULT_RAID_MIN);
  const [raidMax, setRaidMax] = useState(DEFAULT_RAID_MAX);
  const [raidLog, setRaidLog] = useState([]);
  const [devPopBonus, setDevPopBonus] = useState(0);
  const [selectedInfo, setSelectedInfo] = useState(null);

  const tickRef = useRef(0);
  const dragRef = useRef({ down: false, dragging: false, sx: 0, sy: 0, px: 0, py: 0 });
  const suppressClickRef = useRef(false);
  const resourcesRef = useRef(resources);
  const raidTimerRef = useRef(raidTimer);
  const gameStateRef = useRef(null);
  const searchCooldownRef = useRef({});

  useEffect(() => { resourcesRef.current = resources; }, [resources]);
  useEffect(() => { raidTimerRef.current = raidTimer; }, [raidTimer]);
  useEffect(() => {
    gameStateRef.current = {
      region, mapData, buildings, resources, zonesUnlocked, troopPool, garrisons,
      inventory, crafts, expeditions, raidTimer, raidLog, raidMin, raidMax, raidsPaused, devPopBonus,
    };
  });

  const houseCount = Object.values(buildings).filter((b) => b === "haus").length;
  const lagerCount = Object.values(buildings).filter((b) => b === "lager").length;
  const kaserneCount = Object.values(buildings).filter((b) => b === "kaserne").length;
  const mauerCount = Object.values(buildings).filter((b) => b === "mauer").length;
  const marktCount = Object.values(buildings).filter((b) => b === "markt").length;
  const bauernhofIndices = Object.entries(buildings).filter(([, v]) => v === "bauernhof").map(([k]) => Number(k));
  const holzfaellerIndices = Object.entries(buildings).filter(([, v]) => v === "holzfaeller").map(([k]) => Number(k));
  const steinbruchIndices = Object.entries(buildings).filter(([, v]) => v === "steinbruch").map(([k]) => Number(k));
  const marktIndices = Object.entries(buildings).filter(([, v]) => v === "markt").map(([k]) => Number(k));
  const hasSchmiede = Object.values(buildings).includes("schmiede");
  const population = 2 + houseCount * 2 + devPopBonus;
  const cap = BASE_CAP + lagerCount * 100;
  const maxTroops = 1 + kaserneCount;
  const raidWarning = raidTimer <= 10 && !raidsPaused;
  const regionBonus = REGIONS[region]?.bonus || {};

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
        setShowSettings(false);
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
    if (!region) return;
    const jobList = [
      ...holzfaellerIndices.map((homeIdx) => ({ type: "holzfaeller", homeIdx })),
      ...steinbruchIndices.map((homeIdx) => ({ type: "steinbruch", homeIdx })),
      ...bauernhofIndices.map((homeIdx) => ({ type: "bauernhof", homeIdx })),
      ...marktIndices.map((homeIdx) => ({ type: "markt", homeIdx })),
    ].slice(0, 24);
    setJobDots((prev) => jobList.map((job, i) => {
      const existing = prev[i];
      const r = Math.floor(job.homeIdx / COLS), c = job.homeIdx % COLS;
      const hx = ((c + 0.5) / COLS) * 100, hy = ((r + 0.5) / ROWS) * 100;
      if (existing && existing.homeIdx === job.homeIdx && existing.type === job.type) return existing;
      return { id: `${job.type}-${job.homeIdx}`, type: job.type, homeIdx: job.homeIdx, hx, hy, x: hx, y: hy };
    }));
  }, [holzfaellerIndices.length, steinbruchIndices.length, bauernhofIndices.length, marktIndices.length, region]);

  useEffect(() => {
    if (!region) { setRaidEnemies([]); return; }
    if (raidWarning) {
      setRaidEnemies((prev) => prev.length ? prev : Array.from({ length: 3 + Math.floor(Math.random() * 4) }, (_, i) => ({
        id: i,
        sx: Math.random() < 0.5 ? 1 + Math.random() * 3 : 96 + Math.random() * 3,
        sy: 3 + Math.random() * 88,
      })));
    } else {
      setRaidEnemies([]);
    }
  }, [raidWarning, region]);

  // Autosave every 10s, always reading the freshest state via gameStateRef.
  useEffect(() => {
    if (!region) return;
    const id = setInterval(() => {
      if (!gameStateRef.current) return;
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(gameStateRef.current)); } catch { /* storage unavailable */ }
    }, 10000);
    return () => clearInterval(id);
  }, [region]);

  useEffect(() => {
    if (!region || gameOver) return;
    const interval = setInterval(() => {
      tickRef.current += 1;
      const t = tickRef.current;

      if (t % 4 === 0) {
        let anyMarketTrade = false;
        setResources((prev) => {
          const gain = {};
          Object.values(buildings).forEach((type) => {
            const def = BUILDING_TYPES[type];
            if (def?.produces) Object.entries(def.produces).forEach(([k, v]) => (gain[k] = (gain[k] || 0) + v));
          });
          let next = { ...prev };
          Object.entries(gain).forEach(([k, v]) => (next[k] = (next[k] || 0) + v * (regionBonus.produceMult?.[k] ?? 1)));
          for (let i = 0; i < marktCount; i++) if (next.nahrung >= 8) { next.nahrung -= 8; next.gold += 10 * (regionBonus.marketGoldMult ?? 1); anyMarketTrade = true; }
          return clampCap(next, cap);
        });
        if (anyMarketTrade) setMarketPulse((p) => p + 1);
      }

      if (t % TROOP_GROWTH_INTERVAL_TICKS === 0 && kaserneCount > 0) {
        const growth = Math.round(kaserneCount * (regionBonus.troopGrowthMult ?? 1));
        setTroopPool((p) => Math.min(p + growth, kaserneCount * TROOP_CAP_PER_KASERNE));
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

      setZoneAssaults((prev) => prev.map((z) => ({ ...z, remaining: z.remaining - 1 })).filter((z) => {
        if (z.remaining <= 0) {
          const zone = ZONE_META[z.zoneId];
          const village = mapData.npcVillages[z.zoneId];
          if (village && z.strength >= village.defense) {
            setZonesUnlocked((zu) => ({ ...zu, [z.zoneId]: true }));
            setBuildings((b) => ({ ...b, [village.tileIndex]: "aussenposten" }));
            flash(`Sieg! ${zone.name} erobert und mit einem Außenposten gesichert.`);
          } else {
            flash(`Angriff auf ${zone.name} gescheitert – die Truppen wurden aufgerieben.`);
          }
          return false;
        }
        return true;
      }));

      setVillagerDots((prev) => prev.map((v) => {
        const nx = clamp(v.x + (Math.random() * 10 - 5), 4, 96);
        const ny = clamp(v.y + (Math.random() * 10 - 5), 4, 96);
        return isPassable(pctToIndex(nx, ny)) ? { ...v, x: nx, y: ny } : v;
      }));
      const isRaidAlert = !raidsPaused && raidTimerRef.current <= 10;
      setGuardDots((prev) => prev.map((v) => {
        if (isRaidAlert) {
          const thX = ((TOWNHALL_COL + 0.5) / COLS) * 100;
          const thY = ((TOWNHALL_ROW + 0.5) / ROWS) * 100;
          const nx = clamp(v.x + clamp(thX - v.x, -6, 6), 4, 96);
          const ny = clamp(v.y + clamp(thY - v.y, -6, 6), 4, 96);
          return isPassable(pctToIndex(nx, ny)) ? { ...v, x: nx, y: ny } : v;
        }
        const nx = clamp(v.x + (Math.random() * 8 - 4), 4, 96);
        const ny = clamp(v.y + (Math.random() * 8 - 4), 4, 96);
        return isPassable(pctToIndex(nx, ny)) ? { ...v, x: nx, y: ny } : v;
      }));
      setChickenDots((prev) => prev.map((c) => ({ ...c, x: clamp(c.hx + (Math.random() * 8 - 4), 0, 100), y: clamp(c.hy + (Math.random() * 8 - 4), 0, 100) })));
      setJobDots((prev) => prev.map((j) => ({ ...j, x: clamp(j.hx + (Math.random() * 8 - 4), 0, 100), y: clamp(j.hy + (Math.random() * 8 - 4), 0, 100) })));

      if (!raidsPaused) {
        setRaidTimer((prev) => {
          if (prev > 1) return prev - 1;
          const garrisonedTotal = Object.values(gameStateRef.current?.garrisons || {}).reduce((a, b) => a + b, 0);
          const baseDamage = Math.max(15, 70 - mauerCount * 8);
          const damage = Math.round(Math.max(0, baseDamage - garrisonedTotal * 5) * (regionBonus.raidDamageMult ?? 1));
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
          if (damage <= 0) {
            flash(`Eure ${garrisonedTotal} stationierten Truppen haben den Angriff vollständig abgewehrt!`);
          } else {
            flash(mauerCount > 0 || garrisonedTotal > 0 ? `Feinde griffen an! Eure Verteidigung hat viel abgewehrt. -${damage} Ressourcen` : `Feinde griffen ungehindert an! -${damage} Ressourcen. Baue Mauern und Wachposten zum Schutz!`);
          }
          setRaidLog((log) => [{ id: `${Date.now()}-${Math.random()}`, sec: t, damage, mauerCount, garrisonedTotal }, ...log].slice(0, 20));
          if (total <= 5) setGameOver(true);
          return raidMin + Math.floor(Math.random() * Math.max(1, raidMax - raidMin));
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [buildings, cap, region, gameOver, marktCount, mauerCount, kaserneCount, flash, raidsPaused, raidMin, raidMax, mapData]);

  function handleTileClick(index) {
    if (suppressClickRef.current) { suppressClickRef.current = false; return; }
    const zoneId = zoneIndexOfTile(index);
    if (!zonesUnlocked[zoneId]) { setZoneAttackPanel(zoneId); return; }

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
      if (expeditions.some((e) => e.tileIndex === index)) { flash("Dort ist schon ein Trupp unterwegs."); return; }
      if (expeditions.length >= maxTroops) { flash(`Alle Trupps im Einsatz (max. ${maxTroops}). Baue eine Kaserne für mehr.`); return; }
      if (!canAfford(resources, def.cost)) { flash("Nicht genug Nahrung für den Trupp."); return; }
      setResources((r) => pay(r, def.cost));
      setExpeditions((prev) => [...prev, { key: nodeKey, tileIndex: index, remaining: def.time, total: def.time }]);
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
      if (Math.random() < 0.6 + (regionBonus.searchSuccessBonus ?? 0)) {
        const gain = Math.round((5 + Math.floor(Math.random() * 11)) * (regionBonus.searchGoldMult ?? 1));
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

  function startZoneAssault(zoneId) {
    const zone = ZONE_META[zoneId];
    const cost = ZONE_UNLOCK_COST[zone.tier];
    if (zoneAssaults.some((z) => z.zoneId === zoneId)) { flash("Hier ist bereits ein Feldzug im Gange."); return; }
    if (troopPool <= 0) { flash("Du hast keine Truppen im Reservepool. Baue eine Kaserne und warte, bis Truppen bereitstehen."); return; }
    if (!canAfford(resources, cost)) { flash("Nicht genug Ressourcen für diesen Feldzug."); return; }
    setResources((r) => pay(r, cost));
    const strength = troopPool;
    setTroopPool(0);
    setZoneAssaults((prev) => [...prev, { zoneId, remaining: 25, total: 25, strength }]);
    setZoneAttackPanel(null);
    flash(`Feldzug gegen ${zone.name} gestartet …`);
  }

  function assignGarrison(tileIndex, delta) {
    const current = garrisons[tileIndex] || 0;
    if (delta > 0 && troopPool <= 0) { flash("Keine Truppen im Reservepool. Baue eine Kaserne und warte, bis welche bereitstehen."); return; }
    if (delta < 0 && current <= 0) return;
    setGarrisons((g) => ({ ...g, [tileIndex]: current + delta }));
    setTroopPool((p) => p - delta);
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
    setZonesUnlocked(initialZonesUnlocked());
    setTroopPool(0);
    setGarrisons({});
    setZoneAttackPanel(null);
    setZoneAssaults([]);
    setSelectedType(null);
    setExpeditions([]);
    setCrafts([]);
    setInventory({ werkzeug: 0, schwert: 0, ruestung: 0 });
    setVillagerDots([]);
    setGuardDots([]);
    setChickenDots([]);
    setJobDots([]);
    setRaidEnemies([]);
    setMarketPulse(0);
    setRaidTimer(FIRST_RAID_DELAY);
    setGameOver(false);
    setRaidLog([]);
    setShowPauseMenu(false);
    tickRef.current = 0;
  }

  function continueGame(saved) {
    if (!saved) return;
    setRegion(saved.region);
    setMapData(saved.mapData);
    setBuildings(saved.buildings);
    setResources(saved.resources);
    setZonesUnlocked(saved.zonesUnlocked || initialZonesUnlocked());
    setTroopPool(saved.troopPool || 0);
    setGarrisons(saved.garrisons || {});
    setInventory(saved.inventory || { werkzeug: 0, schwert: 0, ruestung: 0 });
    setCrafts(saved.crafts || []);
    setExpeditions(saved.expeditions || []);
    setRaidTimer(saved.raidTimer ?? FIRST_RAID_DELAY);
    setRaidLog(saved.raidLog || []);
    setRaidMin(saved.raidMin ?? DEFAULT_RAID_MIN);
    setRaidMax(saved.raidMax ?? DEFAULT_RAID_MAX);
    setRaidsPaused(saved.raidsPaused || false);
    setDevPopBonus(saved.devPopBonus || 0);
    setTutorialStep(null);
    tickRef.current = 0;
  }

  function devUnlockNextZone() {
    const next = ZONE_META.find((z) => z.tier > 0 && !zonesUnlocked[z.id]);
    if (!next) { flash("Alle Zonen bereits freigeschaltet."); return; }
    const village = npcVillages[next.id];
    setZonesUnlocked((zu) => ({ ...zu, [next.id]: true }));
    if (village) setBuildings((b) => ({ ...b, [village.tileIndex]: "aussenposten" }));
    flash(`${next.name} freigeschaltet (Entwickler-Cheat).`);
  }

  if (!region) return <SpawnScreen onPick={setRegion} savedGame={savedGame} onContinue={() => continueGame(savedGame)} />;

  const TABS = [
    { id: "basis", label: "Basis", icon: Landmark },
    { id: "schmiede", label: "Schmiede", icon: Hammer },
    { id: "ereignisse", label: "Ereignisse", icon: ScrollText },
  ];

  const villageTileMap = {};
  Object.entries(npcVillages).forEach(([zid, v]) => { villageTileMap[v.tileIndex] = Number(zid); });
  const zoneCenterTile = {};
  ZONE_META.forEach((z) => {
    zoneCenterTile[z.id] = idx(z.rowStart + Math.floor(ZONE_ROWS / 2), z.colStart + Math.floor(ZONE_COLS / 2));
  });

  const rootClass = reduceMotion ? "reduce-motion" : "";

  return (
    <div className={rootClass} style={{ minHeight: "100vh", width: "100%", background: "linear-gradient(160deg, #BFE3D6 0%, #8FBFA8 45%, #4C8C6B 100%)", padding: "16px", fontFamily: "Inter, sans-serif", display: "flex", justifyContent: "center", boxSizing: "border-box" }}>
      <style>{GLOBAL_STYLES}</style>

      <div style={{ width: "100%", maxWidth: "780px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <div title={REGIONS[region].bonusLabel} style={{ fontFamily: "Cinzel, serif", fontSize: "19px", fontWeight: 700, color: "#1F3B2C" }}>Reich · {REGIONS[region].name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div title="Bevölkerung" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#1F3B2C", fontWeight: 600 }}>
              <Users size={13} /> {population}
            </div>
            <div title="Truppen im Reservepool" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#1F3B2C", fontWeight: 600 }}>
              <Swords size={13} /> {troopPool}
            </div>
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
            <Swords size={14} /> Angriff in {raidTimer}s – Mauern und Wachposten schützen dich!
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
                <div key={e.tileIndex} style={{ background: "rgba(255,255,255,0.55)", borderRadius: "8px", padding: "6px 10px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#1F3B2C", marginBottom: "3px" }}>Trupp: {def.name} · noch {e.remaining}s</div>
                  <ProgressBar pct={100 - (e.remaining / e.total) * 100} color="#3A6B3E" />
                </div>
              );
            })}
          </div>
        )}
        {zoneAssaults.length > 0 && !gameOver && (
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "10px" }}>
            {zoneAssaults.map((z) => (
              <div key={z.zoneId} style={{ background: "rgba(255,255,255,0.55)", borderRadius: "8px", padding: "6px 10px" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "#1F3B2C", marginBottom: "3px" }}>Feldzug: {ZONE_META[z.zoneId].name} · noch {z.remaining}s</div>
                <ProgressBar pct={100 - (z.remaining / z.total) * 100} color="#7A2E2E" />
              </div>
            ))}
          </div>
        )}

        {!gameOver && (
          <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
            {TABS.map((t) => {
              const Icon = t.icon; const active = tab === t.id;
              return (
                <button key={t.id} className="kw-btn" onClick={() => setTab(t.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", borderRadius: "8px", border: "none", cursor: "pointer", background: active ? "#3E6B4A" : "rgba(37,68,51,0.18)", color: active ? "#F3F7EE" : "#254433", fontWeight: 600, fontSize: "13px" }}>
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
            <button className="kw-btn" onClick={restartGame} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "10px", border: "none", background: "#254433", color: "#F3F7EE", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>
              <RotateCcw size={16} /> Neu beginnen
            </button>
          </div>
        ) : tab === "basis" ? (
          <>
            <div style={{ position: "relative", flex: 1 }}>
              <div onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} onWheel={onWheel}
                style={{ position: "relative", height: "min(68vh, 640px)", borderRadius: "12px", overflow: "hidden", background: "#2C5240", touchAction: "none", cursor: "grab", border: "3px solid #1F3B2C", perspective: effects3D ? "900px" : undefined }}>
                <div style={{ position: "absolute", left: 0, top: 0, width: COLS * TILE, height: ROWS * TILE, transform: effects3D ? `perspective(900px) rotateX(20deg) translate(${pan.x}px, ${pan.y}px) scale(${zoom})` : `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "top left" }}>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, ${TILE}px)`, gridTemplateRows: `repeat(${ROWS}, ${TILE}px)` }}>
                    {terrain.map((t, i) => {
                      const building = buildings[i];
                      const nodeKey = nodes[i];
                      const bDef = building ? BUILDING_TYPES[building] : null;
                      const nDef = nodeKey ? NODE_DEFS[nodeKey] : null;
                      const isTownhall = building === "rathaus";
                      const zoneId = zoneIndexOfTile(i);
                      const locked = !zonesUnlocked[zoneId];
                      const isVillageTile = locked && villageTileMap[i] === zoneId;
                      const isSmoking = building && SMOKE_BUILDINGS.has(building);
                      const tileClass = [
                        "kw-tile",
                        t === "wasser" && !building ? "tile-water" : "",
                        t === "wald" && !building ? "tile-wald" : "",
                        (bDef || isTownhall) ? (effects3D ? "kw-building-3d" : "kw-building") : "",
                        isTownhall ? "kw-townhall" : "",
                        isSmoking ? "kw-smoke" : "",
                      ].filter(Boolean).join(" ");
                      const buildingBg = "linear-gradient(160deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.22) 100%)";
                      return (
                        <div key={i} onClick={() => handleTileClick(i)} title={locked ? "Gesperrtes Gebiet – anklicken zum Erobern" : isTownhall ? "Rathaus" : bDef?.name || nDef?.name || t}
                          className={tileClass}
                          style={{ width: TILE, height: TILE, position: "relative", background: bDef ? `${buildingBg}, ${bDef.color}` : isTownhall ? `${buildingBg}, #8C5A2B` : getTileBg(region, t), border: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          {isTownhall && <Landmark size={15} color="#F3F7EE" />}
                          {bDef && <bDef.icon size={14} color="#F3F7EE" />}
                          {isVillageTile && !building && <Flag size={13} color="#C24A4A" style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.6))" }} />}
                          {building === "markt" && <div key={`pulse-${marketPulse}`} className="market-pulse" />}
                          {!building && nDef && <nDef.icon size={14} color="#FFF7DE" style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.6))" }} />}
                          {locked && <div className="zone-fog" />}
                          {locked && !isVillageTile && i === zoneCenterTile[zoneId] && (
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                              <Lock size={12} color="#F3F7EE" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.8))" }} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {villagerDots.map((v) => (
                    <div key={`v${v.id}`} className="dot-bob" title="Dorfbewohner" style={{ position: "absolute", left: `${v.x}%`, top: `${v.y}%`, width: "6px", height: "6px", borderRadius: "50%", background: "#F3E7C9", transition: "left 1s linear, top 1s linear", boxShadow: "0 0 0 1.5px rgba(0,0,0,0.4)" }} />
                  ))}
                  {jobDots.map((j) => (
                    <div key={j.id} className="dot-bob" title={JOB_META[j.type].label} style={{ position: "absolute", left: `${j.x}%`, top: `${j.y}%`, width: "7px", height: "7px", borderRadius: "50%", background: JOB_META[j.type].color, transition: "left 1s linear, top 1s linear", boxShadow: "0 0 0 1.5px rgba(0,0,0,0.45)" }} />
                  ))}
                  {guardDots.map((v) => (
                    <div key={`g${v.id}`} style={{ position: "absolute", left: `${v.x}%`, top: `${v.y}%`, width: raidWarning ? "8px" : "7px", height: raidWarning ? "8px" : "7px", borderRadius: "2px", background: raidWarning ? "#E8524A" : "#A13A3A", transition: "left 1s linear, top 1s linear, background 0.3s, width 0.3s, height 0.3s", boxShadow: raidWarning ? "0 0 0 2px rgba(232,82,74,0.5)" : "0 0 0 1.5px rgba(0,0,0,0.4)" }} title="Wache" />
                  ))}
                  {chickenDots.map((c) => (
                    <div key={`c${c.id}`} style={{ position: "absolute", left: `${c.x}%`, top: `${c.y}%`, transition: "left 1.2s linear, top 1.2s linear" }}>
                      <Egg size={8} color="#F5F0DA" style={{ filter: "drop-shadow(0 0 1px rgba(0,0,0,0.5))" }} />
                    </div>
                  ))}
                  {raidWarning && raidEnemies.map((en) => {
                    const thX = ((TOWNHALL_COL + 0.5) / COLS) * 100;
                    const thY = ((TOWNHALL_ROW + 0.5) / ROWS) * 100;
                    const progress = clamp((10 - raidTimer) / 10, 0, 1);
                    const ex = en.sx + (thX - en.sx) * progress;
                    const ey = en.sy + (thY - en.sy) * progress;
                    return (
                      <div key={`enemy-${en.id}`} style={{ position: "absolute", left: `${ex}%`, top: `${ey}%`, transition: "left 1s linear, top 1s linear" }}>
                        <Swords size={13} color="#C24A4A" style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.7))" }} />
                      </div>
                    );
                  })}
                </div>
                <div className="kw-map-vignette" />
                <div style={{ position: "absolute", bottom: "8px", right: "8px", display: "flex", flexDirection: "column", gap: "5px" }}>
                  <button className="kw-btn" onClick={() => setZoom((z) => Math.min(2.2, z + 0.2))} style={zoomBtnStyle}><ZoomIn size={14} /></button>
                  <button className="kw-btn" onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))} style={zoomBtnStyle}><ZoomOut size={14} /></button>
                  <button className="kw-btn" onClick={resetView} style={zoomBtnStyle}><RotateCcw size={14} /></button>
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
              {Object.entries(BUILDING_TYPES).filter(([, def]) => !def.notBuildable).map(([key, def]) => {
                const Icon = def.icon; const affordable = canAfford(resources, def.cost); const selected = selectedType === key;
                return (
                  <button key={key} className="kw-btn" onClick={() => setSelectedType(selected ? null : key)}
                    style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "8px 10px", borderRadius: "10px", border: selected ? "2px solid #1F3B2C" : "2px solid transparent", background: "#F3F7EE", cursor: "pointer", opacity: affordable ? 1 : 0.5, minWidth: "78px" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: def.color, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={14} color="#F3F7EE" /></div>
                    <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#1F3B2C", textAlign: "center" }}>{def.name}</div>
                    <div style={{ fontSize: "9.5px", color: "#5C6B5A", textAlign: "center" }}>{Object.entries(def.cost).map(([k, v]) => `${v} ${RESOURCE_META[k].label}`).join(", ") || "kostenlos"}</div>
                  </button>
                );
              })}
              {Object.entries(TOOLS).map(([key, def]) => {
                const Icon = def.icon; const affordable = canAfford(resources, def.cost); const selected = selectedType === key;
                return (
                  <button key={key} className="kw-btn" onClick={() => setSelectedType(selected ? null : key)}
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
                        <button className="kw-btn" onClick={() => startCraft(craft)} disabled={!!active || !affordable}
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
                Sekunde {e.sec}: <strong>-{e.damage} Ressourcen</strong> · Mauern: {e.mauerCount} · stationierte Truppen: {e.garrisonedTotal || 0}
              </div>
            ))}
          </div>
        )}
      </div>

      {zoneAttackPanel !== null && (() => {
        const zone = ZONE_META[zoneAttackPanel];
        const village = npcVillages[zoneAttackPanel];
        const cost = ZONE_UNLOCK_COST[zone.tier];
        const affordable = canAfford(resources, cost);
        const ongoing = zoneAssaults.find((z) => z.zoneId === zoneAttackPanel);
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(20,30,24,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 58 }} onClick={() => setZoneAttackPanel(null)}>
            <div style={{ background: "#F3F7EE", borderRadius: "16px", padding: "20px", width: "280px", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
              <Lock size={22} color="#7A2E2E" style={{ marginBottom: "8px" }} />
              <div style={{ fontFamily: "Cinzel, serif", fontSize: "16px", fontWeight: 700, color: "#1F3B2C", marginBottom: "8px" }}>{zone.name} (gesperrt)</div>
              <div style={{ fontSize: "12.5px", color: "#3A3630", lineHeight: 1.5, marginBottom: "12px" }}>
                Verteidigung des Dorfs: {village ? village.defense : "?"}<br />
                Dein Truppenpool: {troopPool}<br />
                Kosten: {Object.entries(cost).map(([k, v]) => `${v} ${RESOURCE_META[k].label}`).join(", ")}
              </div>
              {ongoing ? (
                <div style={{ fontSize: "13px", color: "#5C6B5A" }}>Feldzug läuft … noch {ongoing.remaining}s</div>
              ) : (
                <button className="kw-btn" onClick={() => startZoneAssault(zoneAttackPanel)} disabled={!affordable || troopPool <= 0}
                  style={{ padding: "10px 16px", borderRadius: "10px", border: "none", background: affordable && troopPool > 0 ? "#254433" : "#8C8375", color: "#F3F7EE", fontWeight: 600, fontSize: "13px", cursor: affordable && troopPool > 0 ? "pointer" : "default", width: "100%" }}>
                  Angriff starten (alle {troopPool} Truppen)
                </button>
              )}
              <button className="kw-btn" onClick={() => setZoneAttackPanel(null)} style={{ ...menuBtnStyle, marginTop: "10px" }}>Schließen</button>
            </div>
          </div>
        );
      })()}

      {showPauseMenu && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(20,30,24,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#F3F7EE", borderRadius: "16px", padding: "22px", width: "280px", textAlign: "center" }}>
            <div style={{ fontFamily: "Cinzel, serif", fontSize: "18px", fontWeight: 700, color: "#1F3B2C", marginBottom: "16px" }}>Menü</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button className="kw-btn" onClick={() => setShowPauseMenu(false)} style={menuBtnStyle}>Weiterspielen</button>
              <button className="kw-btn" onClick={() => { setShowPauseMenu(false); setShowSettings(true); }} style={menuBtnStyle}>Einstellungen</button>
              <button className="kw-btn" onClick={() => setShowDevPanel(true)} style={menuBtnStyle}><Settings size={13} style={{ marginRight: "6px" }} />Entwickler-Menü</button>
              <button className="kw-btn" onClick={restartGame} style={menuBtnStyle}>Neu starten</button>
              <button className="kw-btn" onClick={() => { setShowPauseMenu(false); setRegion(null); }} style={{ ...menuBtnStyle, background: "rgba(122,46,46,0.15)", color: "#7A2E2E" }}>Zur Regionswahl</button>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(20,30,24,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 61 }}>
          <div style={{ background: "#F3F7EE", borderRadius: "16px", padding: "22px", width: "290px" }}>
            <div style={{ fontFamily: "Cinzel, serif", fontSize: "16px", fontWeight: 700, color: "#1F3B2C", marginBottom: "14px" }}>Einstellungen</div>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#1F3B2C", marginBottom: "10px", cursor: "pointer" }}>
              <input type="checkbox" checked={villagersOn} onChange={(e) => setVillagersOn(e.target.checked)} /> Bewohner anzeigen
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#1F3B2C", marginBottom: "10px", cursor: "pointer" }}>
              <input type="checkbox" checked={effects3D} onChange={(e) => setEffects3D(e.target.checked)} /> 3D-Effekt (Kippung + Schatten)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#1F3B2C", marginBottom: "14px", cursor: "pointer" }}>
              <input type="checkbox" checked={reduceMotion} onChange={(e) => setReduceMotion(e.target.checked)} /> Reduzierte Bewegung (Animationen aus)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#1F3B2C", marginBottom: "6px", cursor: "pointer" }}>
              <input type="checkbox" checked={raidsPaused} onChange={(e) => setRaidsPaused(e.target.checked)} /> Friedensmodus (keine Angriffe)
            </label>
            <div style={{ fontSize: "11px", color: "#5C6B5A", marginBottom: "14px", lineHeight: 1.4 }}>Schalte Angriffe jederzeit selbst ab, wenn du in Ruhe bauen willst.</div>
            <button className="kw-btn" onClick={() => setShowSettings(false)} style={menuBtnStyle}>Schließen</button>
          </div>
        </div>
      )}

      {showDevPanel && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(20,30,24,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }}>
          <div style={{ background: "#F3F7EE", borderRadius: "16px", padding: "22px", width: "300px", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ fontFamily: "Cinzel, serif", fontSize: "16px", fontWeight: 700, color: "#1F3B2C", marginBottom: "14px" }}>Entwickler-Menü</div>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#1F3B2C", marginBottom: "12px", cursor: "pointer" }}>
              <input type="checkbox" checked={raidsPaused} onChange={(e) => setRaidsPaused(e.target.checked)} /> Angriffe pausieren
            </label>
            <div style={{ fontSize: "12px", color: "#1F3B2C", marginBottom: "4px" }}>Angriffsintervall (Sekunden)</div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
              <input type="number" value={raidMin} min={5} onChange={(e) => setRaidMin(Number(e.target.value))} style={inputStyle} />
              <input type="number" value={raidMax} min={5} onChange={(e) => setRaidMax(Number(e.target.value))} style={inputStyle} />
            </div>
            <button className="kw-btn" onClick={() => setRaidTimer(1)} style={{ ...menuBtnStyle, marginBottom: "8px" }}>Angriff jetzt auslösen</button>

            <div style={{ fontSize: "12px", color: "#1F3B2C", margin: "14px 0 4px", fontWeight: 700 }}>Zonen &amp; Truppen</div>
            <button className="kw-btn" onClick={devUnlockNextZone} style={{ ...menuBtnStyle, marginBottom: "8px" }}>Nächste Zone freischalten</button>
            <div style={{ fontSize: "12px", color: "#1F3B2C", marginBottom: "4px" }}>Truppenpool setzen</div>
            <input type="number" value={troopPool} onChange={(e) => setTroopPool(Number(e.target.value))} style={{ ...inputStyle, marginBottom: "12px" }} />

            <div style={{ fontSize: "12px", color: "#1F3B2C", margin: "4px 0 4px", fontWeight: 700 }}>Welt</div>
            <button className="kw-btn" onClick={restartGame} style={{ ...menuBtnStyle, marginBottom: "8px" }}>🎲 Neue Zufallswelt generieren</button>
            <button className="kw-btn" onClick={() => { localStorage.removeItem(SAVE_KEY); flash("Spielstand gelöscht."); }} style={{ ...menuBtnStyle, marginBottom: "12px" }}>Spielstand löschen</button>

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

            <button className="kw-btn" onClick={() => setShowDevPanel(false)} style={menuBtnStyle}>Schließen</button>
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
              const garrisonCount = garrisons[selectedInfo] || 0;
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
                      : def.garrisonBuilding ? "Stationiere hier Truppen, um Angriffe abzuwehren."
                      : def.notBuildable ? "Zeichen deiner Eroberung dieses Gebiets."
                      : "Keine aktive Produktion."}
                  </div>
                  {def.garrisonBuilding && (
                    <div style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                      <button className="kw-btn" onClick={() => assignGarrison(selectedInfo, -1)} style={zoomBtnStyle}>-</button>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#1F3B2C", minWidth: "80px" }}>{garrisonCount} stationiert</div>
                      <button className="kw-btn" onClick={() => assignGarrison(selectedInfo, 1)} style={zoomBtnStyle}>+</button>
                    </div>
                  )}
                </>
              );
            })()}
            <button className="kw-btn" onClick={() => setSelectedInfo(null)} style={{ ...menuBtnStyle, marginTop: "14px" }}>Schließen</button>
          </div>
        </div>
      )}
    </div>
  );
}

const zoomBtnStyle = { width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "rgba(31,59,44,0.85)", color: "#F3F7EE", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };
const menuBtnStyle = { padding: "10px 14px", borderRadius: "8px", border: "none", background: "rgba(37,68,51,0.12)", color: "#1F3B2C", fontWeight: 600, fontSize: "13px", cursor: "pointer" };
const inputStyle = { width: "100%", padding: "7px", borderRadius: "6px", border: "1px solid #C9C4B4", fontSize: "13px" };
