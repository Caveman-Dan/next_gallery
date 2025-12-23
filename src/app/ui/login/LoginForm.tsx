"use client";

import React, { useEffect, useRef, useActionState } from "react";
import { redirect } from "next/navigation";

import { authenticateSignIn } from "@/lib/actions";

import Button from "@/ui/components/Button/Button";
import InputBox from "@/ui/components/InputBox/InputBox";
import { loginFormInitialState } from "@/initialiseData/initialiseData";

import type { FormState } from "@/definitions/formDefinitions";

import styles from "./LoginForm.module.scss";

const LoginForm = ({ closePage }: { closePage: () => void }) => {
  const [formState, formAction, isPending] = useActionState<FormState>(authenticateSignIn, loginFormInitialState);

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
          <Button onClick={() => handleCancel()}>Cancel</Button>
        </div>
        <div className={styles.buttons}>
          <Button form="login-form" type="submit">
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
