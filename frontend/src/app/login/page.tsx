//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\login\page.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BACKEND_URL } from '../../lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [twofaCode, setTwofaCode] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    setError('')
    
    try {

      const res = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, twofa_code: twofaCode }),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('tracebit_token', data.access_token)

        if (data.role === 'admin') {
          router.push('/admin')
        } else {
          window.dispatchEvent(new Event("storageChanged"));
          router.push('/')
        }
      } else {
        if (typeof data.detail === 'string') {
          setError(data.detail)
        } else if (Array.isArray(data.detail) && data.detail[0]?.msg) {
          setError(data.detail[0].msg)
        } else if (typeof data.detail === 'object' && data.detail?.msg) {
          setError(data.detail.msg)
        } else {
          setError('Login failed.')
        }
      }

    } catch {
      setError('Network or server error.')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 shadow rounded w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />

        <input
          type="text"
          placeholder="2FA code"
          value={twofaCode}
          onChange={(e) => setTwofaCode(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <div className="flex justify-between mb-2">
          <button
            onClick={() => router.push('/register')}
            className="text-indigo-600 hover:underline"
          >
            Register
          </button>

          <button
            onClick={handleLogin}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Login
          </button>
        </div>

        <div className="text-center mt-4">
          <a
            href="/forgot-password"
            className="text-sm text-gray-600 hover:underline"
          >
            Forgot password?
          </a>
        </div>
      </div>
    </main>
  )
}
