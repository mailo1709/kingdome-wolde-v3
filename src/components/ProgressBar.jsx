export default function ProgressBar({ pct, color }) {
  return (
    <div style={{ width: "100%", height: "5px", background: "rgba(0,0,0,0.18)", borderRadius: "4px", overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, transition: "width 1s linear" }} />
    </div>
  );
}
