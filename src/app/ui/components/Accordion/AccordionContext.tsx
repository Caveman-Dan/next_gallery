"use client";

import { createContext, useContext } from "react";
import type { AccordionState } from "./types";

const AccordionContext = createContext<AccordionState | null>(null);

export const AccordionProvider = AccordionContext.Provider;

export function useAccordionState(): AccordionState {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error("useAccordionState must be used within an AccordionProvider");
  }
  return ctx;
}
