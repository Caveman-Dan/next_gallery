"use client";

import { InteractiveToggleProps } from "@/definitions/definitions";

import styles from "./Burger1.module.scss";

const Burger1: React.FC<InteractiveToggleProps> = ({ state, setState }) => (
  <div className={`${styles.root} ${state ? styles.open : ""}`} onClick={() => setState(!state)}>
    <span></span>
    <span></span>
    <span></span>
  </div>
);

export default Burger1;
