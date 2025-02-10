"use client";

import { useEffect, useState } from "react";
import { animated, useSpring, useSpringRef } from "@react-spring/web";

import LoginForm from "@/ui/login/LoginForm";
import LogoIcon from "@/assets/logoNoName.svg";

import { modalAppear as springsConfig } from "@/style/springsConfig";
import styles from "./page.module.scss";

const LoginPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const api = useSpringRef();

  const springs = useSpring({
    ref: api,
    from: {
      transform: "scale(0)",
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    api.start({
      to: {
        transform: isMounted ? "scale(1)" : "scale(0)",
      },
      config: {
        ...springsConfig,
        clamp: !isMounted,
      },
    });
  }, [api, isMounted]);

  return (
    <main className={styles.root}>
      <animated.div className={`${styles.modal} ${!isMounted ? ` ${styles.transparent}` : ""}`} style={{ ...springs }}>
        <div className={styles.loginContainer}>
          <div className={styles.logoContainer}>
            <LogoIcon className={styles.logo} height="48px" />
          </div>
          <div className={styles.formContainer}>
            <LoginForm
              closePage={() => {
                setIsMounted(false);
              }}
            />
          </div>
        </div>
      </animated.div>
      {/* <button onClick={() => setIsMounted(!isMounted)} style={{ marginTop: "2rem" }}>
        Test Me
      </button> */}
    </main>
  );
};

export default LoginPage;
