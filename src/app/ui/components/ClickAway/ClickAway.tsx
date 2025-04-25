import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { InteractiveToggleProps } from "@/definitions/definitions";

import styles from "./ClickAway.module.scss";

const OPEN_STATE_SEARCH_PARAM = "modal-open";

type ClickAwayProps = Omit<InteractiveToggleProps, "state" | "setState"> & {
  active: InteractiveToggleProps["state"];
  setActive: InteractiveToggleProps["setState"];
  closing: boolean;
  delay: number;
  blur?: boolean;
  // parentRefs?: React.RefObject<HTMLDivElement>[];
};

export const useOpenModal = (
  searchParameter: string,
  parentRefs: React.RefObject<HTMLDivElement>[] | null = null,
  delay: number = 0,
  init: boolean
): [boolean, boolean, (newState: boolean) => void] => {
  // const router = useRouter();
  // const searchParams = useSearchParams();
  // const isOpen = searchParams.get(OPEN_STATE_SEARCH_PARAM) === searchParameter;

  const [isOpen, setIsOpen] = useState(init);
  const [isClosing, setIsClosing] = useState(false);

  // return [
  //   isOpen,
  //   (newState: boolean) => {
  //     if (newState) router.push(`?${OPEN_STATE_SEARCH_PARAM}=${searchParameter}`);
  //     else router.back();
  //   },
  // ];

  const handleSetOpen = async (newState: boolean = !isOpen) => {
    if (newState) {
      if (parentRefs?.length) raiseForeground(parentRefs);
      setIsOpen(true);
    } else {
      setIsClosing(true);
      setIsOpen(false);
      await setTimeout(() => {
        setIsClosing(false);
        if (parentRefs?.length) lowerForeground(parentRefs);
      }, delay);
    }
  };

  return [isOpen, isClosing, handleSetOpen];
};

export const raiseForeground = (parentRefs: React.RefObject<HTMLDivElement>[] | null) => {
  if (parentRefs?.length)
    parentRefs.forEach((ref) => {
      if (ref.current) ref.current.classList.add(styles.raise);
    });
};

export const lowerForeground = (parentRefs: React.RefObject<HTMLDivElement>[] | null) => {
  if (parentRefs?.length)
    parentRefs.forEach((ref) => {
      if (ref.current) ref.current.classList.remove(styles.raise);
    });
};

// For background blur to work you need parentRefs and blur to be true
// Attach useRef() to parent node and pass to ClickAway via parentRefs prop
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
