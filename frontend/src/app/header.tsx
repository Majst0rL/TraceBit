//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\header.tsx

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('tracebit_token')
    if (token) {
      try {
        const decoded: { email?: string } = jwtDecode(token)
        setEmail(decoded.email ?? null)
      } catch {
        setEmail(null)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('tracebit_token')
    window.location.href = '/'
  }

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-sm bg-gray-800">
      <div className="font-bold text-lg text-white">
        <Link href="/">TraceBit</Link>
      </div>
      <div className="space-x-6 flex items-center">
        <Link href="/podatki" className="text-blue-400">Data</Link>
        {email ? (
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm hidden md:inline">{email}</span>
            <button onClick={handleLogout} className="text-red-400 text-sm">Logout</button>
            <span className="text-white text-xl">👤</span>
          </div>
        ) : (
          <Link href="/login" className="text-blue-400">Login</Link>
        )}
      </div>
    </nav>
  )
}
