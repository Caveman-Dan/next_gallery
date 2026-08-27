"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { InteractiveToggleProps, ModalSetActive } from "@/definitions/definitions";

import styles from "./ClickAway.module.scss";

type ClickAwayProps = Omit<InteractiveToggleProps, "state" | "setState"> & {
  active: InteractiveToggleProps["state"];
  setActive: ModalSetActive;
  closing: boolean;
  delay: number;
  blur?: boolean;
};

export type OpenModalOptions = { skipHistory?: boolean };
export type ForegroundRef = { readonly current: HTMLElement | null };

// For elements to rise above the blur/clickAway component
// Add their ref to the parentRefs array.
export const useOpenModal = ({
  delay = 0,
  parentRefs,
}: {
  delay: number;
  parentRefs?: ForegroundRef[];
}): [boolean, boolean, ModalSetActive] => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const skipHistoryRef = useRef(false);
  const router = useRouter();

  // Own the #modal history so we can optionally skip the router.back()
  useEffect(() => {
    if (!isOpen) return;

    const handlePopstate = () => {
      // Browser back button → always close normally
      skipHistoryRef.current = false;
      setIsOpen(false);
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        if (parentRefs?.length) lowerForeground(parentRefs);
      }, delay);
    };

    try {
      router.push("#modal", { scroll: false });
      window.addEventListener("popstate", handlePopstate);

      return () => {
        window.removeEventListener("popstate", handlePopstate);
        if (window.location.hash === "#modal" && !skipHistoryRef.current) {
          router.back();
        }
        skipHistoryRef.current = false;
      };
    } catch (err) {
      alert(`ERROR: ${JSON.stringify(err)}`);
    }
  }, [isOpen, router, delay, parentRefs]);

  const handleSetOpen: ModalSetActive = (newState = !isOpen, options) => {
    if (newState) {
      if (parentRefs?.length) raiseForeground(parentRefs);
      setIsOpen(true);
    } else {
      skipHistoryRef.current = options?.skipHistory ?? false;
      setIsClosing(true);
      setIsOpen(false);
      setTimeout(() => {
        setIsClosing(false);
        if (parentRefs?.length) lowerForeground(parentRefs);
      }, delay);
    }
  };

  return [isOpen, isClosing, handleSetOpen];
};

export const raiseForeground = (parentRefs: ForegroundRef[] | null) => {
  if (parentRefs?.length)
    parentRefs.forEach((ref) => {
      if (ref.current) ref.current.classList.add(styles.raise);
    });
};

export const lowerForeground = (parentRefs: ForegroundRef[] | null) => {
  if (parentRefs?.length)
    parentRefs.forEach((ref) => {
      if (ref.current) ref.current.classList.remove(styles.raise);
    });
};

const ClickAway: React.FC<ClickAwayProps> = ({ active, setActive, closing = false, delay = 0, blur = false }) => {
  // Pure UI now – no router logic here
  return (
    <div
      className={`
        ${styles.clickAway}
        ${!active && !closing ? styles.hide : ""}
        ${blur && active && !closing ? styles.blur : ""}
      `}
      style={{ "--animation-delay": `${delay}ms` } as React.CSSProperties}
      onClick={() => setActive(false)}
    />
  );
};

export default ClickAway;
