import { Landmark } from "lucide-react";
import { BUILDING_TYPES, RESOURCE_META } from "../gameData";
import { menuBtnStyle, zoomBtnStyle } from "../styles";

export default function BuildingInfoModal({ tileIndex, buildings, population, cap, maxTroops, garrisons, onClose, onAssignGarrison }) {
  const building = buildings[tileIndex];
  return (
    <div className="kw-modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(20,30,24,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 55 }}
      onClick={onClose}>
      <div style={{ background: "#F3F7EE", borderRadius: "16px", padding: "20px", width: "260px", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
        {building === "rathaus" ? (
          <>
            <Landmark size={24} color="#8C5A2B" style={{ marginBottom: "8px" }} />
            <div style={{ fontFamily: "Cinzel, serif", fontSize: "16px", fontWeight: 700, color: "#1F3B2C", marginBottom: "8px" }}>Rathaus</div>
            <div style={{ fontSize: "12.5px", color: "#3A3630", lineHeight: 1.5 }}>
              Zentrum deines Reichs.<br />Bevölkerung: {population}<br />Lagerkapazität: {cap} pro Rohstoff<br />Max. gleichzeitige Trupps: {maxTroops}
            </div>
          </>
        ) : (() => {
          const def = BUILDING_TYPES[building];
          const Icon = def.icon;
          const garrisonCount = garrisons[tileIndex] || 0;
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
                  <button className="kw-btn" onClick={() => onAssignGarrison(tileIndex, -1)} style={zoomBtnStyle}>-</button>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#1F3B2C", minWidth: "80px" }}>{garrisonCount} stationiert</div>
                  <button className="kw-btn" onClick={() => onAssignGarrison(tileIndex, 1)} style={zoomBtnStyle}>+</button>
                </div>
              )}
            </>
          );
        })()}
        <button className="kw-btn" onClick={onClose} style={{ ...menuBtnStyle, marginTop: "14px" }}>Schließen</button>
      </div>
    </div>
  );
}
