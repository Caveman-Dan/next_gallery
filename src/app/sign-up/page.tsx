import signupFormConf from "@/ui/sign-up/validation.conf";

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
          <SignupForm initialState={signupFormConf.config.initialState} />
        </div>
      </div>
    </MountAnimation>
  );
};

export default SignupPage;
