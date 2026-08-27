"use client";

import { useContext, createContext } from "react";

import { ClosePageInput } from "./MountAnimation";

export type MountAnimationReturnToType = {
  [key: string]: string;
};

export type MountAnimationContextType = {
  closePage: ({ redirectPath, returnTo, returnIndex }: ClosePageInput) => void;
  returnPaths?: MountAnimationReturnToType;
};

const MountAnimationContext = createContext<MountAnimationContextType | null>(null);

const MountAnimationContextProvider: React.FC<{
  mountAnimationState: MountAnimationContextType;
  children: React.ReactNode;
}> = ({ mountAnimationState, children }) => (
  <MountAnimationContext.Provider value={{ ...mountAnimationState }}>{children}</MountAnimationContext.Provider>
);

export const useMountAnimationContext = () => {
  const context = useContext(MountAnimationContext);
  if (!context) {
    throw Error("useMountAnimationContext must be used within <MountAnimationContextProvider />");
  }
  return context;
};

export default MountAnimationContextProvider;
