//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\page.tsx

'use client'

import { BACKEND_URL } from 'MajstorL/lib/api';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const localToken = localStorage.getItem('tracebit_token')

    if (!localToken) {
      setLoading(false)
      return
    }

    async function getUser() {
      try {
        const response = await fetch(`${BACKEND_URL}/api/getuser`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localToken}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.role === 'admin') {
            router.push('/admin')
          } else {
            router.push('/user')
          }
        } else {
          // token invalid or no user found - just stop loading and stay on page
          setLoading(false)
        }
      } catch {
        setLoading(false)
      }
    }

    getUser()
  }, [router])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <section className="text-center py-10 pt-24" style={{ backgroundColor: '#ededed' }}>
        <h1 className="text-4xl font-bold mb-4 text-black">Reveal your digital footprint</h1>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Discover the unique fingerprint your browser leaves behind and understand its impact on your online privacy.
        </p>
        <button
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
          onClick={() => router.push('/podatki')}
        >
          Analyze your fingerprint
        </button>
      </section>

      <h2 className="text-2xl font-bold mt-10 mb-4 text-center">
        Understanding browser fingerprinting
      </h2>

      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        <div className="bg-white rounded p-6 shadow-sm w-96">
          <strong>What is a browser fingerprint?</strong>
          <p>
            A browser fingerprint is a unique profile collected about your device and browser that is used to track your online activity across different websites.
          </p>
        </div>
        <div className="bg-white rounded p-6 shadow-sm w-96">
          <strong>How it works</strong>
          <p>
            It combines data from your browser settings, plugins, screen resolution, fonts, and other configurations to create a unique identification tag.
          </p>
        </div>
        <div className="bg-white rounded p-6 shadow-sm w-96">
          <strong>Why it matters</strong>
          <p>
            A fingerprint can be used for targeted advertising, security purposes, or to link your activity even if you delete cookies.
          </p>
        </div>
      </div>
    </div>
  );
}
