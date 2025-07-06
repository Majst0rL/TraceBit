//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\component\MyFingerPrints.tsx

'use client'

import { useEffect, useState } from 'react'
import FingerprintTable from '../admin/components/FingerprintTable'
import { useRouter } from 'next/navigation'

interface FingerprintEntry {
  fingerprint_hash: string
  browser_name: string
  os_name: string
  gpu_renderer: string
  screen_resolution: string
  suspicious?: boolean
  suspicious_reason?: string
}

export default function MyFingerprints() {
  const [fingerprints, setFingerprints] = useState<FingerprintEntry[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('tracebit_token')
    if (!token) {
      router.push('/login')
      return
    }

    const headers = { Authorization: `Bearer ${token}` }
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fingerprints/my`, { headers })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized or fetch error');
        return res.json();
      })
      .then(data => {
        setFingerprints(data);
        setLoading(false);
      })
      .catch(() => {
        router.push('/login');
      });

  }, [router])

  if (loading) {
    return <p className="p-6">Loading your fingerprints...</p>
  }

  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Fingerprints</h1>
      <FingerprintTable data={fingerprints} />
    </section>
  )
}
