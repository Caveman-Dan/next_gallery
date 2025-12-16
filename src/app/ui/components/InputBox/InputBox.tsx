"use client";

import { useState } from "react";

import EyeOpen from "@/assets/eye-line.svg";
import EyeClosed from "@/assets/eye-off-line.svg";

import styles from "./InputBox.module.scss";

export type InputState = {
  value: string;
  error: boolean;
  message?: string;
};

type InputBoxProps = {
  inputState: InputState;
  label: string;
  name: string;
  type: string;
};

const InputBox: React.FC<InputBoxProps> = ({ inputState, label, name, type = "text" }) => {
  const [revealText, setRevealText] = useState(false);

  const handleReveal = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    setRevealText(!revealText);
  };

  return (
    <div className={styles.root}>
      <label>
        <input
          type={type === "password" && revealText ? "text" : type}
          name={name}
          placeholder="&nbsp;"
          className={styles.inputBox}
          defaultValue={inputState.value}
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
