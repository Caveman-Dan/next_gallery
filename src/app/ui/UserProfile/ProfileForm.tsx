"use client";

import { useActionState } from "react";
import { updateProfile } from "@/lib/serverActions";
import Button from "@/ui/components/Button/Button";
import InputBox from "@/ui/components/InputBox/InputBox";
import type { FormState } from "@/definitions/formDefinitions";

const ProfileForm = ({ initialState }: { initialState: FormState }) => {
  const [formState, formAction] = useActionState<FormState>(updateProfile, initialState);

  return (
    <form action={formAction} noValidate>
      <InputBox inputState={formState.forename} label="Forename" name="forename" type="text" />
      <InputBox inputState={formState.surname} label="Surname" name="surname" type="text" />
      <InputBox inputState={formState.email} label="Email" name="email" type="email" />
      <InputBox inputState={formState.phone} label="Phone" name="phone" type="text" />
      <Button type="submit">Save profile</Button>
    </form>
  );
};

export default ProfileForm;
