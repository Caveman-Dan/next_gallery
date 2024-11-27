"use client";

import React from "react";

import handleRipple from "@/ui/components/Ripple/Ripple";

import styles from "./Button.module.scss";

type ButtonProps = {
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ children }) => {
  return (
    <button className={styles.root} onClick={handleRipple}>
      {children}
    </button>
  );
};

export default Button;
