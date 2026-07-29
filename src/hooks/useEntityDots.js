import { useEffect, useState } from "react";
import { COLS, ROWS } from "../gameData";

// Owns the small decorative "entity dot" state (villagers, guards, chickens,
// job workers, raid enemies) and the effects that keep their counts in sync
// with population/buildings. Movement each tick still happens inside
// useGameLoop, which is why the setters are returned alongside the state.
export function useEntityDots({
  region, population, villagersOn, kaserneCount,
  bauernhofIndices, holzfaellerIndices, steinbruchIndices, marktIndices,
  raidWarning,
}) {
  const [villagerDots, setVillagerDots] = useState([]);
  const [guardDots, setGuardDots] = useState([]);
  const [chickenDots, setChickenDots] = useState([]);
  const [jobDots, setJobDots] = useState([]);
  const [raidEnemies, setRaidEnemies] = useState([]);

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
      setRaidEnemies((prev) => (prev.length ? prev : Array.from({ length: 3 + Math.floor(Math.random() * 4) }, (_, i) => ({
        id: i,
        sx: Math.random() < 0.5 ? 1 + Math.random() * 3 : 96 + Math.random() * 3,
        sy: 3 + Math.random() * 88,
      }))));
    } else {
      setRaidEnemies([]);
    }
  }, [raidWarning, region]);

  return {
    villagerDots, setVillagerDots,
    guardDots, setGuardDots,
    chickenDots, setChickenDots,
    jobDots, setJobDots,
    raidEnemies, setRaidEnemies,
  };
}
