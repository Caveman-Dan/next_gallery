import React, { useState, useCallback, useRef } from "react";
import uniqid from "uniqid";
import { animated, useSpring, useSpringRef } from "@react-spring/web";

import Ripple from "@/ui/components/RippleComponent/RippleComponent";
import DirectionalArrow from "@/ui/components/DirectionalArrow/DirectionalArrow";
import ClickAway from "@/ui/components/ClickAway/ClickAway";

import styles from "./Select.module.scss";
import { menuItems as springsConfig } from "@/style/springsConfig";

type SelectProps = {
  children: React.ReactNode[];
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

  const handleSelect = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if ((event.target as HTMLDivElement).id !== "ripple") {
        onChange((event.target as HTMLSelectElement).getAttribute("data-value") || "system");
        if ((event.target as HTMLSelectElement).getAttribute("data-value") !== value) handleOpenClose(false);
      }
    },
    [onChange, value, handleOpenClose]
  );

  const Options = children.map((OptionElement) => {
    // TypeScript type guard (OptionElement)
    if (React.isValidElement(OptionElement)) {
      return (
        <div
          {...OptionElement.props}
          key={uniqid()}
          onClick={handleSelect}
          className={`
                ${styles.option}
                ${OptionElement?.props.className ? ` ${OptionElement.props.className}` : ""}
                ${OptionElement?.props["data-value"] === value ? ` ${styles.selected}` : ""}
              `}
        >
          {OptionElement.props.children}
        </div>
      );
    }
  });

  return (
    <>
      <ClickAway active={open} setActive={handleOpenClose} parentRefs={[thisNode]} blur />
      <animated.div className={`${styles.root}`} style={{ ...springs }} ref={thisNode}>
        <div className={`${styles.selectBox}`} onClick={() => handleOpenClose()}>
          <p>{overlayText || value}</p>
          <DirectionalArrow direction={open ? "up" : "down"} />
          <Ripple />
        </div>
        <div className={`${styles.optionBox}`}>{Options}</div>
      </animated.div>
    </>
  );
};

export default Select;
