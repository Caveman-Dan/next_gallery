"use client";

import React, { useState } from "react";
import { redirect } from "next/navigation";

import Button from "@/ui/components/Button/Button";
import InputBox from "@/ui/components/InputBox/InputBox";

import type { InputState } from "@/ui/components/InputBox/InputBox";

import styles from "./LoginForm.module.scss";

const initialFormState: { [key: string]: InputState } = {
  email: {
    value: "",
    error: false,
    message: "",
  },
  pwd: {
    value: "",
    error: false,
    message: "",
  },
};

const LoginForm = ({ closePage }: { closePage: () => void }) => {
  const [formState, setFormState] = useState(initialFormState);

  const handleCancel = () => {
    closePage();
    setTimeout(() => {
      window.scrollTo(0, 0); // this fixes the window position bug on mobile devices
      redirect("/gallery");
    }, 150);
  };

  const handleInput = (event: React.ChangeEvent<HTMLElement>, field: string) => {
    setFormState({ ...formState, [field]: { ...formState[field], value: (event.target as HTMLInputElement).value } });
  };

  return (
    <div className={styles.root}>
      <h2>Please enter your details...</h2>
      <form className={styles.form}>
        <div className={styles.inputBoxes}>
          <InputBox
            inputState={formState.email}
            onChange={(event) => handleInput(event, "email")}
            label="Email"
            type="email"
          />
        </div>
        <div className={styles.inputBoxes}>
          <InputBox
            inputState={formState.pwd}
            onChange={(event) => handleInput(event, "pwd")}
            label="Password"
            type="password"
          />
        </div>
      </form>
      <div className={styles.buttonsContainer}>
        <div className={styles.buttons}>
          <Button onClick={() => handleCancel()}>Cancel</Button>
        </div>
        <div className={styles.buttons}>
          <Button>Login</Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
