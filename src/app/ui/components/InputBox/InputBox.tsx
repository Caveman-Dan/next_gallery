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
  type: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputBox: React.FC<InputBoxProps> = ({ inputState, onChange, label, type = "text" }) => {
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
