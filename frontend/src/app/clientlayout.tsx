//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\clientlayout.tsx

'use client';

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { usePathname } from "next/navigation";
import UserTabs from "./component/tabs";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    function updateAuth() {
      const token = localStorage.getItem("tracebit_token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        const decoded = jwtDecode<{ email?: string }>(token);
        if (decoded?.email) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    }
    updateAuth()
      window.addEventListener('storageChanged', updateAuth)
      return () => window.removeEventListener('storageChanged', updateAuth)
  }, []);


  const isUserPath = pathname?.startsWith("/user") || pathname?.startsWith("/podatki");

  return (
    <>
      {isLoggedIn && isUserPath && (
        <div style={{ paddingTop: "6rem" }}>
          <UserTabs />
        </div>
      )}
      <main className="flex-grow">
        {children}
      </main>
    </>
  );
}
