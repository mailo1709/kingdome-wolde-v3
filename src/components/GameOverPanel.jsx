import { Skull, RotateCcw } from "lucide-react";

export default function GameOverPanel({ onRestart }) {
  return (
    <div style={{ background: "#F3F7EE", borderRadius: "16px", padding: "26px 20px", textAlign: "center" }}>
      <Skull size={30} color="#7A2E2E" style={{ marginBottom: "10px" }} />
      <div style={{ fontFamily: "Cinzel, serif", fontSize: "20px", fontWeight: 700, color: "#1F3B2C", marginBottom: "8px" }}>Deine Stadt ist gefallen</div>
      <div style={{ fontSize: "14px", color: "#3A3630", marginBottom: "18px" }}>Zu viele unbeantwortete Angriffe haben eure Vorräte aufgezehrt.</div>
      <button className="kw-btn" onClick={onRestart} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "10px", border: "none", background: "#254433", color: "#F3F7EE", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>
        <RotateCcw size={16} /> Neu beginnen
      </button>
    </div>
  );
}
