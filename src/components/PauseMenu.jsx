import { Settings } from "lucide-react";
import { menuBtnStyle } from "../styles";

export default function PauseMenu({ onResume, onOpenSettings, onOpenDev, onRestart, onExitToSpawn }) {
  return (
    <div className="kw-modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(20,30,24,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
      <div style={{ background: "#F3F7EE", borderRadius: "16px", padding: "22px", width: "280px", textAlign: "center" }}>
        <div style={{ fontFamily: "Cinzel, serif", fontSize: "18px", fontWeight: 700, color: "#1F3B2C", marginBottom: "16px" }}>Menü</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button className="kw-btn" onClick={onResume} style={menuBtnStyle}>Weiterspielen</button>
          <button className="kw-btn" onClick={onOpenSettings} style={menuBtnStyle}>Einstellungen</button>
          <button className="kw-btn" onClick={onOpenDev} style={menuBtnStyle}><Settings size={13} style={{ marginRight: "6px" }} />Entwickler-Menü</button>
          <button className="kw-btn" onClick={onRestart} style={menuBtnStyle}>Neu starten</button>
          <button className="kw-btn" onClick={onExitToSpawn} style={{ ...menuBtnStyle, background: "rgba(122,46,46,0.15)", color: "#7A2E2E" }}>Zur Regionswahl</button>
        </div>
      </div>
    </div>
  );
}
