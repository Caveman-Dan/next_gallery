"use client";

import { useState } from "react";

import styles from "./Burger3.module.scss";

const Burger3 = () => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`${styles.root} ${open ? styles.open : ""}`}
      onClick={() => setOpen(!open)}
    >
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default Burger3;
