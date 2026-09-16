"use client";

import { useActionState } from "react";
import { changePassword } from "@/lib/serverActions";
import Button from "@/ui/components/Button/Button";
import InputBox from "@/ui/components/InputBox/InputBox";
import type { FormState } from "@/definitions/formDefinitions";

const PasswordForm = ({ initialState }: { initialState: FormState }) => {
  const [formState, formAction] = useActionState<FormState>(changePassword, initialState);

  return (
    <form action={formAction} noValidate>
      <InputBox
        inputState={formState.currentPassword}
        label="Current password"
        name="currentPassword"
        type="password"
      />
      <InputBox inputState={formState.newPassword} label="New password" name="newPassword" type="password" />
      <InputBox
        inputState={formState.confirmPassword}
        label="Confirm new password"
        name="confirmPassword"
        type="password"
      />
      <Button type="submit">Change password</Button>
    </form>
  );
};

export default PasswordForm;
