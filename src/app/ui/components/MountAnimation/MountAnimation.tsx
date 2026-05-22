"use client";

// Any component wrapped in this parent component will be able to access the closePage
// function via the useMountAnimationContext hook. The closePage() function will handle
// the close animation and accept a redirect url if required.
// const closePage = useMountAnimationContext();

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { animated, useSpring } from "@react-spring/web";
import clsx from "clsx";

import MountAnimationContextProvider from "./MountAnimationContextProvider";

import styles from "./MountAnimation.module.scss";

import type { MountAnimationOptions } from "./MountAnimationConfig";

type Props = {
  children: React.ReactNode;
  mountAnimationConf: MountAnimationOptions;
};

const MountAnimation = ({ children, mountAnimationConf }: Props) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | undefined>(undefined);

  const fadeTimeIn = mountAnimationConf.open.fadeTime;
  const fadeTimeOut = mountAnimationConf.close.fadeTime;
  const targetStyle = isMounted ? mountAnimationConf.open.style : mountAnimationConf.close.style;
  const targetConfig = isMounted ? mountAnimationConf.open.springs : mountAnimationConf.close.springs;

  const spring = useSpring({
    to: targetStyle,
    config: targetConfig,
    onRest: (result) => {
      if (!isMounted && result.finished) {
        if (redirectPath) {
          router.push(redirectPath);
        }
      }
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClose = useCallback((redirectPath?: string) => {
    setRedirectPath(redirectPath);
    setIsMounted(false);
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
        <MountAnimationContextProvider closePage={handleClose}>{children}</MountAnimationContextProvider>
      </animated.div>
    </main>
  );
};

export default MountAnimation;
