import { RESOURCE_META } from "../gameData";

export default function ResourceBar({ resources, cap }) {
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {Object.entries(RESOURCE_META).map(([key, meta]) => {
        const Icon = meta.icon;
        const val = Math.floor(resources[key] || 0);
        const atCap = val >= cap;
        return (
          <div key={key} title={`${meta.label}: ${val} / ${cap}`} style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.1)", padding: "6px 10px", borderRadius: "8px", minWidth: "64px" }}>
            <Icon size={14} color={meta.color} />
            <span style={{ color: atCap ? "#E8A57C" : "#F3F7EE", fontWeight: 600, fontSize: "12px" }}>{val}</span>
          </div>
        );
      })}
    </div>
  );
}
