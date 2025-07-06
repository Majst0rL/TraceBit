// C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\AccountDetails\page.tsx

'use client'

import { jwtDecode } from 'jwt-decode'
import { BACKEND_URL } from 'MajstorL/lib/api'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface UserProfile {
  full_name: string
  username: string
  autosend: boolean
}

type Message = {
  type: 'success' | 'error'
  text: string
}

export default function AccountDetailsPage() {
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    username: '',
    autosend: false,
  })
  const [email, setEmail] = useState<string | null>(null)
  const [original, setOriginal] = useState<UserProfile>({
    full_name: '',
    username: '',
    autosend: false,
  })
  const [passwords, setPasswords] = useState({
    old: '',
    new: '',
    confirm: '',
  })
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState<Message | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('tracebit_token')
    if (!token) return

    try {
      const decoded = jwtDecode<{ email?: string }>(token)
      setEmail(decoded.email ?? null)
    } catch {
      setEmail(null)
    }

    fetchUser(token)
  }, [])

  async function fetchUser(token: string) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/getuser`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        const prof = {
          full_name: data.full_name ?? '',
          username: data.username ?? '',
          autosend: !!data.autosend,
        }
        setProfile(prof)
        setOriginal(prof)
      }
    } catch {
      // Error ignored for fallback
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value, type, checked } = e.target
    if (['full_name', 'username'].includes(id)) {
      setProfile((prev) => ({ ...prev, [id]: value }))
    }
    if (id === 'autosend') {
      if (!checked) setProfile((prev) => ({ ...prev, autosend: false }))
      else setShowModal(true)
    }
    if (id === 'oldPassword') setPasswords((prev) => ({ ...prev, old: value }))
    if (id === 'password') setPasswords((prev) => ({ ...prev, new: value }))
    if (id === 'confirmPassword') setPasswords((prev) => ({ ...prev, confirm: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    const token = localStorage.getItem('tracebit_token')
    if (!token) return

    // Update full name
    if (profile.full_name !== original.full_name) {
      if (!profile.full_name || profile.full_name.length < 3 || profile.full_name.length > 50) {
        return setMessage({ type: 'error', text: 'Name must be between 3 and 50 characters.' })
      }
      await updateField('/api/update-name', { full_name: profile.full_name }, token, 'Name updated!')
    }

    // Update username
    if (profile.username !== original.username) {
      if (!profile.username || profile.username.length < 3 || profile.username.length > 50) {
        return setMessage({ type: 'error', text: 'Username must be between 3 and 50 characters.' })
      }
      await updateField('/api/update-username', { username: profile.username }, token, 'Username updated!')
    }

    // Update password
    if (passwords.new || passwords.confirm) {
      if (!passwords.old) return setMessage({ type: 'error', text: 'Old password required.' })
      if (passwords.new !== passwords.confirm) return setMessage({ type: 'error', text: 'Passwords do not match.' })
      if (passwords.new.length < 8) return setMessage({ type: 'error', text: 'Password must be at least 8 characters.' })

      await updateField(
        '/api/update-password',
        { password: passwords.new, old_password: passwords.old },
        token,
        'Password updated!'
      )
      setPasswords({ old: '', new: '', confirm: '' })
    }

    setMessage({ type: 'success', text: 'Profile updated successfully!' })
    setOriginal(profile)
  }

  async function updateField(
    url: string,
    body: Record<string, unknown>,
    token: string,
    successMsg: string
  ) {
    try {
      const res = await fetch(`${BACKEND_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const error = await res.json()
        setMessage({ type: 'error', text: error.detail || 'Update failed.' })
        return false
      }
      setMessage({ type: 'success', text: successMsg })
      return true
    } catch {
      setMessage({ type: 'error', text: 'Network error.' })
      return false
    }
  }

  async function handleAutoSend(autosend: boolean) {
    const token = localStorage.getItem('tracebit_token')
    if (!token) return
    await updateField('/api/autosend', { autosend }, token, autosend ? 'Auto-send enabled!' : 'Auto-send disabled.')
    setProfile((prev) => ({ ...prev, autosend }))
    setShowModal(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <div className="border border-gray-300 rounded-xl p-6 shadow-sm bg-white">
        <h1 className="text-3xl font-bold mb-6">Account Details</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-4">
            <label className="block text-lg font-semibold mb-1 w-32">Email</label>
            <input
              type="email"
              value={email ?? ''}
              readOnly
              className="flex-grow border border-gray-300 rounded p-2 bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="block text-lg font-semibold mb-1 w-32" htmlFor="full_name">
              Name
            </label>
            <input
              id="full_name"
              type="text"
              value={profile.full_name}
              onChange={handleChange}
              required
              className="flex-grow border border-gray-300 rounded p-2"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="block text-lg font-semibold mb-1 w-32" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={profile.username}
              onChange={handleChange}
              required
              className="flex-grow border border-gray-300 rounded p-2"
            />
          </div>

          <fieldset className="border border-gray-300 rounded p-4">
            <legend className="text-lg font-semibold mb-4">Change Password</legend>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="oldPassword">
                Old Password
              </label>
              <input
                id="oldPassword"
                type="password"
                value={passwords.old}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Enter your current password"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="password">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={passwords.new}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Leave empty to keep current password"
              />
            </div>
            <div>
              <label className="block mb-1" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={passwords.confirm}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Repeat new password"
              />
            </div>
          </fieldset>

          {message && (
            <p className={`text-sm mt-2 ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
              {message.text}
            </p>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Fingerprint Auto-send Toggle */}
      <div className="border border-gray-300 rounded-xl p-6 shadow-sm bg-white">
        <h2 className="text-2xl font-bold mb-4">Fingerprint</h2>
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Send data to server automatically</span>
          <label className="switch relative inline-block w-11 h-6 cursor-pointer">
            <input
              id="autosend"
              type="checkbox"
              checked={profile.autosend}
              onChange={(e) => {
                if (e.target.checked) setShowModal(true)
                else handleAutoSend(false)
              }}
              className="opacity-0 w-0 h-0 peer"
            />
            <span className="slider absolute left-0 top-0 right-0 bottom-0 bg-gray-300 rounded-full transition-colors duration-300 peer-checked:bg-blue-600" />
            <span className="slider-knob absolute left-1 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5" />
          </label>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-left">
            <h3 className="text-lg font-semibold mb-4">Confirm Automatic Data Sending</h3>
            <p className="mb-4">
              By enabling this option, your fingerprint data will <strong>always</strong> be sent automatically to the server. Please review our{' '}
              <Link href="/pages/terms_and_conditions" className="text-blue-600 underline">terms and conditions</Link>{' '}
              before confirming.
            </p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button
                onClick={() => handleAutoSend(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Confirm & Enable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
