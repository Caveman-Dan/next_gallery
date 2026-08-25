"use client";

import { animated } from "@react-spring/web";
import { capitalise } from "@/lib/helpers";
import DirectionalArrow from "@/ui/components/DirectionalArrow/DirectionalArrow";
import styles from "./Accordion.module.scss";

import type { SpringValue } from "@react-spring/web";

interface FolderSectionProps {
  name: string;
  isSectionOpen: boolean;
  isOpenList: boolean;
  isRootItem: boolean;
  springs: { height: SpringValue<string> };
  onToggle: () => void;
  children: React.ReactNode;
}

const FolderSection = ({
  name,
  isSectionOpen,
  isOpenList,
  isRootItem,
  springs,
  onToggle,
  children,
}: FolderSectionProps) => (
  <div
    className={`${styles.expandingLayerContainer}${
      isSectionOpen && isRootItem ? ` ${styles.openRootExpandingLayer}` : ""
    }${isRootItem ? " baseItem" : ""}`}
  >
    <div
      className={`${styles.sectionLabel}${isSectionOpen ? ` ${styles.isOpenLabel}` : ""}`}
      onClick={onToggle}
    >
      {capitalise(name)}
      <DirectionalArrow
        direction={isSectionOpen ? "up" : "down"}
        height={"28px"}
        colour={!isSectionOpen ? "var(--highlight-colour-alternate4)" : undefined}
      />
    </div>

    {isRootItem ? (
      <animated.div
        className={`${styles.expandingLayer}${isOpenList ? ` ${styles.isOpenList}` : ""}`}
        style={springs}
      >
        {children}
      </animated.div>
    ) : (
      <div className={`${styles.expandingLayer}${isOpenList ? ` ${styles.isOpenList}` : ""}`}>
        {children}
      </div>
    )}
  </div>
);

export default FolderSection;
