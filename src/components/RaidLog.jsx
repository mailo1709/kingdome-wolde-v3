export default function RaidLog({ raidLog }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ fontSize: "12px", color: "#1F3B2C", background: "rgba(243,247,238,0.7)", padding: "10px", borderRadius: "8px" }}>
        Angriffs-Log. Hinweis: Verluste an Dorfbewohnern werden aktuell nicht simuliert, nur Ressourcenschaden.
      </div>
      {raidLog.length === 0 && <div style={{ fontSize: "13px", color: "#5C6B5A", padding: "10px" }}>Noch keine Angriffe erlebt.</div>}
      {raidLog.map((e) => (
        <div key={e.id} style={{ background: "#F3F7EE", borderRadius: "8px", padding: "9px 12px", fontSize: "12.5px", color: "#1F3B2C" }}>
          Sekunde {e.sec}: <strong>-{e.damage} Ressourcen</strong> · Mauern: {e.mauerCount} · stationierte Truppen: {e.garrisonedTotal || 0}
        </div>
      ))}
    </div>
  );
}
