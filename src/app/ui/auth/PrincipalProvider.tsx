"use client";

import { createContext, useContext } from "react";
import type { Principal } from "@/lib/db/dbAccess";

const PrincipalContext = createContext<Principal>({ kind: "guest", user: null });

export const PrincipalProvider = ({ principal, children }: { principal: Principal; children: React.ReactNode }) => (
  <PrincipalContext.Provider value={principal}>{children}</PrincipalContext.Provider>
);

export const usePrincipal = () => useContext(PrincipalContext);
