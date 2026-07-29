import { RESOURCE_META, SAVE_KEY } from "../gameData";
import { menuBtnStyle, inputStyle } from "../styles";

export default function DevPanel({
  raidsPaused, setRaidsPaused, raidMin, setRaidMin, raidMax, setRaidMax,
  onTriggerRaidNow, onUnlockNextZone, troopPool, setTroopPool,
  onNewRandomWorld, resources, setResources, devPopBonus, setDevPopBonus,
  onClose, flash,
}) {
  return (
    <div className="kw-modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(20,30,24,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }}>
      <div style={{ background: "#F3F7EE", borderRadius: "16px", padding: "22px", width: "300px", maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ fontFamily: "Cinzel, serif", fontSize: "16px", fontWeight: 700, color: "#1F3B2C", marginBottom: "14px" }}>Entwickler-Menü</div>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#1F3B2C", marginBottom: "12px", cursor: "pointer" }}>
          <input type="checkbox" checked={raidsPaused} onChange={(e) => setRaidsPaused(e.target.checked)} /> Angriffe pausieren
        </label>
        <div style={{ fontSize: "12px", color: "#1F3B2C", marginBottom: "4px" }}>Angriffsintervall (Sekunden)</div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
          <input type="number" value={raidMin} min={5} onChange={(e) => setRaidMin(Number(e.target.value))} style={inputStyle} />
          <input type="number" value={raidMax} min={5} onChange={(e) => setRaidMax(Number(e.target.value))} style={inputStyle} />
        </div>
        <button className="kw-btn" onClick={onTriggerRaidNow} style={{ ...menuBtnStyle, marginBottom: "8px" }}>Angriff jetzt auslösen</button>

        <div style={{ fontSize: "12px", color: "#1F3B2C", margin: "14px 0 4px", fontWeight: 700 }}>Zonen &amp; Truppen</div>
        <button className="kw-btn" onClick={onUnlockNextZone} style={{ ...menuBtnStyle, marginBottom: "8px" }}>Nächste Zone freischalten</button>
        <div style={{ fontSize: "12px", color: "#1F3B2C", marginBottom: "4px" }}>Truppenpool setzen</div>
        <input type="number" value={troopPool} onChange={(e) => setTroopPool(Number(e.target.value))} style={{ ...inputStyle, marginBottom: "12px" }} />

        <div style={{ fontSize: "12px", color: "#1F3B2C", margin: "4px 0 4px", fontWeight: 700 }}>Welt</div>
        <button className="kw-btn" onClick={onNewRandomWorld} style={{ ...menuBtnStyle, marginBottom: "8px" }}>🎲 Neue Zufallswelt generieren</button>
        <button className="kw-btn" onClick={() => { localStorage.removeItem(SAVE_KEY); flash("Spielstand gelöscht."); }} style={{ ...menuBtnStyle, marginBottom: "12px" }}>Spielstand löschen</button>

        <div style={{ fontSize: "12px", color: "#1F3B2C", margin: "4px 0 4px", fontWeight: 700 }}>Ressourcen setzen</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "10px" }}>
          {Object.keys(RESOURCE_META).map((key) => (
            <input key={key} type="number" value={Math.floor(resources[key])}
              onChange={(e) => setResources((r) => ({ ...r, [key]: Number(e.target.value) }))}
              style={inputStyle} title={RESOURCE_META[key].label} placeholder={RESOURCE_META[key].label} />
          ))}
        </div>
        <div style={{ fontSize: "12px", color: "#1F3B2C", marginBottom: "4px", fontWeight: 700 }}>Bonus-Bewohner</div>
        <input type="number" value={devPopBonus} onChange={(e) => setDevPopBonus(Number(e.target.value))} style={{ ...inputStyle, marginBottom: "12px" }} />

        <button className="kw-btn" onClick={onClose} style={menuBtnStyle}>Schließen</button>
      </div>
    </div>
  );
}
