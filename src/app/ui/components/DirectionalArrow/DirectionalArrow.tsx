import DownArrow from "@/assets/arrow-down-s-fill.svg";

import styles from "./DirectionalArrow.module.scss";

const applyStyle = (direction) => {
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

const DirectionalArrow = ({ direction, hide = false, height = "32px", colour = "var(--primary-colour-lighter)" }) => {
  return (
    <DownArrow
      className={`${styles.root} ${applyStyle(direction)}${hide ? ` ${styles.hidden}` : ""}`}
      style={{ height: height, fill: colour }}
      alt={`Select box's ${direction} arrow`}
    />
  );
};

export default DirectionalArrow;
