//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\clientlayout.tsx

'use client';

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { BACKEND_URL } from "MajstorL/lib/api";
import { usePathname } from "next/navigation";
import UserTabs from "./component/tabs";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
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
  }, []);

  const isUserPath = pathname?.startsWith("/user");

  return (
    <>
      {isLoggedIn && isUserPath && (
        <div style={{ paddingTop: "4rem" }}>
          <UserTabs />
        </div>
      )}
      <main className="flex-grow mt-16">
        {children}
      </main>
    </>
  );
}
