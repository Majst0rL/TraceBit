//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\clientlayout.tsx

'use client';

import { useEffect, useState, useContext } from "react";
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { BACKEND_URL } from "MajstorL/lib/api";
import IntroSekcija from "./component/intro";
import FingerprintInfo from "./component/FingerprintInfo";
import UserTabs from "./component/tabs";
import MyFingerprints from "./component/MyFingerPrints";
import { TabContext } from "../context/TabContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { activeTab, setActiveTab } = useContext(TabContext);

  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const localToken = localStorage.getItem("tracebit_token");
      if (!localToken) {
        setEmail(null);
        return;
      }

      try {
        const decoded: { email?: string } = jwtDecode(localToken);
        setEmail(decoded.email ?? null);

        const response = await fetch(`${BACKEND_URL}/api/getuser`, {
          method: "GET",
          headers: { Authorization: `Bearer ${localToken}` },
        });

        if (response.ok) {
          const data = await response.json();
          setName(data.username);
          setIsAdmin(data.role === "admin");
        } else {
          setName("");
          setIsAdmin(false);
        }
      } catch {
        setName("");
        setIsAdmin(false);
      }
    };

    checkAuth();

    window.addEventListener("storageChanged", checkAuth);
    return () => {
      window.removeEventListener("storageChanged", checkAuth);
    };
  }, []);

  const isHome = pathname === "/";

  // ========== USER LAYOUT ==========
  const renderUserView = () => (
    <>
      {email && (
        <div style={{ paddingTop: "4rem" }}>
          <UserTabs />

          {activeTab === "newFingerprint" && (
            <div>
              <div className="flex flex-col justify-center items-center text-center">
                <div className="text-4xl font-bold mb-4 text-black">Welcome {name}</div>
              </div>
              <IntroSekcija />
              <FingerprintInfo />
            </div>
          )}

          {activeTab === "history" && (
            <MyFingerprints />
          )}
        </div>
      )}

      <main className="flex-grow mt-16">{children}</main>
    </>
  );

  return (
    <>
      {!isAdmin ? renderUserView() : (
        <main className="flex-grow mt-16">{children}</main>
      )}
    </>
  );
}
