import React, { useCallback, useRef, useEffect } from "react";
import { animated, useSpring, useSpringRef } from "@react-spring/web";

import Ripple from "@/ui/components/RippleComponent/RippleComponent";
import DirectionalArrow from "@/ui/components/DirectionalArrow/DirectionalArrow";
import ClickAway, { useOpenModal } from "@/ui/components/ClickAway/ClickAway";

import styles from "./Select.module.scss";
import { menuItems as springsConfig } from "@/style/springsConfig";

const ANIMATION_DELAY = 400;

type SelectProps = {
  children: React.ReactNode[];
  value: string;
  onChange: (value: string) => void;
  overlayText: string;
};

type OptionElementProps = {
  className?: string;
  "data-value"?: string;
  children?: React.ReactNode;
};

const Select: React.FC<SelectProps> = ({ children, value, onChange, overlayText }) => {
  const thisNode = useRef<HTMLDivElement>(null);
  const [open, closing, setOpen] = useOpenModal({ delay: ANIMATION_DELAY, parentRefs: [thisNode] });
  const api = useSpringRef();
  const springs = useSpring({
    ref: api,
    from: { height: "100%" },
  });

  const openHeight = `${100 * children.length + 25}%`;

  useEffect(() => {
    api.start({
      to: { height: open ? openHeight : "100%" },
      config: { ...springsConfig, clamp: !open },
    });
  }, [open, api, openHeight]);

  const handleOpenClose = useCallback(
    (newState = !open) => {
      setOpen(newState);
    },
    [open, setOpen]
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

  const Options = children.map((OptionElement, index) => {
    // TypeScript type guard (OptionElement)
    if (React.isValidElement<OptionElementProps>(OptionElement)) {
      return (
        <div
          {...OptionElement.props}
          key={OptionElement.props["data-value"] ?? String(index)}
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
      <ClickAway active={open} setActive={handleOpenClose} closing={closing} delay={ANIMATION_DELAY} blur />
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
