import React, { useEffect } from "react";

import { InteractiveToggleProps } from "@/lib/definitions";

import styles from "./ClickAway.module.scss";

type ClickAwayProps = Omit<InteractiveToggleProps, "state" | "setState"> & {
  active: InteractiveToggleProps["state"];
  setActive: InteractiveToggleProps["setState"];
  blur?: boolean;
  parentRefs?: React.RefObject<HTMLDivElement>[];
};

// For background blur to work you need parentRefs and blur to be true
// Attach useRef() to parent node and pass to ClickAway via parentRefs prop
const ClickAway: React.FC<ClickAwayProps> = ({ active, setActive, blur = false, parentRefs = null }) => {
  useEffect(() => {
    if (blur && active && parentRefs?.length)
      parentRefs.forEach((ref) => {
        if (ref.current) ref.current.classList.add(styles.raise);
      });
  }, [parentRefs, active, blur]);

  const handleClick = () => {
    setActive(false);
    if (blur && parentRefs?.length)
      parentRefs.forEach((ref) => {
        if (ref.current) ref.current.classList.remove(styles.raise);
      });
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
