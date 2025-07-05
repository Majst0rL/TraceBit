//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\page.tsx

'use client'

import { useState } from 'react'
import IntroSekcija from './component/intro'
import FingerprintInfo from './component/FingerprintInfo'

interface FingerprintResponse {
  hash: string
  timestamp: string
}

export default function Home() {
  const [status, setStatus] = useState<string>('')
  const [data, setData] = useState<FingerprintResponse | null>(null)

  const handleSend = async () => {
    setStatus('Pošiljam podatke...')

    const fingerprintData = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth
      }
    }

    try {
      const res = await fetch('http://localhost:8000/api/fingerprint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fingerprintData)
      })

      const result: FingerprintResponse = await res.json()
      setData(result)
      setStatus('Podatki uspešno poslani!')
    } catch (error) {
      console.error('Napaka pri pošiljanju:', error)
      setStatus('Napaka pri pošiljanju.')
    }
  }

  return (
    <div>
      <IntroSekcija />
      <FingerprintInfo />

      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-6">TraceBit – Zbiranje Fingerprint podatkov</h1>
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Pošlji podatke
        </button>
        <p className="mt-4 text-lg">{status}</p>
        {data && (
          <pre className="mt-6 p-4 bg-gray-100 rounded max-w-xl w-full text-sm overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </main>
    </div>
  )
}
