import Button from "@/ui/components/Button/Button";
import InputBox from "@/ui/components/InputBox/InputBox";

import { useMountAnimationContext } from "@/ui/components/MountAnimation/MountAnimationContextProvider";

import styles from "./SignupForm.module.scss";

const SignupForm = () => {
  const { closePage } = useMountAnimationContext();

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closePage("/login");
  };

  return (
    <div className={styles.root}>
      <p>Welcome to the Sign-up Page</p>
      <div className={styles.loginAnch}>
        <p>
          Already have an account: <a onClick={handleAnchor}>Login here</a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
