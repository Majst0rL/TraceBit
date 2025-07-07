//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\header.tsx

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { BACKEND_URL } from 'MajstorL/lib/api'
import { User } from 'lucide-react'

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState<string | null>('user')
  const [tok, setTok] = useState<string | null>(null)

  useEffect(() => {
    function updateAuth() {
      const localToken = localStorage.getItem('tracebit_token')

      if (!localToken) {
        setEmail(null)
        return
      }

      setTok(localToken)
      try {
        const decoded: { email?: string } = jwtDecode(localToken)
        setEmail(decoded.email ?? null)
      } catch {
        setEmail(null)
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
            setName(data.username)
            setIsAdmin(data.role)
          } else {
            setName('')
          }
        } catch {
          setName('')
        }
      }

      getUser()
    }

    updateAuth()
    window.addEventListener('storageChanged', updateAuth)
    return () => window.removeEventListener('storageChanged', updateAuth)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('tracebit_token')
    window.location.href = '/'
  }

  return (
    <nav className="fixed top-0 w-full flex justify-between items-center px-6 py-4 shadow-sm bg-gray-800 z-50">
      {isAdmin === 'admin' ? (
        <div className="font-bold text-lg text-white">TraceBit</div>
      ) : (
        <div className="font-bold text-lg text-white">
          {tok ? (
            <Link href="/user" className="hover:text-blue-400">
              TraceBit
            </Link>
          ) : (
            <Link href="/">TraceBit</Link>
          )}
        </div>
      )}

      <div className="space-x-6 flex items-center relative z-50">
        {isAdmin !== 'admin' && (
          <Link href="/podatki" className="text-blue-400">
            Data
          </Link>
        )}
        {email ? (
          <div className="flex items-center space-x-2 relative">
            <span className="text-white text-sm hidden md:inline">{name}</span>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 hover:shadow-lg text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              aria-haspopup="true"
              aria-expanded={open ? 'true' : 'false'}
            >
              <User className="w-4 h-4" />
            </button>

            {open && (
              <div className="absolute right-0 top-10 w-56 bg-gray-800 rounded-lg shadow-xl text-white z-50 border border-gray-700">
                <Link
                  href="/AccountDetails"
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 hover:text-blue-400 transition-colors duration-200 rounded-t-lg"
                >
                  Account
                </Link>
                <button
                  onClick={() => {
                    setOpen(false)
                    handleLogout()
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white transition-colors duration-200 rounded-b-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="text-blue-400">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}