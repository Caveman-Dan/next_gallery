import React, { useEffect } from "react";

import { InteractiveToggleProps } from "@/definitions/definitions";

import styles from "./ClickAway.module.scss";

type ClickAwayProps = Omit<InteractiveToggleProps, "state" | "setState"> & {
  active: InteractiveToggleProps["state"];
  setActive: InteractiveToggleProps["setState"];
  blur?: boolean;
  parentRefs?: React.RefObject<HTMLDivElement>[];
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
const ClickAway: React.FC<ClickAwayProps> = ({ active, setActive, blur = false, parentRefs = null }) => {
  useEffect(() => {
    if (blur) {
      if (active) raiseForeground(parentRefs);
      else lowerForeground(parentRefs);
    }
  }, [parentRefs, active, blur]);

  const handleClick = () => {
    setActive(false);
    if (blur) lowerForeground(parentRefs);
  };

  return (
    <div
      className={`
        ${styles.clickAway}
        ${!active ? styles.hide : ""}
        ${blur && parentRefs ? styles.blur : ""}
      `}
      onClick={handleClick}
    />
  );
};

export default ClickAway;
