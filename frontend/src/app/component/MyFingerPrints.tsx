'use client'

import { useEffect, useState } from 'react'
import FingerprintTable from '../admin/components/FingerprintTable'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

interface FingerprintEntry {
  fingerprint_hash: string
  browser_name: string
  os_name: string
  gpu_renderer: string
  screen_resolution: string
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

    // Optionally decode token or get user id from context if available
    // For example, if token is JWT:
    // const userId = decodeJWT(token).userId

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
