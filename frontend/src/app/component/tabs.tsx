//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\component\tabs.tsx

'use client';

import { useContext } from "react";
import { TabContext } from "../../context/TabContext";

export default function UserTabs() {
  const { activeTab, setActiveTab } = useContext(TabContext);

  const tabs = [
    { id: "newFingerprint", label: "New fingerprint" },
    { id: "history", label: "Fingerprint history" },
  ];

  return (
    <nav className="flex border-b border-gray-300 mb-6">
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`px-4 py-2 -mb-px border-b-2 font-medium transition-colors ${
            activeTab === id
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
