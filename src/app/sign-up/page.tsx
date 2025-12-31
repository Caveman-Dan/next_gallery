"use client";

import MountAnimation from "@/ui/components/MountAnimation/MountAnimation";
import LogoIcon from "@/assets/logoNoName.svg";
import SignupForm from "@/ui/sign-up/SignupForm";

import { loginTransition } from "@/ui/components/MountAnimation/MountAnimationConfig";

import styles from "./page.module.scss";

const SignupPage = () => {
  return (
    <MountAnimation mountAnimationConf={loginTransition}>
      <div className={styles.root}>
        <div className={styles.logoContainer}>
          <LogoIcon className={styles.logo} height="48px" />
        </div>
        <div className={styles.formContainer}>
          <SignupForm />
        </div>
      </div>
    </MountAnimation>
  );
};

export default SignupPage;
