"use client";

// Any component wrapped in this parent component will be able to access the closePage
// function via the useMountAnimationContext hook. The closePage() function will handle
// the close animation and accept a redirect url if required.
// const closePage = useMountAnimationContext();

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { animated, useSpring } from "@react-spring/web";
import clsx from "clsx";

import MountAnimationContextProvider from "./MountAnimationContextProvider";

import styles from "./MountAnimation.module.scss";

import type { MountAnimationOptions } from "./MountAnimationConfig";

const MountAnimation = ({
  children,
  mountAnimationConf,
}: {
  children: React.ReactNode;
  mountAnimationConf: MountAnimationOptions;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const styleIn = mountAnimationConf.open.style;
  const springsConfOpen = mountAnimationConf.open.springs;
  const fadeTimeIn = mountAnimationConf.open.fadeTime;
  const styleOut = mountAnimationConf.close.style;
  const springsConfClose = mountAnimationConf.close.springs;
  const fadeTimeOut = mountAnimationConf.close.fadeTime;

  const [springs, api] = useSpring(() => ({
    ...styleOut,
  }));

  useEffect(() => {
    setIsMounted(true);
    api.start({
      ...styleIn,
      config: {
        ...springsConfOpen,
      },
    });
  }, [api, springsConfOpen, styleIn]);

  const handleClose = (redirectPath?: string) => {
    setIsMounted(false);
    api.start({
      ...styleOut,
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
      <animated.div
        className={clsx(styles.container, !isMounted && styles.transparent)}
        style={{
          ...springs,
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
