//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\forgot-password\page.tsx

'use client'

import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

  const handleSendCode = async () => {
    setError('')
    try {
      const res = await fetch(`${BACKEND}/api/reset-password/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to send code')
      setMessage('Code sent to your email.')
      setStep(2)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleVerifyCode = async () => {
    setError('')
    try {
      const res = await fetch(`${BACKEND}/api/reset-password/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Invalid code')
      setMessage('Code verified. Please enter your new password.')
      setStep(3)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleResetPassword = async () => {
    setError('')
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    try {
      const res = await fetch(`${BACKEND}/api/reset-password/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, new_password: newPassword })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to reset password')
      setMessage('Password successfully reset. You can now log in.')
      setStep(4)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>

        {message && <p className="text-green-600 mb-2">{message}</p>}
        {error && <p className="text-red-600 mb-2">{error}</p>}

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />
            <button
              onClick={handleSendCode}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Send code
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />
            <button
              onClick={handleVerifyCode}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Verify code
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />
            <button
              onClick={handleResetPassword}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Reset password
            </button>
          </>
        )}

        {step === 4 && (
          <div className="text-center">
            <p>Password reset successful.</p>
            <a href="/login" className="text-blue-600 underline mt-2 inline-block">
              Back to login
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
