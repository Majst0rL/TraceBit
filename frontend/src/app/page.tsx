// C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\page.tsx

'use client'

import { useEffect, useState } from 'react'
import IntroSekcija from './component/intro'
import FingerprintInfo from './component/FingerprintInfo'
import { jwtDecode } from 'jwt-decode'

export default function Home() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const localToken = localStorage.getItem("tracebit_token");
    if (!localToken) {
      setEmail(null);
      return;
    }
    try {
      const decoded: { email?: string } = jwtDecode(localToken);
      setEmail(decoded.email ?? null);
    } catch {
      setEmail(null);
    }

    
  }, []);

  return (
    <div>
      {email ? (
        null
      ) : (
        <div>
          <IntroSekcija />
          <FingerprintInfo />
        </div>
      )}
    </div>
  )
}
