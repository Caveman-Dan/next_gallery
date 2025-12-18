"use client";

import { useState } from "react";
import clsx from "clsx";

import EyeOpen from "@/assets/eye-line.svg";
import EyeClosed from "@/assets/eye-off-line.svg";

import type { InputState } from "@/definitions/formDefinitions";

import styles from "./InputBox.module.scss";

type InputBoxProps = {
  inputState: InputState;
  label: string;
  name: string;
  type: "text" | "password" | "email"; // add more if needed
};

const InputBox: React.FC<InputBoxProps> = ({ inputState, label, name, type = "text" }) => {
  const [revealText, setRevealText] = useState(false);

  const handleReveal = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    setRevealText(!revealText);
  };

  const effectiveType = type === "password" && revealText ? "text" : type;
  const hasError = !!inputState.errors;
  const hasMessage = !!inputState.messages?.length;
  const inputKey = `${name}-${inputState.value}-${hasError ? "error" : "noerror"}`;

  return (
    <div className={styles.root}>
      <div className={styles.input}>
        <label>
          <input
            key={inputKey}
            type={effectiveType}
            name={name}
            placeholder="&nbsp;"
            className={clsx(styles.inputBox, hasError && styles.inputBoxError)}
            defaultValue={inputState.value}
          />
          <span className={styles.label}>{label}</span>
        </label>
        {type === "password" && (
          <span
            className={styles.eye}
            onClick={handleReveal}
            aria-label={revealText ? "Hide password" : "Show password"}
            role="button"
            tabIndex={0}
          >
            {revealText ? <EyeOpen height="1.5rem" /> : <EyeClosed height="1.5rem" />}
          </span>
        )}
      </div>
      <div
        className={clsx(
          styles.messageContainer,
          hasMessage && hasError && styles.errorMessage,
          hasMessage && !hasError && styles.successMessage
        )}
      >
        {hasMessage && <p>{inputState.messages![0]}</p>}
      </div>
    </div>
  );
};

export default InputBox;
