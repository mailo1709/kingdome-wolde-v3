import { Landmark, Flag, Lock, Swords, Egg, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import {
  COLS, ROWS, TOWNHALL_ROW, TOWNHALL_COL, idx, clamp, zoneIndexOfTile,
  REGIONS, BUILDING_TYPES, NODE_DEFS, JOB_META, TUTORIAL_STEPS, SMOKE_BUILDINGS,
  ZONE_META, ZONE_ROWS, ZONE_COLS,
  ISO_W, ISO_H, ISO_CLIP, ISO_MAP_WIDTH, ISO_MAP_HEIGHT, isoX, isoY,
  getTileBg, cubeFaces,
} from "../gameData";
import { zoomBtnStyle } from "../styles";
import { useMapInteraction } from "../hooks/useMapInteraction";

// Entity "dots" keep moving in the simple percent-of-map coordinate space
// they always have; this only reprojects that point into the isometric
// screen position for rendering.
function isoDotStyle(xPct, yPct) {
  const rowF = (yPct / 100) * ROWS, colF = (xPct / 100) * COLS;
  return { left: isoX(rowF, colF) + ISO_W / 2, top: isoY(rowF, colF) + ISO_H / 2, zIndex: Math.round(rowF + colF) + 1, transform: "translate(-50%, -50%)" };
}

function buildingExtrudeHeight(building) {
  if (building === "rathaus") return 20;
  if (building === "mauer") return 7;
  if (building === "aussenposten" || building === "bruecke") return 8;
  return 13;
}

export default function GameMap({
  region, terrain, buildings, nodes, npcVillages, zonesUnlocked, perfMode,
  marketPulse, villagerDots, guardDots, chickenDots, jobDots, raidEnemies,
  raidWarning, raidTimer, tutorialStep, setTutorialStep, onTileClick,
}) {
  const {
    zoom, setZoom, pan, mapContainerRef, visibleRange, suppressClickRef,
    onPointerDown, onPointerMove, onPointerUp, onWheel, resetView,
  } = useMapInteraction({ perfMode });

  function handleClick(index) {
    if (suppressClickRef.current) { suppressClickRef.current = false; return; }
    onTileClick(index);
  }

  const villageTileMap = {};
  Object.entries(npcVillages).forEach(([zid, v]) => { villageTileMap[v.tileIndex] = Number(zid); });
  const zoneCenterTile = {};
  ZONE_META.forEach((z) => {
    zoneCenterTile[z.id] = idx(z.rowStart + Math.floor(ZONE_ROWS / 2), z.colStart + Math.floor(ZONE_COLS / 2));
  });

  function renderTiles() {
    const tiles = [];
    const sheen = "linear-gradient(160deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.22) 100%)";
    for (let r = visibleRange.rMin; r <= visibleRange.rMax; r++) {
      for (let c = visibleRange.cMin; c <= visibleRange.cMax; c++) {
        const i = idx(r, c);
        const t = terrain[i];
        const building = buildings[i];
        const nodeKey = nodes[i];
        const bDef = building ? BUILDING_TYPES[building] : null;
        const nDef = nodeKey ? NODE_DEFS[nodeKey] : null;
        const isTownhall = building === "rathaus";
        const zoneId = zoneIndexOfTile(i);
        const locked = !zonesUnlocked[zoneId];
        const isVillageTile = locked && villageTileMap[i] === zoneId;
        const isSmoking = building && SMOKE_BUILDINGS.has(building);
        const groundClass = ["kw-tile", t === "wasser" && !building ? "tile-water" : ""].filter(Boolean).join(" ");
        const height = buildingExtrudeHeight(building);
        const cube = building ? cubeFaces(ISO_W, ISO_H, height) : null;
        const treeCube = !building && t === "wald" && !perfMode ? cubeFaces(ISO_W * 0.5, ISO_H * 0.5, 9) : null;
        tiles.push(
          <div key={i} onClick={() => handleClick(i)}
            title={locked ? "Gesperrtes Gebiet – anklicken zum Erobern" : isTownhall ? "Rathaus" : bDef?.name || nDef?.name || t}
            style={{ position: "absolute", left: isoX(r, c), top: isoY(r, c), width: ISO_W, height: ISO_H, zIndex: r + c, cursor: "pointer" }}>
            <div className={groundClass} style={{ position: "absolute", inset: 0, clipPath: ISO_CLIP, background: getTileBg(region, t) }} />
            {(isVillageTile || (!building && nDef) || locked) && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                {isVillageTile && !building && <Flag size={12} color="#C24A4A" style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.6))" }} />}
                {!building && nDef && <nDef.icon size={13} color="#FFF7DE" style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.6))" }} />}
                {locked && !isVillageTile && i === zoneCenterTile[zoneId] && <Lock size={11} color="#F3F7EE" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.8))" }} />}
              </div>
            )}
            {locked && <div className="zone-fog" style={{ clipPath: ISO_CLIP }} />}
            {treeCube && (
              <div className="tile-wald" style={{ position: "absolute", left: ISO_W * 0.25, top: ISO_H * 0.82 - treeCube.height, width: ISO_W * 0.5, height: treeCube.height }}>
                <div style={{ position: "absolute", inset: 0, clipPath: treeCube.silhouette, background: "rgba(8,14,8,0.5)", transform: "translate(1px, 1.5px)" }} />
                <div className="kw-cube-face" style={{ position: "absolute", inset: 0, clipPath: treeCube.left, background: REGIONS[region].palette.wald[0], filter: "brightness(0.72)" }} />
                <div className="kw-cube-face" style={{ position: "absolute", inset: 0, clipPath: treeCube.right, background: REGIONS[region].palette.wald[0], filter: "brightness(0.48)" }} />
                <div className="kw-cube-face kw-roof" style={{ position: "absolute", inset: 0, clipPath: treeCube.top, background: REGIONS[region].palette.wald[1], filter: "brightness(1.1)" }} />
                <div style={{ position: "absolute", left: "50%", bottom: 0, width: "4px", height: "6px", background: "#5C4128", transform: "translate(-50%, 60%)", borderRadius: "0 0 1px 1px" }} />
              </div>
            )}
            {building && cube && (
              <div style={{ position: "absolute", left: 0, top: ISO_H - cube.height, width: ISO_W, height: cube.height }}>
                <div style={{ position: "absolute", inset: 0, clipPath: cube.silhouette, background: "rgba(8,14,8,0.55)", transform: "translate(1.5px, 2px)" }} />
                <div className="kw-cube-face" style={{ position: "absolute", inset: 0, clipPath: cube.left, background: bDef ? bDef.color : "#8C5A2B", filter: "brightness(0.7)" }} />
                <div className="kw-cube-face" style={{ position: "absolute", inset: 0, clipPath: cube.right, background: bDef ? bDef.color : "#8C5A2B", filter: "brightness(0.45)" }} />
                <div className="kw-cube-face kw-roof" style={{ position: "absolute", inset: 0, clipPath: cube.top, background: `${sheen}, ${bDef ? bDef.color : "#8C5A2B"}`, filter: "brightness(1.12)" }} />
                <div className={["kw-cube-icon", isTownhall ? "kw-townhall" : "", isSmoking ? "kw-smoke" : ""].filter(Boolean).join(" ")}
                  style={{ position: "absolute", left: ISO_W / 2, top: ISO_H / 2, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isTownhall ? <Landmark size={14} color="#F3F7EE" /> : bDef && <bDef.icon size={13} color="#F3F7EE" />}
                  {building === "markt" && <div key={`pulse-${marketPulse}`} className="market-pulse" />}
                </div>
              </div>
            )}
          </div>
        );
      }
    }
    return tiles;
  }

  return (
    <div style={{ position: "relative", flex: 1 }}>
      <div ref={mapContainerRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onPointerLeave={onPointerUp} onWheel={onWheel}
        style={{ position: "relative", height: "min(68vh, 640px)", borderRadius: "12px", overflow: "hidden", background: "#2C5240", touchAction: "none", cursor: "grab", border: "3px solid #1F3B2C" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: ISO_MAP_WIDTH, height: ISO_MAP_HEIGHT, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "top left" }}>
          {renderTiles()}
          {villagerDots.map((v) => (
            <div key={`v${v.id}`} className="dot-bob" title="Dorfbewohner" style={{ position: "absolute", ...isoDotStyle(v.x, v.y), width: "6px", height: "6px", borderRadius: "50%", background: "#F3E7C9", transition: "left 1s linear, top 1s linear", boxShadow: "0 0 0 1.5px rgba(0,0,0,0.4)" }} />
          ))}
          {jobDots.map((j) => (
            <div key={j.id} className="dot-bob" title={JOB_META[j.type].label} style={{ position: "absolute", ...isoDotStyle(j.x, j.y), width: "7px", height: "7px", borderRadius: "50%", background: JOB_META[j.type].color, transition: "left 1s linear, top 1s linear", boxShadow: "0 0 0 1.5px rgba(0,0,0,0.45)" }} />
          ))}
          {guardDots.map((v) => (
            <div key={`g${v.id}`} style={{ position: "absolute", ...isoDotStyle(v.x, v.y), width: raidWarning ? "8px" : "7px", height: raidWarning ? "8px" : "7px", borderRadius: "2px", background: raidWarning ? "#E8524A" : "#A13A3A", transition: "left 1s linear, top 1s linear, background 0.3s, width 0.3s, height 0.3s", boxShadow: raidWarning ? "0 0 0 2px rgba(232,82,74,0.5)" : "0 0 0 1.5px rgba(0,0,0,0.4)" }} title="Wache" />
          ))}
          {chickenDots.map((c) => (
            <div key={`c${c.id}`} style={{ position: "absolute", ...isoDotStyle(c.x, c.y), transition: "left 1.2s linear, top 1.2s linear" }}>
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
              <div key={`enemy-${en.id}`} style={{ position: "absolute", ...isoDotStyle(ex, ey), transition: "left 1s linear, top 1s linear" }}>
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
  );
}
