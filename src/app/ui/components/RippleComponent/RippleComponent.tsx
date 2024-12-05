import React, { useState, useLayoutEffect } from "react";
// import { RippleContainer } from "./Ripple.styled";
// import PropTypes from "prop-types";

import styles from "./RippleComponent.module.scss";

const useDebouncedRippleCleanUp = (rippleCount, cleanUpFunction, duration = 1000) => {
  useLayoutEffect(() => {
    let bounce = null;
    if (rippleCount > 0) {
      clearTimeout(bounce);

      bounce = setTimeout(() => {
        cleanUpFunction();
        clearTimeout(bounce);
      }, duration * 2);
    }

    return () => clearTimeout(bounce);
  }, [rippleCount, duration, cleanUpFunction]);
};

const Ripple = () => {
  // const { duration, color } = props;
  const [rippleArray, setRippleArray] = useState([]);

  useDebouncedRippleCleanUp(rippleArray.length, () => {
    setRippleArray([]);
  });

  const addRipple = (event) => {
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

// Ripple.propTypes = {
//   duration: PropTypes.number,
//   color: PropTypes.string,
// };

// Ripple.defaultProps = {
//   duration: 850,
//   color: "#fff",
// };

export default Ripple;
