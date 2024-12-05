"use client";

import React from "react";

import Ripple from "@/ui/components/RippleComponent/RippleComponent";

import styles from "./Button.module.scss";

type ButtonProps = {
  className?: string;
  children: React.ReactNode[] | string;
};

const Button: React.FC<ButtonProps> = ({ children }) => {
  return (
    <button className={styles.root}>
      {children}
      <Ripple />
    </button>
  );
};

export default Button;
