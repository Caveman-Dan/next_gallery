"use client";

import MountAnimation from "@/ui/components/MountAnimation/MountAnimation";
import { loginTransition } from "@/ui/components/MountAnimation/MountAnimationConfig";

import LoginForm from "@/ui/login/LoginForm";
import LogoIcon from "@/assets/logoNoName.svg";

import styles from "./page.module.scss";

const LoginPage = () => {
  return (
    <MountAnimation mountAnimationConf={loginTransition}>
      <div className={styles.root}>
        <div className={styles.logoContainer}>
          <LogoIcon className={styles.logo} height="48px" />
        </div>
        <div className={styles.formContainer}>
          <LoginForm />
        </div>
      </div>
    </MountAnimation>
  );
};

export default LoginPage;
