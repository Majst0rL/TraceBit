// C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\admin\page.tsx

'use client'

import { useEffect, useState } from 'react'
import StatsCards from './components/StatsCards'
import FingerprintTable from './components/FingerprintTable'
import { useRouter } from 'next/navigation'
import { saveAs } from 'file-saver'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts'

interface Stats {
  total_fingerprints: number
  unique_hashes: number
  anomalies: number
}

interface FingerprintEntry {
  fingerprint_hash: string
  browser_name: string
  os_name: string
  gpu_renderer: string
  screen_resolution: string
  suspicious?: boolean | string | number
  suspicious_reason?: string
  timestamp?: string
  [key: string]: string | boolean | number | undefined
}

interface AnomalyEntry {
  date: string
  anomalies: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [fingerprints, setFingerprints] = useState<FingerprintEntry[]>([])
  const [anomalyData, setAnomalyData] = useState<AnomalyEntry[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('tracebit_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    const headers = { Authorization: `Bearer ${token}` }

    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/stats`, { headers }).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/fingerprints`, { headers }).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/anomalies/month`, { headers }).then(res => res.json())
    ])
      .then(([statsData, fingerprintsData, anomalyChartData]) => {
        setStats(statsData)
        setFingerprints(fingerprintsData)
        setAnomalyData(anomalyChartData)
        setLoading(false)
      })
      .catch(() => {
        localStorage.removeItem('tracebit_token')
        router.push('/admin/login')
      })
  }, [router])

  // Export all fingerprint data to CSV
  function exportToCsv(fps: FingerprintEntry[]) {
    if (!fps.length) return
    const header = Object.keys(fps[0])
    const rows = fps.map(fp =>
      header.map(h => `"${(fp[h] ?? '').toString().replace(/"/g, '""')}"`).join(",")
    )
    const csv = [header.join(","), ...rows].join("\r\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, `tracebit_fingerprints_${new Date().toISOString().slice(0, 10)}.csv`)
  }

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {stats && <StatsCards stats={stats} />}

      {/* CSV Export Button */}
      <button
        className="mb-6 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => exportToCsv(fingerprints)}
      >
        Export all as CSV
      </button>

      {/* Suspicious Activity Chart */}
      <div className="bg-white p-4 rounded shadow mb-8 max-w-2xl">
        <h3 className="font-bold mb-4">Suspicious fingerprints (last 30 days)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={anomalyData}>
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis
              allowDecimals={false}
              domain={[0, (dataMax: number) => Math.ceil(dataMax + 1)]}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Bar dataKey="anomalies" fill="#e53e3e" />
          </BarChart>
        </ResponsiveContainer>

      </div>

      {/* Recent Fingerprints Table */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Recent fingerprints</h2>
      <FingerprintTable data={fingerprints.slice(0, 10)} />
    </main>
  )
}
