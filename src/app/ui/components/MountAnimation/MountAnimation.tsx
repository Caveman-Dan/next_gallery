"use client";

// Any component wrapped in this parent component will be able to access the closePage
// function via the useMountAnimationContext hook. The closePage() function will handle
// the close animation and accept a redirect url if required.
// const closePage = useMountAnimationContext();

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { animated, useSpring } from "@react-spring/web";

import MountAnimationContextProvider, { MountAnimationReturnToType } from "./MountAnimationContextProvider";
import useIsClient from "@/hooks/useIsClient";

import styles from "./MountAnimation.module.scss";

import type { MountAnimationOptions } from "./MountAnimationConfig";

type Props = {
  children: React.ReactNode;
  mountAnimationConf: MountAnimationOptions;
};

export type ReturnToState = {
  returnIndex: string;
  returnPath: string;
};

export type ClosePageInput = {
  redirectPath?: string;
  returnTo?: string | undefined;
  returnIndex?: string | undefined;
};

const MountAnimation = ({ children, mountAnimationConf }: Props) => {
  const router = useRouter();
  const isClient = useIsClient();
  const [isClosing, setIsClosing] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | undefined>(undefined);
  const [returnToState, setReturnToState] = useState<MountAnimationReturnToType | undefined>(undefined);
  const isMounted = isClient && !isClosing;

  const fadeTimeIn = mountAnimationConf.open.fadeTime;
  const fadeTimeOut = mountAnimationConf.close.fadeTime;
  const targetStyle = isMounted ? mountAnimationConf.open.style : mountAnimationConf.close.style;
  const targetConfig = isMounted ? mountAnimationConf.open.springs : mountAnimationConf.close.springs;

  const spring = useSpring({
    to: targetStyle,
    config: targetConfig,
    onRest: (result) => {
      if (!isMounted && result.finished && redirectPath) {
        router.push(redirectPath);
      }
    },
  });

  const handleClose = useCallback(({ redirectPath, returnTo, returnIndex }: ClosePageInput) => {
    if (returnTo && returnIndex) {
      setReturnToState((prev) => ({
        ...prev,
        [returnIndex]: returnTo,
      }));
      setRedirectPath(redirectPath);
    } else if (!returnTo && returnIndex) {
      setReturnToState((prev) => {
        if (!prev?.[returnIndex]) return prev;
        setRedirectPath(prev[returnIndex]);
        const nextState = { ...prev };
        delete nextState[returnIndex];
        return nextState;
      });
    } else {
      setRedirectPath(redirectPath);
    }

    setIsClosing(true);
  }, []);

  return (
    <main className={styles.root}>
      <animated.div
        className={styles.container}
        style={{
          ...spring,
          transition: `opacity ${fadeTimeIn}ms ease-in-out`,
          opacity: 1,
          ...(!isMounted && { transition: `opacity ${fadeTimeOut}ms ease-in-out`, opacity: 0 }),
        }}
      >
        <MountAnimationContextProvider mountAnimationState={{ closePage: handleClose, returnPaths: returnToState }}>
          {children}
        </MountAnimationContextProvider>
      </animated.div>
    </main>
  );
};

export default MountAnimation;
