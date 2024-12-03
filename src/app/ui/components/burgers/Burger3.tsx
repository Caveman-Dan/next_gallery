"use client";

import BurgerProps from "@/lib/definitions";

import styles from "./Burger3.module.scss";

const Burger3: React.FC<BurgerProps> = ({ state, setState }) => (
  <div className={`${styles.root} ${state ? styles.open : ""}`} onClick={() => setState(!state)}>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
);

export default Burger3;
