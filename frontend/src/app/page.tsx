// C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\page.tsx

'use client'

import { useEffect, useState } from 'react'
import IntroSekcija from './component/intro'
import FingerprintInfo from './component/FingerprintInfo'
import { jwtDecode } from 'jwt-decode'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const localToken = localStorage.getItem("tracebit_token");
    if (!localToken) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const decoded: { email?: string } = jwtDecode(localToken);
      setIsLoggedIn(!!decoded.email);
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  if (isLoggedIn) {
    return null; // Prijavljeni uporabnik ne vidi nič tukaj
  }

  return (
    <div className="px-4">
      <IntroSekcija />
      <FingerprintInfo />
    </div>
  );
}

