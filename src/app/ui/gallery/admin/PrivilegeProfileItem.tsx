"use client";

import { useLayoutEffect, useRef } from "react";
import { animated, useSpring } from "@react-spring/web";
import { accordion as springsConfig } from "@/style/springsConfig";

const PrivilegeProfileItem = ({
  exiting,
  onExited,
  children,
}: {
  exiting: boolean;
  onExited: () => void;
  children: React.ReactNode;
}) => {
  const started = useRef(false);
  const [spring, api] = useSpring(() => ({ opacity: 1, config: springsConfig }));

  useLayoutEffect(() => {
    if (!exiting || started.current) return;
    started.current = true;
    api.start({
      opacity: 0,
      onRest: ({ finished }) => {
        if (finished) onExited();
      },
    });
  }, [api, exiting, onExited]);

  return <animated.li style={spring}>{children}</animated.li>;
};

export default PrivilegeProfileItem;
