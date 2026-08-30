"use client";

import React, { useActionState } from "react";
import { authenticateSignIn } from "@/lib/serverActions";

import Button from "@/ui/components/Button/Button";
import InputBox from "@/ui/components/InputBox/InputBox";
import { loginFormInitialState } from "@/initialiseData/initialiseData";

import { useMountAnimationContext } from "../components/MountAnimation/MountAnimationContextProvider";

import type { FormState } from "@/definitions/formDefinitions";

import styles from "./LoginForm.module.scss";

// const LoginForm = ({ closePage }: { closePage: (redirectPath: string) => void }) => {
const LoginForm = () => {
  // const [formState, formAction, isPending] = useActionState<FormState>(authenticateSignIn, loginFormInitialState);
  const [formState, formAction] = useActionState<FormState>(authenticateSignIn, loginFormInitialState);
  const { closePage } = useMountAnimationContext();

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closePage({
      redirectPath: "/sign-up",
    });
  };

  return (
    <div className={styles.root}>
      <h2>Please enter your details...</h2>
      <form id="login-form" action={formAction} className={styles.form} noValidate>
        <div className={styles.inputBoxes}>
          <InputBox inputState={formState.email} label="Email" name="email" type="email" />
        </div>
        <div className={styles.inputBoxes}>
          <InputBox inputState={formState.pwd} label="Password" name="password" type="password" />
        </div>
        <button form="login-form" type="submit" style={{ display: "none" }} /> {/* // This allows enter to submit */}
      </form>
      <div className={styles.buttonsContainer}>
        <div className={styles.buttons}>
          <Button onClick={() => closePage({ redirectPath: "/gallery" })}>Cancel</Button>
        </div>
        <div className={styles.buttons}>
          <Button form="login-form" type="submit">
            Login
          </Button>
        </div>
      </div>
      <div className={styles.signup}>
        <p>
          For a new account: <a onClick={handleAnchor}>sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
