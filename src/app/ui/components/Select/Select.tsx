import React, { useState, useMemo, useCallback } from "react";
import uniqid from "uniqid";

import handleRipple from "@/ui/components/Ripple/Ripple";
import DownArrow from "@/assets/arrow-down-s-fill.svg";

import styles from "./Select.module.scss";

type SelectProps = {
  children: React.ReactNode[];
  value: string;
  onChange: (value: string) => void;
  overlayText: string;
};

const Select: React.FC<SelectProps> = ({ children, value, onChange, overlayText }) => {
  const [open, setOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    handleRipple(event);
    setOpen(!open);
  };

  const handleSelect = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if ((event.target as HTMLElement).id !== "ripple")
        setTimeout(() => onChange((event.target as HTMLSelectElement).value), 400);
      if ((event.target as HTMLSelectElement).value !== value) setTimeout(() => setOpen(false), 400);
      handleRipple(event);
    },
    [onChange, value]
  );

  const Options = useMemo(() => {
    return children.map((option) =>
      React.cloneElement(option, {
        key: uniqid(),
        onClick: handleSelect,
        className:
          option?.props.value == value
            ? `${(option?.props.className && option.props.className + " ") || ""} ${styles.selected}`
            : `${(option?.props.className && option.props.className + " ") || ""}`,
      })
    );
  }, [children, handleSelect, value]);

  return (
    <div className={styles.root} style={{ height: open ? `calc(100% * ${children.length} + .6rem)` : "100%" }}>
      <div className={`${styles.clickAway} ${!open ? styles.hide : ""}`} onClick={() => setOpen(false)} />
      <div className={styles.selectBox} onClick={handleClick}>
        <p>{overlayText || value}</p>
        <DownArrow
          className={`${styles.downArrow} ${open ? styles.upArrow : ""}`}
          alt={`Select box ${open ? "up" : "down"} arrow`}
        />
      </div>
      <div className={`${styles.optionBox} ${open ? styles.open : ""}`}>{Options}</div>
    </div>
  );
};

export default Select;
