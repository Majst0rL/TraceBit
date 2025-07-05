//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\component\TwoFAQRCode.tsx

'use client'

interface TwoFAQRCodeProps {
  email: string
}

export default function TwoFAQRCode({ email }: TwoFAQRCodeProps) {
  if (!email) return null

  const handleRedirect = () => {
    window.location.href = '/login'
  }

  return (
    <div className="flex flex-col items-center mt-4">
      <p className="text-gray-700 mb-2">Scan this QR code with Google Authenticator:</p>
      <img
        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/2fa/qr?email=${encodeURIComponent(email)}`}
        alt="2FA QR Code"
        className="w-48 h-48"
      />
      <button
        onClick={handleRedirect}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Proceed to Login
      </button>
    </div>
  )
}
