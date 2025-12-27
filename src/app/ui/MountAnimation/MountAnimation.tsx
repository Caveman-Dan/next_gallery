"use client";

import React, { useEffect, useState, Children, cloneElement } from "react";
import { useRouter } from "next/navigation";
import { animated, useSpring } from "@react-spring/web";

import styles from "./MountAnimation.module.scss";

const MountAnimation = ({ children, springsConfOpen, springsConfClose, fadeTime = "500" }) => {
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

  const childrenWithProps = Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return cloneElement(child, { closePage: handleClose });
    }
    return child;
  });

  return (
    <main className={styles.root}>
      <animated.div className={`${styles.modal} ${!isMounted ? ` ${styles.transparent}` : ""}`} style={{ ...springs }}>
        {childrenWithProps}
      </animated.div>
    </main>
  );
};

export default MountAnimation;
