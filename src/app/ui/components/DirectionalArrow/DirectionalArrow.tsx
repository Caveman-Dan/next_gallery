import DownArrow from "@/assets/arrow-down-s-fill.svg";

import styles from "./DirectionalArrow.module.scss";

const applyStyle = (direction: string | undefined) => {
  switch (direction) {
    case "up":
      return styles.upArrow;
    case "down":
      return styles.downArrow;
    case "left":
      return styles.leftArrow;
    case "right":
      return styles.rightArrow;
    default:
      return styles.downArrow;
  }
};

type DirectionalArrowProps = {
  direction?: string;
  hide?: boolean;
  height?: string;
  colour?: string;
};

const DirectionalArrow = ({
  direction,
  hide = false,
  height = "32px",
  colour = "var(--highlight-colour-alternate3)",
}: DirectionalArrowProps) => {
  return (
    <DownArrow
      className={`${styles.root} ${applyStyle(direction)}${hide ? ` ${styles.hidden}` : ""}`}
      style={{ height: height, fill: colour }}
    />
  );
};

export default DirectionalArrow;
