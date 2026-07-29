import { useState, useEffect, useRef, useCallback } from "react";
import {
  TOWNHALL_ROW, TOWNHALL_COL, idx, zoneIndexOfTile,
  REGIONS, BUILDING_TYPES, TOOLS, NODE_DEFS,
  START_RESOURCES, BASE_CAP, GLOBAL_STYLES, SAVE_KEY, FIRST_RAID_DELAY,
  DEFAULT_RAID_MIN, DEFAULT_RAID_MAX,
  ZONE_META, ZONE_UNLOCK_COST,
  generateMap, canAfford, pay, clampCap,
} from "./gameData";
import { useEntityDots } from "./hooks/useEntityDots";
import { useGameLoop } from "./hooks/useGameLoop";
import SpawnScreen from "./components/SpawnScreen";
import ResourceBar from "./components/ResourceBar";
import TopBar from "./components/TopBar";
import StatusBanners from "./components/StatusBanners";
import Tabs from "./components/Tabs";
import GameMap from "./components/GameMap";
import BuildMenu from "./components/BuildMenu";
import CraftingPanel from "./components/CraftingPanel";
import RaidLog from "./components/RaidLog";
import GameOverPanel from "./components/GameOverPanel";
import ZoneAttackModal from "./components/ZoneAttackModal";
import PauseMenu from "./components/PauseMenu";
import SettingsModal from "./components/SettingsModal";
import DevPanel from "./components/DevPanel";
import BuildingInfoModal from "./components/BuildingInfoModal";

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
// Main component — owns all game state and orchestrates the hooks/
// components that used to all live inline here. Presentational pieces live
// in components/, the tick simulation lives in hooks/useGameLoop, and the
// wandering "entity dot" state lives in hooks/useEntityDots.
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
  const [reduceMotion, setReduceMotion] = useState(false);
  const [perfMode, setPerfMode] = useState(() => typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches);
  const [marketPulse, setMarketPulse] = useState(0);
  const [message, setMessage] = useState(null);
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

  const {
    villagerDots, setVillagerDots, guardDots, setGuardDots,
    chickenDots, setChickenDots, jobDots, setJobDots,
    raidEnemies, setRaidEnemies,
  } = useEntityDots({
    region, population, villagersOn, kaserneCount,
    bauernhofIndices, holzfaellerIndices, steinbruchIndices, marktIndices,
    raidWarning,
  });

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

  useGameLoop({
    region, gameOver, buildings, mapData, cap, marktCount, mauerCount, kaserneCount,
    flash, raidsPaused, raidMin, raidMax, regionBonus,
    tickRef, resourcesRef, raidTimerRef, gameStateRef,
    setResources, setMarketPulse, setTroopPool, setExpeditions, setCrafts, setInventory,
    setZoneAssaults, setZonesUnlocked, setBuildings,
    setVillagerDots, setGuardDots, setChickenDots, setJobDots,
    setRaidTimer, setRaidLog, setGameOver,
  });

  function handleTileClick(index) {
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

  const rootClass = reduceMotion || perfMode ? "reduce-motion" : "";

  return (
    <div className={rootClass} style={{ minHeight: "100vh", width: "100%", background: "linear-gradient(160deg, #BFE3D6 0%, #8FBFA8 45%, #4C8C6B 100%)", padding: "16px", fontFamily: "Inter, sans-serif", display: "flex", justifyContent: "center", boxSizing: "border-box" }}>
      <style>{GLOBAL_STYLES}</style>

      <div style={{ width: "100%", maxWidth: "780px", display: "flex", flexDirection: "column" }}>
        <TopBar region={region} population={population} troopPool={troopPool} onOpenMenu={() => setShowPauseMenu(true)} onOpenDev={() => setShowDevPanel(true)} />

        <div style={{ background: "#254433", borderRadius: "12px", padding: "10px 12px", marginBottom: "12px" }}>
          <ResourceBar resources={resources} cap={cap} />
        </div>

        <StatusBanners raidWarning={raidWarning} gameOver={gameOver} raidTimer={raidTimer} message={message} expeditions={expeditions} zoneAssaults={zoneAssaults} />

        {!gameOver && <Tabs tab={tab} setTab={setTab} />}

        {gameOver ? (
          <GameOverPanel onRestart={restartGame} />
        ) : tab === "basis" ? (
          <>
            <GameMap
              region={region} terrain={terrain} buildings={buildings} nodes={nodes} npcVillages={npcVillages}
              zonesUnlocked={zonesUnlocked} perfMode={perfMode} marketPulse={marketPulse}
              villagerDots={villagerDots} guardDots={guardDots} chickenDots={chickenDots} jobDots={jobDots}
              raidEnemies={raidEnemies} raidWarning={raidWarning} raidTimer={raidTimer}
              tutorialStep={tutorialStep} setTutorialStep={setTutorialStep} onTileClick={handleTileClick}
            />
            <BuildMenu resources={resources} selectedType={selectedType} setSelectedType={setSelectedType} />
          </>
        ) : tab === "schmiede" ? (
          <CraftingPanel hasSchmiede={hasSchmiede} inventory={inventory} crafts={crafts} resources={resources} onStartCraft={startCraft} />
        ) : (
          <RaidLog raidLog={raidLog} />
        )}
      </div>

      {zoneAttackPanel !== null && (
        <ZoneAttackModal
          zoneId={zoneAttackPanel} npcVillages={npcVillages} resources={resources} troopPool={troopPool}
          zoneAssaults={zoneAssaults} onClose={() => setZoneAttackPanel(null)} onStartAssault={startZoneAssault}
        />
      )}

      {showPauseMenu && (
        <PauseMenu
          onResume={() => setShowPauseMenu(false)}
          onOpenSettings={() => { setShowPauseMenu(false); setShowSettings(true); }}
          onOpenDev={() => setShowDevPanel(true)}
          onRestart={restartGame}
          onExitToSpawn={() => { setShowPauseMenu(false); setRegion(null); }}
        />
      )}

      {showSettings && (
        <SettingsModal
          villagersOn={villagersOn} setVillagersOn={setVillagersOn}
          reduceMotion={reduceMotion} setReduceMotion={setReduceMotion}
          perfMode={perfMode} setPerfMode={setPerfMode}
          raidsPaused={raidsPaused} setRaidsPaused={setRaidsPaused}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showDevPanel && (
        <DevPanel
          raidsPaused={raidsPaused} setRaidsPaused={setRaidsPaused}
          raidMin={raidMin} setRaidMin={setRaidMin} raidMax={raidMax} setRaidMax={setRaidMax}
          onTriggerRaidNow={() => setRaidTimer(1)} onUnlockNextZone={devUnlockNextZone}
          troopPool={troopPool} setTroopPool={setTroopPool}
          onNewRandomWorld={restartGame} resources={resources} setResources={setResources}
          devPopBonus={devPopBonus} setDevPopBonus={setDevPopBonus}
          onClose={() => setShowDevPanel(false)} flash={flash}
        />
      )}

      {selectedInfo !== null && buildings[selectedInfo] && (
        <BuildingInfoModal
          tileIndex={selectedInfo} buildings={buildings} population={population} cap={cap} maxTroops={maxTroops}
          garrisons={garrisons} onClose={() => setSelectedInfo(null)} onAssignGarrison={assignGarrison}
        />
      )}
    </div>
  );
}
