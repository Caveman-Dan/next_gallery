import React, { useState, useMemo, useCallback, useRef } from "react";
import uniqid from "uniqid";
import { animated, useSpring, useSpringRef } from "@react-spring/web";

import Ripple from "@/ui/components/RippleComponent/RippleComponent";
import DownArrow from "@/assets/arrow-down-s-fill.svg";
import ClickAway from "@/ui/components/ClickAway/ClickAway";

import styles from "./Select.module.scss";
import { menuItems as springsConfig } from "@/style/springsConfig";

type SelectProps = {
  children: React.ReactNode[];
  // children: React.OptionHTMLAttributes<HTMLOptionElement>[];
  value: string;
  onChange: (value: string) => void;
  overlayText: string;
};

const Select: React.FC<SelectProps> = ({ children, value, onChange, overlayText }) => {
  const [open, setOpen] = useState(false);
  const thisNode = useRef(null);
  const api = useSpringRef();
  const springs = useSpring({
    ref: api,
    from: { height: "100%" },
  });

  const openHight = `${100 * children.length + 25}%`;
  const handleOpenClose = useCallback(
    async (newState = !open) => {
      await setOpen(newState);

      api.start({
        to: {
          height: open ? "100%" : openHight,
        },
        config: {
          ...springsConfig,
          clamp: open,
        },
      });
    },
    [open, api, openHight]
  );

  const handleClick = () => {
    console.log("HELLO");
    handleOpenClose();
  };

  const handleSelect = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if ((event.target as HTMLDivElement).id !== "ripple") {
        onChange((event.target as HTMLSelectElement).value);
        if ((event.target as HTMLSelectElement).value !== value) handleOpenClose(false);
      }
    },
    [onChange, value, handleOpenClose]
  );

  const Options = useMemo(
    () =>
      children.map((option) => {
        // TypeScript type guard (option)
        if (React.isValidElement(option))
          return React.cloneElement(option as React.ReactElement, {
            key: uniqid(),
            onClick: handleSelect,
            className:
              option?.props.value == value
                ? `${(option?.props.className && option.props.className + " ") || ""} ${styles.selected}`
                : `${(option?.props.className && option.props.className + " ") || ""}`,
          });
      }),
    [children, handleSelect, value]
  );

  return (
    <>
      <ClickAway active={open} setActive={handleOpenClose} parentRefs={[thisNode]} blur />
      <animated.div className={styles.root} style={{ ...springs }} ref={thisNode}>
        <div className={styles.selectBox} onClick={handleClick}>
          <p>{overlayText || value}</p>
          <DownArrow
            className={`${styles.downArrow} ${open ? styles.upArrow : ""}`}
            alt={`Select box ${open ? "up" : "down"} arrow`}
          />
          <Ripple />
        </div>
        <div className={`${styles.optionBox}`}>{Options}</div>
      </animated.div>
    </>
  );
};

export default Select;
