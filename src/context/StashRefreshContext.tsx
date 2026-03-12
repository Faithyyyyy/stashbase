"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type ContextType = { refreshKey: number; triggerRefresh: () => void };

const StashRefreshContext = createContext<ContextType>({
  refreshKey: 0,
  triggerRefresh: () => {},
});

export function StashRefreshProvider({ children }: { children: ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <StashRefreshContext.Provider
      value={{ refreshKey, triggerRefresh: () => setRefreshKey((k) => k + 1) }}
    >
      {children}
    </StashRefreshContext.Provider>
  );
}

export const useStashRefresh = () => useContext(StashRefreshContext);
