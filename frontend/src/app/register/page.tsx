//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\register\page.tsx

'use client'

import { useState } from 'react'
import TwoFAQRCode from '../component/TwoFAQRCode'


export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async () => {
    setError('')
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        password_confirm: confirmPassword,
        full_name: fullName,
        username
      })
    })

    const data = await res.json()
    if (res.ok) {
      setSuccess(true)
    } else {
      setError(data.detail || 'Registration failed.')
    }
  }

  return (
    <main className="flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      {!success ? (
        <div className="max-w-md w-full space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />

          {error && <p className="text-red-600">{error}</p>}

          <button
            onClick={handleRegister}
            className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
          >
            Register
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-green-600 font-semibold mb-2">Registration successful!</h2>
          <p className="mb-4">Scan the QR code below to set up your 2FA before logging in.</p>
          <TwoFAQRCode email={email} />
        </div>
      )}
    </main>
  )
}
