import React, { useEffect } from "react";

import styles from "./ClickAway.module.scss";

// For background blur to work you need parentRef and blur to be true
// Attach useRef() to parent node and pass to ClickAway via parentRef prop
const ClickAway = ({ active, setActive, blur = false, parentRef = null }) => {
  useEffect(() => {
    if (blur && parentRef && active) parentRef?.current.classList.add(styles.raise);
  }, [parentRef, active, blur]);

  const handleClick = () => {
    setActive(false);
    if (blur && parentRef) parentRef.current.classList.remove(styles.raise);
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
