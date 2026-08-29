"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import styles from "./AnimatedComponent.module.scss";

type AnimatedComponentApi = {
  push: (href: string) => void;
  hide: (onHidden?: () => void) => void;
  show: () => void;
  visible: boolean;
  fadeMs: number;
  handleTransitionEnd: (event: React.TransitionEvent<HTMLElement>) => void;
};

const AnimatedComponentContext = createContext<AnimatedComponentApi | null>(null);

export const useAnimatedComponent = () => {
  const context = useContext(AnimatedComponentContext);
  if (!context) {
    throw new Error("useAnimatedComponent must be used within AnimatedComponentProvider");
  }
  return context;
};

type ProviderProps = {
  children: React.ReactNode;
  fadeMs?: number;
  resetOnPathname?: boolean;
};

export const AnimatedComponentProvider = ({
  children,
  fadeMs = 300,
  resetOnPathname = true,
}: ProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const pendingHref = useRef<string | null>(null);
  const onHidden = useRef<(() => void) | null>(null);

  const show = useCallback(() => {
    setVisible(true);
  }, []);

  const hide = useCallback((after?: () => void) => {
    if (after) onHidden.current = after;
    setVisible(false);
  }, []);

  const push = useCallback(
    (href: string) => {
      if (href === pathname || pendingHref.current) return;
      pendingHref.current = href;
      setVisible(false);
    },
    [pathname]
  );

  useEffect(() => {
    setVisible(true);
  }, [resetOnPathname ? pathname : null]);

  const handleTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLElement>) => {
      if (event.target !== event.currentTarget) return;
      if (visible) return;

      if (pendingHref.current) {
        const href = pendingHref.current;
        pendingHref.current = null;
        router.push(href);
        return;
      }

      onHidden.current?.();
      onHidden.current = null;
    },
    [router, visible]
  );

  const value = useMemo(
    () => ({ push, hide, show, visible, fadeMs, handleTransitionEnd }),
    [push, hide, show, visible, fadeMs, handleTransitionEnd]
  );

  return <AnimatedComponentContext.Provider value={value}>{children}</AnimatedComponentContext.Provider>;
};

type BoxProps = {
  children: React.ReactNode;
  className?: string;
};

const AnimatedComponent = ({ children, className }: BoxProps) => {
  const { visible, fadeMs, handleTransitionEnd } = useAnimatedComponent();

  return (
    <div
      className={`${styles.root}${visible ? ` ${styles.isVisible}` : ""}${className ? ` ${className}` : ""}`}
      style={{ "--animated-component-fade-ms": `${fadeMs}ms` } as React.CSSProperties}
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
    </div>
  );
};

export default AnimatedComponent;