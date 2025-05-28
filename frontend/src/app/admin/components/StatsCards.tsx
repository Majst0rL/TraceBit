//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\admin\components\StatsCards.tsx

'use client'
import { useEffect, useState } from 'react'

export default function StatsCards({ stats }: { stats: any }) {
  const cardStyle = "p-4 bg-white rounded shadow text-center";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className={cardStyle}>
        <p className="text-gray-600">Skupno fingerprintov</p>
        <p className="text-2xl font-bold">{stats.total_fingerprints}</p>
      </div>
      <div className={cardStyle}>
        <p className="text-gray-600">Unikatni hash-i</p>
        <p className="text-2xl font-bold">{stats.unique_hashes}</p>
      </div>
      <div className={cardStyle}>
        <p className="text-gray-600">Zaznane anomalije</p>
        <p className="text-2xl font-bold">{stats.anomalies}</p>
      </div>
    </div>
  )
}
