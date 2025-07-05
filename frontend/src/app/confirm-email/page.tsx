//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\confirm-email\page.tsx

"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/confirm-email?token=${token}`);
        const data = await res.json();
        if (res.ok) {
          setStatus("Your email has been successfully confirmed. You can now log in.");
          setTimeout(() => router.push("/login"), 3000);
        } else {
          setStatus(data.detail || "Invalid or expired confirmation link.");
        }
      } catch (err) {
        setStatus("An error occurred while confirming your email.");
      }
    };

    if (token) {
      confirmEmail();
    } else {
      setStatus("Missing confirmation token.");
    }
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-semibold mb-4">Email Confirmation</h1>
      <p>{status}</p>
    </div>
  );
}