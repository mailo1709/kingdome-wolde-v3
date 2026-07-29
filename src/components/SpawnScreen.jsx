import { REGIONS, GLOBAL_STYLES } from "../gameData";

export default function SpawnScreen({ onPick, savedGame, onContinue }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #BFE3D6 0%, #8FBFA8 45%, #4C8C6B 100%)", padding: "24px", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ maxWidth: "420px", width: "100%", background: "#F3F7EE", borderRadius: "16px", padding: "26px 22px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
        {savedGame && (
          <>
            <button className="kw-btn" onClick={onContinue} style={{ width: "100%", padding: "14px 8px", borderRadius: "10px", border: "none", background: "#254433", color: "#F3F7EE", fontWeight: 700, fontSize: "14px", cursor: "pointer", marginBottom: "10px" }}>
              Fortsetzen
            </button>
            <div style={{ fontSize: "11.5px", color: "#5C6B5A", marginBottom: "18px" }}>Ein gespeichertes Reich wurde gefunden. Oder starte neu:</div>
          </>
        )}
        <div style={{ fontFamily: "Cinzel, serif", fontSize: "22px", fontWeight: 700, color: "#1F3B2C", marginBottom: "8px" }}>Wähle deinen Startort</div>
        <div style={{ fontSize: "12.5px", color: "#5C6B5A", marginBottom: "18px" }}>Jede Kultur bringt einen eigenen kleinen Bonus mit.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {Object.entries(REGIONS).map(([key, r]) => (
            <button key={key} className="kw-btn" title={r.bonusLabel} onClick={() => onPick(key)} style={{ padding: "12px 8px", borderRadius: "10px", border: "none", background: r.palette.grass, color: "#1F3B2C", cursor: "pointer", display: "flex", flexDirection: "column", gap: "3px" }}>
              <span style={{ fontWeight: 700, fontSize: "13px" }}>{r.name}</span>
              <span style={{ fontSize: "9.5px", fontWeight: 500, lineHeight: 1.3, opacity: 0.85 }}>{r.bonusLabel}</span>
            </button>
          ))}
          <button className="kw-btn" onClick={() => onPick(Object.keys(REGIONS)[Math.floor(Math.random() * Object.keys(REGIONS).length)])}
            style={{ gridColumn: "1 / -1", padding: "12px", borderRadius: "10px", border: "2px dashed #1F3B2C", background: "transparent", color: "#1F3B2C", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>🎲 Zufällig</button>
        </div>
      </div>
    </div>
  );
}
