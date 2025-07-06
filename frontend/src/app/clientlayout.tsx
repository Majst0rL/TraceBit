'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { BACKEND_URL } from "MajstorL/lib/api";
import IntroSekcija from "./component/intro";
import FingerprintInfo from "./component/FingerprintInfo";
import UserTabs from "./component/tabs";
import MyFingerprints from "./component/MyFingerPrints";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("newFingerprint");
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const pathname = usePathname(); // 👈 get current route
  const [isAdmin, setIsAdmin] = useState<string | null>("user");

  useEffect(() => {
    const checkAuth = () => {
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

      async function getUser() {
        try {
        const response = await fetch(`${BACKEND_URL}/api/getuser`, {
            method: "GET",
            headers: {
            Authorization: `Bearer ${localToken}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            setName(data.username);
            setIsAdmin(data.role);
        } else {
            setName("");
        }
        } catch {
        setName("");
        }
    }

    getUser();
    };

    checkAuth();

    window.addEventListener("storageChanged", checkAuth);
    return () => {
      window.removeEventListener("storageChanged", checkAuth);
    };
  }, []);

  const isHome = pathname === "/"; // 👈 check if you're on the home page

  return (
    <>
    {isAdmin !== "admin" ? (
        <>
            {email ? (
                <div style={{ paddingTop: "4rem" }}>
                <UserTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                {activeTab === "newFingerprint" && (
                    <>
                        {isHome ? (<div>
                            <div className="flex flex-col justify-center items-center text-center">
                                <div className="text-4xl font-bold mb-4 text-black">Welcome {name}</div>
                            </div>
                            <IntroSekcija />
                            <FingerprintInfo />
                            </div>
                        ) : null}
                    </>
                )}
                {activeTab === "history" && (isHome ? <MyFingerprints /> : null)}
                </div>
            ) : null}
            <main className="flex-grow mt-16">{children}</main>
        </>
    ) : (<main className="flex-grow mt-16">{children}</main>)}
    </>
  );
}
