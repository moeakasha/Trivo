import { TravelStats } from "../../../core/types/travel";

interface Props { stats: TravelStats; }

const StatsCard: React.FC<Props> = ({ stats }) => (
  <div className="stats-row">
    {(Object.entries(stats) as [keyof TravelStats, number][]).map(([label, value]) => (
      <div key={label} className="stat-item">
        <span className="stat-label">{label.charAt(0).toUpperCase() + label.slice(1)}</span>
        <span className="stat-value">{value}</span>
      </div>
    ))}
  </div>
);

export default StatsCard;
