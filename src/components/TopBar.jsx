import { Users, Swords, Menu, Settings } from "lucide-react";
import { REGIONS } from "../gameData";

export default function TopBar({ region, population, troopPool, onOpenMenu, onOpenDev }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
      <div title={REGIONS[region].bonusLabel} style={{ fontFamily: "Cinzel, serif", fontSize: "19px", fontWeight: 700, color: "#1F3B2C" }}>Reich · {REGIONS[region].name}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div title="Bevölkerung" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#1F3B2C", fontWeight: 600 }}>
          <Users size={13} /> {population}
        </div>
        <div title="Truppen im Reservepool" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#1F3B2C", fontWeight: 600 }}>
          <Swords size={13} /> {troopPool}
        </div>
        <button onClick={onOpenMenu} title="Menü (Escape)" style={{ background: "rgba(37,68,51,0.18)", border: "none", borderRadius: "8px", width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1F3B2C" }}>
          <Menu size={18} />
        </button>
        <button onClick={onOpenDev} title="Entwickler-Menü" style={{ background: "rgba(37,68,51,0.18)", border: "none", borderRadius: "8px", width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1F3B2C" }}>
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}
