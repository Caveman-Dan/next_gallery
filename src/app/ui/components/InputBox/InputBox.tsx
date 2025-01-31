"use client";

import { useState } from "react";

import EyeOpen from "@/assets/eye-line.svg";
import EyeClosed from "@/assets/eye-off-line.svg";

import styles from "./InputBox.module.scss";

const InputBox = ({ inputState, onChange, label, type = "text" }) => {
  const [revealText, setRevealText] = useState(false);

  const handleReveal = (event) => {
    event.stopPropagation();
    setRevealText(!revealText);
  };

  // const hideCharacters = value => ;

  return (
    <div className={styles.root}>
      <label>
        <input
          type={type === "password" && revealText ? "text" : type}
          placeholder="&nbsp;"
          className={styles.inputBox}
          onChange={onChange}
          value={inputState.value}
        />
        <span className={styles.label}>{label}</span>
      </label>
      {type === "password" && (
        <span className={styles.eye} onClick={handleReveal}>
          {revealText ? <EyeOpen height="1.5rem" /> : <EyeClosed height="1.5rem" />}
        </span>
      )}
    </div>
  );
};

export default InputBox;
