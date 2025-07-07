//C:\UNI\DProject\tracebit\TraceBit\frontend\src\context\TabContext.tsx
'use client';

import { createContext, useMemo, useState } from "react";

type TabContextType = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export const TabContext = createContext<TabContextType>({
  activeTab: "newFingerprint",
  setActiveTab: () => {},
});

export const TabProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState("newFingerprint");

  const contextValue = useMemo(
    () => ({ activeTab, setActiveTab }),
    [activeTab]
  );

  return (
    <TabContext.Provider value={contextValue}>
      {children}
    </TabContext.Provider>
  );
};

