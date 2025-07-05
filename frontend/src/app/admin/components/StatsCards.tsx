//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\admin\components\StatsCards.tsx

interface Stats {
  total_fingerprints: number;
  unique_hashes: number;
  anomalies: number;
}

export default function StatsCards({ stats }: { stats: Stats }) {
  const cardStyle = "p-4 bg-white rounded shadow text-center";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className={cardStyle}>
        <p className="text-gray-600">Total fingerprints</p>
        <p className="text-2xl font-bold">{stats.total_fingerprints}</p>
      </div>
      <div className={cardStyle}>
        <p className="text-gray-600">Unique hashes</p>
        <p className="text-2xl font-bold">{stats.unique_hashes}</p>
      </div>
      <div className={cardStyle}>
        <p className="text-gray-600">Detected anomalies</p>
        <p className="text-2xl font-bold">{stats.anomalies}</p>
      </div>
    </div>
  )
}
