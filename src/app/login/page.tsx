"use client";

import MountAnimation from "@/ui/MountAnimation/MountAnimation";
import { modalAppear as springsConfig } from "@/style/springsConfig";

import LoginForm from "@/ui/login/LoginForm";

const LoginPage = () => {
  return (
    <MountAnimation springsConfOpen={springsConfig.open} springsConfClose={springsConfig.close}>
      <LoginForm />
    </MountAnimation>
  );
};

export default LoginPage;
