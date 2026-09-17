"use client";

import { animated } from "@react-spring/web";
import { capitalise } from "@/lib/helpers";
import DirectionalArrow from "@/ui/components/DirectionalArrow/DirectionalArrow";
import styles from "./Accordion.module.scss";

import type { SpringValue } from "@react-spring/web";
import type { ReactNode } from "react";

interface FolderSectionProps {
  name: string;
  isSectionOpen: boolean;
  isOpenList: boolean;
  isRootItem: boolean;
  springs: { height: SpringValue<string> };
  onToggle: () => void;
  animateHeight?: boolean;
  labelStart?: ReactNode;
  children: ReactNode;
}

const FolderSection = ({
  name,
  isSectionOpen,
  isOpenList,
  isRootItem,
  springs,
  onToggle,
  animateHeight = true,
  labelStart,
  children,
}: FolderSectionProps) => (
  <div
    className={`${styles.expandingLayerContainer}${
      isSectionOpen && isRootItem ? ` ${styles.openRootExpandingLayer}` : ""
    }${isRootItem ? " baseItem" : ""}`}
  >
    <div className={`${styles.sectionLabel}${isSectionOpen ? ` ${styles.isOpenLabel}` : ""}`}>
      <button type="button" className={styles.sectionToggle} onClick={onToggle}>
        <span className={styles.rowLabel}>{capitalise(name)}</span>
      </button>
      {labelStart}
      <button type="button" className={styles.rowArrow} onClick={onToggle}>
        <DirectionalArrow
          direction={isSectionOpen ? "up" : "down"}
          height={"28px"}
          colour={!isSectionOpen ? "var(--highlight-colour-alternate4)" : undefined}
        />
      </button>
    </div>

    {isRootItem && animateHeight ? (
      <animated.div className={`${styles.expandingLayer}${isOpenList ? ` ${styles.isOpenList}` : ""}`} style={springs}>
        {children}
      </animated.div>
    ) : (
      <div
        className={`${styles.expandingLayer}${isOpenList ? ` ${styles.isOpenList}` : ""}`}
        style={!isRootItem || isSectionOpen ? undefined : { height: 0, overflow: "hidden" }}
      >
        {children}
      </div>
    )}
  </div>
);

export default FolderSection;
