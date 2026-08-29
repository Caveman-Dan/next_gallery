"use client";

import React, { useEffect, useState, useRef } from "react";
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
  const isOpenRef = useRef(false);
  const pushedEntryRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const delayRef = useRef(delay);
  const parentRefsRef = useRef(parentRefs);
  const closeUiRef = useRef<() => void>(() => undefined);

  delayRef.current = delay;
  parentRefsRef.current = parentRefs;

  const clearCloseTimer = () => {
    if (closeTimerRef.current === null) return;
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  };

  const closeUi = () => {
    isOpenRef.current = false;
    setIsOpen(false);
    setIsClosing(true);
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      setIsClosing(false);
      const refs = parentRefsRef.current;
      if (refs?.length) lowerForeground(refs);
    }, delayRef.current);
  };

  closeUiRef.current = closeUi;

  useEffect(() => () => clearCloseTimer(), []);

  // Do not put #modal (or any new URL) in the address bar.
  // Next 16 patches history.pushState; a hash change is treated as a
  // navigation, remounts this tree, resets isOpen, and the slug flickers.
  // A same-URL history entry still lets the browser Back button close the modal.
  useEffect(() => {
    isOpenRef.current = isOpen;
    if (!isOpen) return;

    const handlePopstate = () => {
      if (!isOpenRef.current) return;
      pushedEntryRef.current = false;
      closeUiRef.current();
    };

    if (!pushedEntryRef.current) {
      window.history.pushState({ ...(window.history.state ?? {}), modal: true }, "");
      pushedEntryRef.current = true;
    }

    window.addEventListener("popstate", handlePopstate);
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [isOpen]);

  const handleSetOpen: ModalSetActive = (newState = !isOpen, options) => {
    if (newState) {
      if (parentRefsRef.current?.length) raiseForeground(parentRefsRef.current);
      isOpenRef.current = true;
      setIsOpen(true);
      return;
    }

    closeUi();

    if (!pushedEntryRef.current) return;

    if (options?.skipHistory) {
      // Album Link will change the path. Drop our dummy entry without going back.
      const rest = { ...(window.history.state ?? {}) };
      delete rest.modal;
      window.history.replaceState(rest, "");
      pushedEntryRef.current = false;
    } else {
      pushedEntryRef.current = false;
      window.history.back();
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
