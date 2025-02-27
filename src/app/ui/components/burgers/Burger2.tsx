"use client";

import { InteractiveToggleProps } from "@/definitions/definitions";

import styles from "./Burger2.module.scss";

const Burger2: React.FC<InteractiveToggleProps> = ({ state, setState }) => (
  <div className={`${styles.root} ${state ? styles.open : ""}`} onClick={() => setState(!state)}>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
);

export default Burger2;
