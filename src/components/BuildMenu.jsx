import { X } from "lucide-react";
import { BUILDING_TYPES, TOOLS, RESOURCE_META, canAfford } from "../gameData";
import { COLORS } from "../styles";

// Grouping the build menu by purpose (instead of one long undifferentiated
// row) makes it scannable at a glance — presentation-only metadata, doesn't
// touch gameData.js or any building stats.
const CATEGORIES = [
  { label: "Rohstoffe & Handel", keys: ["holzfaeller", "steinbruch", "bauernhof", "markt", "lager"] },
  { label: "Wohnen", keys: ["haus"] },
  { label: "Verteidigung", keys: ["kaserne", "wachposten", "mauer"] },
  { label: "Sonstiges", keys: ["schmiede", "bruecke", "tool_pflanzen"] },
];

function defFor(key) { return BUILDING_TYPES[key] || TOOLS[key]; }
function isTool(key) { return key in TOOLS; }

function BuildButton({ keyName, def, selected, affordable, onClick }) {
  const Icon = def.icon;
  const tool = isTool(keyName);
  return (
    <button className="kw-btn" onClick={onClick}
      style={{
        flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
        padding: "8px 10px", borderRadius: "10px",
        border: selected ? `2px solid ${COLORS.ink}` : tool ? "2px dashed #5C6B5A" : "2px solid transparent",
        background: selected ? "#DCE9D2" : COLORS.panel,
        boxShadow: selected ? "0 0 0 2px rgba(31,59,44,0.15)" : "none",
        cursor: "pointer", opacity: affordable ? 1 : 0.5, minWidth: "78px",
      }}>
      <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: def.color, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={14} color="#F3F7EE" /></div>
      <div style={{ fontSize: "10.5px", fontWeight: 700, color: COLORS.ink, textAlign: "center" }}>{def.name}</div>
      <div style={{ fontSize: "9.5px", color: COLORS.inkMuted, textAlign: "center" }}>{Object.entries(def.cost).map(([k, v]) => `${v} ${RESOURCE_META[k].label}`).join(", ") || "kostenlos"}</div>
    </button>
  );
}

export default function BuildMenu({ resources, selectedType, setSelectedType }) {
  return (
    <div>
      <div style={{ fontSize: "11px", fontWeight: 600, color: COLORS.ink, margin: "10px 0 8px", opacity: 0.8 }}>
        Ziehen zum Verschieben, Scrollen zum Zoomen · Bäume direkt antippen zum Fällen · im Fluss nach Gold suchen · Escape = Menü
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {CATEGORIES.map((cat) => (
          <div key={cat.label}>
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: COLORS.inkMuted, marginBottom: "5px" }}>{cat.label}</div>
            <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
              {cat.keys.map((key) => {
                const def = defFor(key);
                if (!def) return null;
                const selected = selectedType === key;
                const affordable = canAfford(resources, def.cost);
                return (
                  <BuildButton key={key} keyName={key} def={def} selected={selected} affordable={affordable}
                    onClick={() => setSelectedType(selected ? null : key)} />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {selectedType && (
        <button onClick={() => setSelectedType(null)} style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", borderRadius: "8px", border: "none", background: "rgba(37,68,51,0.18)", color: COLORS.ink, fontWeight: 600, fontSize: "12px", cursor: "pointer" }}>
          <X size={13} /> Auswahl aufheben
        </button>
      )}
    </div>
  );
}
