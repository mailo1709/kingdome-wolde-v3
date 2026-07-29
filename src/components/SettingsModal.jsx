import { menuBtnStyle } from "../styles";

export default function SettingsModal({
  villagersOn, setVillagersOn, reduceMotion, setReduceMotion, perfMode, setPerfMode,
  raidsPaused, setRaidsPaused, onClose,
}) {
  return (
    <div className="kw-modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(20,30,24,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 61 }}>
      <div style={{ background: "#F3F7EE", borderRadius: "16px", padding: "22px", width: "290px" }}>
        <div style={{ fontFamily: "Cinzel, serif", fontSize: "16px", fontWeight: 700, color: "#1F3B2C", marginBottom: "14px" }}>Einstellungen</div>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#1F3B2C", marginBottom: "10px", cursor: "pointer" }}>
          <input type="checkbox" checked={villagersOn} onChange={(e) => setVillagersOn(e.target.checked)} /> Bewohner anzeigen
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#1F3B2C", marginBottom: "10px", cursor: "pointer" }}>
          <input type="checkbox" checked={reduceMotion} onChange={(e) => setReduceMotion(e.target.checked)} /> Reduzierte Bewegung (Animationen aus)
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#1F3B2C", marginBottom: "14px", cursor: "pointer" }}>
          <input type="checkbox" checked={perfMode} onChange={(e) => setPerfMode(e.target.checked)} /> Sparmodus (weniger Effekte, für ältere Handys)
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#1F3B2C", marginBottom: "6px", cursor: "pointer" }}>
          <input type="checkbox" checked={raidsPaused} onChange={(e) => setRaidsPaused(e.target.checked)} /> Friedensmodus (keine Angriffe)
        </label>
        <div style={{ fontSize: "11px", color: "#5C6B5A", marginBottom: "14px", lineHeight: 1.4 }}>Schalte Angriffe jederzeit selbst ab, wenn du in Ruhe bauen willst.</div>
        <button className="kw-btn" onClick={onClose} style={menuBtnStyle}>Schließen</button>
      </div>
    </div>
  );
}
