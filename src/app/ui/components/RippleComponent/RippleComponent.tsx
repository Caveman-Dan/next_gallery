import React, { useState, useLayoutEffect } from "react";
import styles from "./RippleComponent.module.scss";

const useDebouncedRippleCleanUp = (rippleCount: number, cleanUpFunction: () => void, duration = 1000) => {
  useLayoutEffect(() => {
    let bounce: ReturnType<typeof setTimeout> | null = null;
    if (rippleCount > 0) {
      // Null guard for Typescript
      if (bounce !== null) clearTimeout(bounce);

      bounce = setTimeout(() => {
        cleanUpFunction();
        // Null guard for Typescript
        if (bounce !== null) clearTimeout(bounce);
      }, duration * 4);
    }

    // Null guard for Typescript
    if (bounce !== null) return () => clearTimeout(bounce);
  }, [rippleCount, duration, cleanUpFunction]);
};

const Ripple = () => {
  const [rippleArray, setRippleArray] = useState<
    Array<{
      x: number;
      y: number;
      size: number;
    }>
  >([]);

  useDebouncedRippleCleanUp(rippleArray.length, () => {
    setRippleArray([]);
  });

  const addRipple = (event: React.MouseEvent) => {
    const rippleContainer = event.currentTarget.getBoundingClientRect();
    const size = rippleContainer.width > rippleContainer.height ? rippleContainer.width : rippleContainer.height;
    const x = event.pageX - rippleContainer.x - size / 2;
    const y = event.pageY - rippleContainer.y - size / 2;
    const newRipple = {
      x,
      y,
      size,
    };

    setRippleArray([...rippleArray, newRipple]);
  };

  return (
    <div className={styles.root} onMouseDown={addRipple}>
      {rippleArray.length > 0 &&
        rippleArray.map((ripple, index) => {
          return (
            <span
              id="ripple"
              className={styles.ripple}
              key={"span" + index}
              style={{
                top: ripple.y,
                left: ripple.x,
                width: ripple.size,
                height: ripple.size,
              }}
            />
          );
        })}
    </div>
  );
};

export default Ripple;
