'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BACKEND_URL } from '../../../lib/api'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    setError('')

    try {
      const res = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('tracebit_token', data.access_token)
        router.push('/admin')
      } else {
        setError(data.detail || 'Napaka pri prijavi')
      }
    } catch {
      setError('Napaka v omrežju ali strežniku')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="bg-white p-8 shadow rounded w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Admin Prijava</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Geslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        >
          Prijava
        </button>
      </div>
    </main>
  )
}
