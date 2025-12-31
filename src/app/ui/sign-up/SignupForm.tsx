import { useActionState } from "react";
import clsx from "clsx";

import { authenticateSignup } from "@/lib/actions";
import Button from "@/ui/components/Button/Button";
import InputBox from "@/ui/components/InputBox/InputBox";

import { useMountAnimationContext } from "@/ui/components/MountAnimation/MountAnimationContextProvider";

import { signupFormInitialState } from "@/initialiseData/initialiseData";

import styles from "./SignupForm.module.scss";

import type { FormState } from "@/definitions/formDefinitions";

const SignupForm = () => {
  // const [formState, setFormState] = useState(signupFormInitialState);
  const [formState, formAction, isPending] = useActionState<FormState>(authenticateSignup, signupFormInitialState);
  const { closePage } = useMountAnimationContext();

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closePage("/login");
  };

  return (
    <div className={styles.root}>
      <h2>Please enter your details...</h2>
      <form id="signup-form" className={styles.theForm} action={formAction} noValidate>
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
        <button form="signup-form" type="submit" style={{ display: "none" }} /> {/* // This allows enter to submit */}
      </form>
      <div className={styles.buttonsContainer}>
        <div className={styles.buttons}>
          <Button onClick={() => closePage("/gallery")}>Cancel</Button>
        </div>
        <div className={styles.buttons}>
          <Button form="signup-form" type="submit">
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
