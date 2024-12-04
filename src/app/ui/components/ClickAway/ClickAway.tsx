import React, { useEffect } from "react";

import { InteractiveToggleProps } from "@/lib/definitions";

import styles from "./ClickAway.module.scss";

type ClickAwayProps = Omit<InteractiveToggleProps, "state" | "setState"> & {
  active: InteractiveToggleProps["state"];
  setActive: InteractiveToggleProps["setState"];
  blur?: boolean;
  parentRef?: React.RefObject<HTMLDivElement>;
};

// For background blur to work you need parentRef and blur to be true
// Attach useRef() to parent node and pass to ClickAway via parentRef prop
const ClickAway: React.FC<ClickAwayProps> = ({ active, setActive, blur = false, parentRef }) => {
  useEffect(() => {
    if (blur && active && parentRef?.current !== null) parentRef?.current.classList.add(styles.raise);
  }, [parentRef, active, blur]);

  const handleClick = () => {
    setActive(false);
    if (blur && parentRef?.current !== null) parentRef?.current.classList.remove(styles.raise);
  };

  return (
    <div
      className={`
        ${styles.clickAway}
        ${!active ? styles.hide : ""}
        ${blur && parentRef ? styles.blur : ""}
      `}
      onClick={handleClick}
    />
  );
};

export default ClickAway;
