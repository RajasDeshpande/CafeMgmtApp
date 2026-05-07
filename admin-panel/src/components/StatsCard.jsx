export default function StatsCard({ title, value, icon: Icon, color }) {
  return (
    <div className="stats-card">
      <div className="stats-icon" style={{ background: color + '22', color }}>
        <Icon />
      </div>
      <div className="stats-info">
        <span className="stats-value">{value}</span>
        <span className="stats-label">{title}</span>
      </div>
    </div>
  );
}
