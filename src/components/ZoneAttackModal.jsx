import { Lock } from "lucide-react";
import { ZONE_META, ZONE_UNLOCK_COST, RESOURCE_META, canAfford } from "../gameData";
import { menuBtnStyle } from "../styles";

export default function ZoneAttackModal({ zoneId, npcVillages, resources, troopPool, zoneAssaults, onClose, onStartAssault }) {
  const zone = ZONE_META[zoneId];
  const village = npcVillages[zoneId];
  const cost = ZONE_UNLOCK_COST[zone.tier];
  const affordable = canAfford(resources, cost);
  const ongoing = zoneAssaults.find((z) => z.zoneId === zoneId);
  return (
    <div className="kw-modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(20,30,24,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 58 }} onClick={onClose}>
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
          <button className="kw-btn" onClick={() => onStartAssault(zoneId)} disabled={!affordable || troopPool <= 0}
            style={{ padding: "10px 16px", borderRadius: "10px", border: "none", background: affordable && troopPool > 0 ? "#254433" : "#8C8375", color: "#F3F7EE", fontWeight: 600, fontSize: "13px", cursor: affordable && troopPool > 0 ? "pointer" : "default", width: "100%" }}>
            Angriff starten (alle {troopPool} Truppen)
          </button>
        )}
        <button className="kw-btn" onClick={onClose} style={{ ...menuBtnStyle, marginTop: "10px" }}>Schließen</button>
      </div>
    </div>
  );
}
