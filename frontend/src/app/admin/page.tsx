// C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\admin\page.tsx

'use client'

import { useEffect, useState } from 'react'
import StatsCards from './components/StatsCards'
import FingerprintTable from './components/FingerprintTable'
import { useRouter } from 'next/navigation'

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
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [fingerprints, setFingerprints] = useState<FingerprintEntry[]>([])
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
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/fingerprints`, { headers }).then(res => res.json())
    ])
      .then(([statsData, fingerprintsData]) => {
        setStats(statsData)
        setFingerprints(fingerprintsData)
        setLoading(false)
      })
      .catch(() => {
        localStorage.removeItem('tracebit_token')
        router.push('/admin/login')
      })
  }, [router]) // ✅ fix: include router as dependency

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {stats && <StatsCards stats={stats} />}
      <h2 className="text-xl font-semibold mt-10 mb-4">Recent fingerprints</h2>
      <FingerprintTable data={fingerprints} />
    </main>
  )
}
