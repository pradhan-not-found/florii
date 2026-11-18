"use client";

import { createContext } from "react";

/** The visitor total the server already knows, so the header shows a number on its very first paint. */
export const InitialVisitors = createContext<number | null>(null);

export function VisitorsProvider({ value, children }: { value: number | null; children: React.ReactNode }) {
  return <InitialVisitors.Provider value={value}>{children}</InitialVisitors.Provider>;
}
