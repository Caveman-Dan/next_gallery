import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { InteractiveToggleProps } from "@/definitions/definitions";

import styles from "./ClickAway.module.scss";

type ClickAwayProps = Omit<InteractiveToggleProps, "state" | "setState"> & {
  active: InteractiveToggleProps["state"];
  setActive: InteractiveToggleProps["setState"];
  closing: boolean;
  delay: number;
  blur?: boolean;
};

// For elements to rise above the blur/clickAway component
// Add their ref to the parentRefs array.
export const useOpenModal = ({
  delay = 0,
  parentRefs,
}: {
  delay: number;
  parentRefs?: React.RefObject<HTMLDivElement>[];
}): [boolean, boolean, (newState: boolean) => void] => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleSetOpen = async (newState: boolean = !isOpen) => {
    if (newState) {
      if (parentRefs?.length) raiseForeground(parentRefs);
      setIsOpen(true);

      // If the `clickAway.hide` must be `display: none` instead of `z-index -100;`, uncomment:
      // setIsClosing(true);
      // setTimeout(() => setIsClosing(false), 10);
    } else {
      setIsClosing(true);
      setIsOpen(false);
      await setTimeout(() => {
        setIsClosing(false);
        if (parentRefs?.length) lowerForeground(parentRefs);
      }, delay);
    }
  };

  return [isOpen, isClosing, handleSetOpen];
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

const ClickAway: React.FC<ClickAwayProps> = ({ active, setActive, closing = false, delay = 0, blur = false }) => {
  const router = useRouter();

  // Handle browser back button
  useEffect(() => {
    if (!active) return;

    const handlePopstate = () => {
      setActive(false);
    };

    try {
      router.push("#modal", { scroll: false });

      window.addEventListener("popstate", handlePopstate);

      return () => {
        window.removeEventListener("popstate", handlePopstate);
        if (window.location.hash === "#modal") router.back();
      };
    } catch (err) {
      alert(`ERROR: ${JSON.stringify(err)}`);
    }
  }, [active, setActive]);

  return (
    <div
      className={`
        ${styles.clickAway}
        ${!active && !closing ? styles.hide : ""}
        ${blur && active && !closing ? styles.blur : ""}
      `}
      style={{ "--animation-delay": `${delay}ms` } as React.CSSProperties}
      onClick={() => setActive(false)}
    />
  );
};

export default ClickAway;
