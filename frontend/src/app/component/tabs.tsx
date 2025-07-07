//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\component\tabs.tsx

'use client';

import { usePathname, useRouter } from "next/navigation";

export default function UserTabs() {
  const router = useRouter();
  const pathname = usePathname();

  // Tab konfiguracija
  const tabs = [
    { href: "/user", label: "New fingerprint", activeMatch: /^\/user\/?$/ },
    { href: "/user/history", label: "Fingerprint history", activeMatch: /^\/user\/history/ },
  ];

  return ( 
    <nav className="fixed top-[4rem] z-40 w-full border-b border-gray-300 mb-6 bg-white shadow-sm">

      {tabs.map(({ href, label, activeMatch }) => (
        <button
          key={href}
          onClick={() => router.push(href)}
          className={`px-4 py-2 -mb-px border-b-2 font-medium transition-colors ${
            activeMatch.test(pathname)
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent hover:text-indigo-600 hover:border-indigo-600"
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
