"use client";

import BurgerProps from "@/lib/definitions";

import styles from "./Burger4.module.scss";

const Burger4: React.FC<BurgerProps> = ({ state, setState }) => (
  <div className={`${styles.root} ${state ? styles.open : ""}`} onClick={() => setState(!state)}>
    <span></span>
    <span></span>
    <span></span>
  </div>
);

export default Burger4;
