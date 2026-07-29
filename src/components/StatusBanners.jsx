import { Swords } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { NODE_DEFS, ZONE_META } from "../gameData";
import { COLORS } from "../styles";

// Groups the transient status strips shown above the map. Raid warnings are
// styled as urgent (solid danger color, bold) while plain messages read as a
// quieter info toast — keeping the two visually distinct was the point of
// splitting this out of the old single dark-green message block.
export default function StatusBanners({ raidWarning, gameOver, raidTimer, message, expeditions, zoneAssaults }) {
  if (gameOver) return null;
  return (
    <>
      {raidWarning && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: COLORS.danger, color: COLORS.alertText, fontSize: "12px", fontWeight: 700, padding: "9px 12px", borderRadius: "8px", marginBottom: "10px", boxShadow: "0 0 0 2px rgba(232,82,74,0.35)" }}>
          <Swords size={14} /> Angriff in {raidTimer}s – Mauern und Wachposten schützen dich!
        </div>
      )}
      {message && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: COLORS.panelSofter, color: COLORS.ink, fontSize: "12px", fontWeight: 500, padding: "8px 12px", borderRadius: "8px", marginBottom: "10px", borderLeft: `3px solid ${COLORS.accent}` }}>
          {message}
        </div>
      )}
      {expeditions.length > 0 && (
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
      {zoneAssaults.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "10px" }}>
          {zoneAssaults.map((z) => (
            <div key={z.zoneId} style={{ background: "rgba(255,255,255,0.55)", borderRadius: "8px", padding: "6px 10px" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#1F3B2C", marginBottom: "3px" }}>Feldzug: {ZONE_META[z.zoneId].name} · noch {z.remaining}s</div>
              <ProgressBar pct={100 - (z.remaining / z.total) * 100} color="#7A2E2E" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
