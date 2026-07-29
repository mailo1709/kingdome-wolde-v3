import { useEffect } from "react";
import {
  COLS, ROWS, TOWNHALL_ROW, TOWNHALL_COL, idx, clamp, clampCap,
  BUILDING_TYPES, NODE_DEFS, RESOURCE_META, CRAFTS, ZONE_META,
  TROOP_GROWTH_INTERVAL_TICKS, TROOP_CAP_PER_KASERNE, SAVE_KEY,
} from "../gameData";

// Autosaves the freshest game state (via gameStateRef, kept up to date by
// App.jsx) every 10s, independent of the tick simulation below.
function useAutosave(region, gameStateRef) {
  useEffect(() => {
    if (!region) return;
    const id = setInterval(() => {
      if (!gameStateRef.current) return;
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(gameStateRef.current)); } catch { /* storage unavailable */ }
    }, 10000);
    return () => clearInterval(id);
  }, [region, gameStateRef]);
}

// The core 1s simulation tick: resource production, troop growth,
// expeditions, crafting, zone assaults, entity-dot wandering, and the raid
// countdown/resolution. Kept as one interval (matching the original
// App.jsx) so every sub-system advances in lockstep each second.
export function useGameLoop({
  region, gameOver, buildings, mapData, cap, marktCount, mauerCount, kaserneCount,
  flash, raidsPaused, raidMin, raidMax, regionBonus,
  tickRef, resourcesRef, raidTimerRef, gameStateRef,
  setResources, setMarketPulse, setTroopPool, setExpeditions, setCrafts, setInventory,
  setZoneAssaults, setZonesUnlocked, setBuildings,
  setVillagerDots, setGuardDots, setChickenDots, setJobDots,
  setRaidTimer, setRaidLog, setGameOver,
}) {
  useAutosave(region, gameStateRef);

  useEffect(() => {
    if (!region || gameOver) return;
    const terrain = mapData.terrain;
    const isPassable = (index) => !(terrain[index] === "wasser" && buildings[index] !== "bruecke");
    const pctToIndex = (xPct, yPct) => {
      const c = clamp(Math.floor((xPct / 100) * COLS), 0, COLS - 1);
      const r = clamp(Math.floor((yPct / 100) * ROWS), 0, ROWS - 1);
      return idx(r, c);
    };

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
}
