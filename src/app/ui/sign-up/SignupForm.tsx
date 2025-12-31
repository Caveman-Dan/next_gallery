import { useState } from "react";
import clsx from "clsx";

import Button from "@/ui/components/Button/Button";
import InputBox from "@/ui/components/InputBox/InputBox";

import { useMountAnimationContext } from "@/ui/components/MountAnimation/MountAnimationContextProvider";

import { signupFormInitialState } from "@/initialiseData/initialiseData";

import styles from "./SignupForm.module.scss";

const SignupForm = () => {
  const [formState, setFormState] = useState(signupFormInitialState);
  const { closePage } = useMountAnimationContext();

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closePage("/login");
  };

  return (
    <div className={styles.root}>
      <h2>Please enter your details...</h2>
      <form className={styles.theForm}>
        <div className={clsx(styles.panels, styles.leftPanel)}>
          <InputBox inputState={formState.forename} label="Forename" name="forename" type="text" />
          <InputBox inputState={formState.surname} label="Surname" name="surname" type="text" />
          <InputBox inputState={formState.username} label="Username" name="username" type="text" />
        </div>
        <div className={clsx(styles.panels, styles.rightPanel)}>
          <InputBox inputState={formState.email} label="Email" name="email" type="email" />
          <InputBox inputState={formState.pwd} label="Password" name="password" type="password" />
          <InputBox inputState={formState.phone} label="Phone" name="phone" type="text" />
        </div>
      </form>
      <div className={styles.buttonsContainer}>
        <div className={styles.buttons}>
          <Button onClick={() => closePage("/gallery")}>Cancel</Button>
        </div>
        <div className={styles.buttons}>
          <Button form="login-form" type="submit">
            Submit
          </Button>
        </div>
      </div>
      <div className={styles.loginAnch}>
        <p>
          Already have an account: <a onClick={handleAnchor}>Login here</a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
