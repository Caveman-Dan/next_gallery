"use client";

import { useState } from "react";

import styles from "./Burger2.module.scss";

const Burger2 = () => {
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
      <span></span>
      <span></span>
    </div>
  );
};

export default Burger2;
