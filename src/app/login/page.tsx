"use client";

import MountAnimation from "@/ui/MountAnimation/MountAnimation";
import { modalAppear as springsConfig } from "@/style/springsConfig";

import LoginForm from "@/ui/login/LoginForm";
import LogoIcon from "@/assets/logoNoName.svg";

import styles from "./page.module.scss";

const LoginPage = () => {
  return (
    <MountAnimation springsConfOpen={springsConfig.open} springsConfClose={springsConfig.close}>
      <div className={styles.loginContainer}>
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
