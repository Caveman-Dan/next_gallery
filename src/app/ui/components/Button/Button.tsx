"use client";

import React from "react";

import Ripple from "@/ui/components/RippleComponent/RippleComponent";

import styles from "./Button.module.scss";

type ButtonProps = React.ComponentProps<"button"> & {
  className?: string;
  children: React.ReactNode[] | string;
};

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button className={styles.root} {...props}>
      {children}
      <Ripple />
    </button>
  );
};

export default Button;
