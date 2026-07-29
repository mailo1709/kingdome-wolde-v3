import { Landmark, Hammer, ScrollText } from "lucide-react";

const TABS = [
  { id: "basis", label: "Basis", icon: Landmark },
  { id: "schmiede", label: "Schmiede", icon: Hammer },
  { id: "ereignisse", label: "Ereignisse", icon: ScrollText },
];

export default function Tabs({ tab, setTab }) {
  return (
    <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
      {TABS.map((t) => {
        const Icon = t.icon; const active = tab === t.id;
        return (
          <button key={t.id} className="kw-btn" onClick={() => setTab(t.id)} style={{ flex: 1, minHeight: "44px", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", borderRadius: "8px", border: "none", cursor: "pointer", background: active ? "#3E6B4A" : "rgba(37,68,51,0.18)", color: active ? "#F3F7EE" : "#254433", fontWeight: 600, fontSize: "13px" }}>
            <Icon size={14} /> {t.label}
          </button>
        );
      })}
    </div>
  );
}
