"use client";

import React, { useRef, useActionState } from "react";
// import { useFormState } from "react-dom";
import { redirect } from "next/navigation";

import { authenticateSignIn } from "@/lib/actions";

import Button from "@/ui/components/Button/Button";
import InputBox from "@/ui/components/InputBox/InputBox";

import type { InputState } from "@/ui/components/InputBox/InputBox";

import styles from "./LoginForm.module.scss";

export type LoginFormState = {
  [key: string]: InputState;
};

const initialFormState: LoginFormState = {
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
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction, isPending] = useActionState<LoginFormState>(authenticateSignIn, initialFormState);

  const handleCancel = () => {
    closePage();
    setTimeout(() => {
      window.scrollTo(0, 0); // this fixes the window position bug on mobile devices
      redirect("/gallery");
    }, 150);
  };

  return (
    <div className={styles.root}>
      <h2>Please enter your details...</h2>
      <form ref={formRef} action={formAction} className={styles.form}>
        <div className={styles.inputBoxes}>
          <InputBox inputState={formState.email} label="Email" name="email" type="email" />
        </div>
        <div className={styles.inputBoxes}>
          <InputBox inputState={formState.pwd} label="Password" name="password" type="password" />
        </div>
      </form>
      <div className={styles.buttonsContainer}>
        <div className={styles.buttons}>
          <Button onClick={() => handleCancel()}>Cancel</Button>
        </div>
        <div className={styles.buttons}>
          {formRef && (
            <Button
              onClick={() => formRef.current!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))}
              type="submit"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
