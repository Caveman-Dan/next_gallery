"use client";

import React from "react";

import styles from "./Button.module.scss";

type ButtonProps = {
  children: React.ReactNode;
  callback?: (event: React.MouseEvent) => void;
};

const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
  const button = event.currentTarget;
  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
  circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;
  circle.classList.add(styles.ripple);

  const ripple = button.getElementsByClassName(styles.ripple)[0];

  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
};

const Button: React.FC<ButtonProps> = ({ children, callback }) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(event);
    if (callback) callback(event);
  };

  return (
    <button className={styles.root} onClick={handleClick}>
      {children}
    </button>
  );
};

export default Button;
