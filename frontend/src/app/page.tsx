//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\page.tsx

'use client'

import { useEffect, useState } from 'react'
import IntroSekcija from './component/intro'
import FingerprintInfo from './component/FingerprintInfo'
import { jwtDecode } from 'jwt-decode'
import { BACKEND_URL } from '../lib/api'
import { setPriority } from 'os'
import UserTabs from './component/tabs'
import MyFingerprints from './component/MyFingerPrints'


export default function Home() {
  const [email, setEmail] = useState<string | null>(null)
  const [name, setName]= useState<string | null>(null)
  const [token, setToken]= useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("newFingerprint");


  useEffect(() => {
    const token = localStorage.getItem("tracebit_token");
        if (!token) {
          setEmail(null);
          setToken(null)
          return;
        }
        setToken(token);
        try {
          const decoded: { email?: string } = jwtDecode(token);
          setEmail(decoded.email ?? null);
        } catch {
          setEmail(null);
        }
    
        // async function inside useEffect
        async function fetchName() {
          try {
            const response = await fetch(`${BACKEND_URL}/api/nametake`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
    
    
            if (response.ok) {
              const data = await response.json();
              setName(data.name); // assuming backend returns { name: "username" }
            } else {
              setName(null);
            }
          } catch {
            setName(null);
          }
        }
    
        fetchName();
  }, []);


  return (
    <div>
      {email ? 
      (
        <>
          <UserTabs activeTab={activeTab} setActiveTab={setActiveTab} />
           {/* Main content controlled by active tab */}
            {activeTab === "newFingerprint" && (
              <div>
                <div className="flex flex-col justify-center items-center text-center" style={{ paddingTop: "4rem" }}>
                <div className="text-4xl font-bold mb-4 text-black">Welcome {name}</div>
                </div>
                <IntroSekcija />
                <FingerprintInfo />
              </div>
            )}

            {activeTab === "history" && (
              <MyFingerprints />
            )}
        </>
      ) :
      (
      <>
        <IntroSekcija />
        <FingerprintInfo />
      </>
      )
      }
      
    </div>
  )
}
