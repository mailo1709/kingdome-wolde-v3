import ProgressBar from "./ProgressBar";
import { CRAFTS, RESOURCE_META, canAfford } from "../gameData";

export default function CraftingPanel({ hasSchmiede, inventory, crafts, resources, onStartCraft }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {!hasSchmiede ? (
        <div style={{ fontSize: "13px", color: "#1F3B2C", background: "rgba(243,247,238,0.7)", padding: "14px", borderRadius: "8px", textAlign: "center" }}>Du brauchst zuerst eine Schmiede auf deiner Basis, um hier etwas herzustellen.</div>
      ) : (
        <>
          <div style={{ display: "flex", gap: "8px" }}>
            {Object.entries(inventory).map(([k, v]) => {
              const def = CRAFTS.find((c) => c.id === k);
              return (
                <div key={k} style={{ flex: 1, background: "rgba(243,247,238,0.7)", borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#5C6B5A" }}>{def.name}</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#1F3B2C" }}>{v}</div>
                </div>
              );
            })}
          </div>
          {CRAFTS.map((craft) => {
            const active = crafts.find((c) => c.id === craft.id);
            const affordable = canAfford(resources, craft.cost);
            return (
              <div key={craft.id} style={{ background: "#F3F7EE", borderRadius: "10px", padding: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "#1F3B2C", fontSize: "14px" }}>{craft.name}</div>
                    <div style={{ fontSize: "12px", color: "#5C6B5A" }}>Kosten: {Object.entries(craft.cost).map(([k, v]) => `${v} ${RESOURCE_META[k].label}`).join(", ")} · {craft.time}s</div>
                  </div>
                  <button className="kw-btn" onClick={() => onStartCraft(craft)} disabled={!!active || !affordable}
                    style={{ padding: "8px 14px", borderRadius: "8px", border: "none", fontWeight: 600, fontSize: "13px", background: active ? "#8C8375" : "#4A4A48", color: "#F3F7EE", cursor: active || !affordable ? "default" : "pointer" }}>
                    {active ? `${active.remaining}s` : "Schmieden"}
                  </button>
                </div>
                {active && <div style={{ marginTop: "8px" }}><ProgressBar pct={100 - (active.remaining / active.total) * 100} color="#4A4A48" /></div>}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
