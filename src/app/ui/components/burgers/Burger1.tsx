"use client";

import BurgerProps from "@/lib/definitions";

import styles from "./Burger1.module.scss";

const Burger1: React.FC<BurgerProps> = ({ state, setState }) => (
  <div className={`${styles.root} ${state ? styles.open : ""}`} onClick={() => setState(!state)}>
    <span></span>
    <span></span>
    <span></span>
  </div>
);

export default Burger1;
