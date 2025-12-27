"use client";

// Any component wrapped in this parent component will be able to access the closePage
// function via the useMountAnimationContext hook. The closePage() function will handle
// the close animation and accept a redirect url if required.
// const closePage = useMountAnimationContext();

import React, { useEffect, useState, useContext, createContext } from "react";
import { useRouter } from "next/navigation";
import { animated, useSpring } from "@react-spring/web";

import styles from "./MountAnimation.module.scss";

import type { SpringConf } from "@/style/springsConfig";

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

const MountAnimation = ({
  children,
  springsConfOpen,
  springsConfClose,
}: {
  children: React.ReactNode;
  springsConfOpen: SpringConf;
  springsConfClose: SpringConf;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const [springs, api] = useSpring(() => ({
    transform: "scale(0)",
  }));

  useEffect(() => {
    setIsMounted(true);
    api.start({
      transform: "scale(1)",
      config: {
        ...springsConfOpen,
      },
    });
  }, [api, springsConfOpen]);

  const handleClose = (redirectPath?: string) => {
    api.start({
      transform: "scale(0)",
      config: {
        ...springsConfClose,
      },
      onRest: () => {
        if (redirectPath) router.push(redirectPath);
      },
    });
  };

  return (
    <main className={styles.root}>
      <animated.div className={`${styles.modal} ${!isMounted ? ` ${styles.transparent}` : ""}`} style={{ ...springs }}>
        <MountAnimationContextProvider closePage={handleClose}>{children}</MountAnimationContextProvider>
      </animated.div>
    </main>
  );
};

export default MountAnimation;
