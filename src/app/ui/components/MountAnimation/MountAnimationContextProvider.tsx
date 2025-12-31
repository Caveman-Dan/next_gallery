import { useContext, createContext } from "react";

type MountAnimationContextType = {
  closePage: (href: string) => void;
};

const MountAnimationContext = createContext<MountAnimationContextType | undefined>(undefined);

const MountAnimationContextProvider: React.FC<{
  closePage: () => void;
  children: React.ReactNode;
}> = ({ closePage, children }) => (
  <MountAnimationContext.Provider value={{ closePage }}>{children}</MountAnimationContext.Provider>
);

export const useMountAnimationContext = () => {
  const context = useContext(MountAnimationContext);
  if (!context) {
    throw Error("useMountAnimationContext must be used within <MountAnimationContextProvider />");
  }
  return context;
};

export default MountAnimationContextProvider;
