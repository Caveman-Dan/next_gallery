"use client";

import { useLayoutEffect, useRef } from "react";
import { animated, useSpring } from "@react-spring/web";
import { accordion as springsConfig } from "@/style/springsConfig";
import styles from "./AdminUsers.module.scss";

const ProfileRow = ({
  isNew,
  exiting,
  onEntered,
  onExited,
  className,
  innerClassName,
  children,
}: {
  isNew: boolean;
  exiting: boolean;
  onEntered: () => void;
  onExited: () => void;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const [springs, api] = useSpring(() => ({
    height: isNew ? 0 : (innerRef.current?.scrollHeight ?? "auto"),
    opacity: isNew ? 0 : 1,
    config: springsConfig,
  }));

  useLayoutEffect(() => {
    if (!isNew) return;
    const height = innerRef.current?.scrollHeight ?? 0;
    api.start({
      to: async (next) => {
        await next({ height, opacity: 0 });
        await next({ opacity: 1 });
        onEntered();
      },
    });
  }, [api, isNew, onEntered]);

  useLayoutEffect(() => {
    if (!exiting) return;
    api.start({
      to: async (next) => {
        await next({ opacity: 0 });
        await next({ height: 0 });
        onExited();
      },
    });
  }, [api, exiting, onExited]);

  return (
    <animated.li className={className ?? styles.userRow} style={{ ...springs, overflow: "hidden" }}>
      <div ref={innerRef} className={innerClassName ?? styles.profileRowInner}>
        {children}
      </div>
    </animated.li>
  );
};

export default ProfileRow;
