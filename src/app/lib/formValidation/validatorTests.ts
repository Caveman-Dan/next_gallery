import { checkValidEmail } from "./validatorHelpers";
import { getUserByEmail } from "@/lib/db/dbAuthenticate";
import { getPrincipal } from "@/lib/db/dbAccess";
import { verifyPassword } from "@/lib/password";
import type { FormValues, ValidatorOptions } from "@/definitions/formDefinitions";

export const isFieldEmpty = (value: string, { errorMessage }: ValidatorOptions) => {
  if (!value) {
    return {
      value,
      error: true,
      message: errorMessage,
    };
  } else {
    return {
      value,
      error: false,
      message: "",
    };
  }
};

export const isValidEmail = (value: string, { errorMessage }: ValidatorOptions) => {
  if (!checkValidEmail(value)) {
    return {
      value,
      error: true,
      message: errorMessage,
    };
  } else {
    return {
      value,
      error: false,
      message: "",
    };
  }
};

export const isValidLogin = async (value: string, { errorMessage }: ValidatorOptions, formValues: FormValues) => {
  const user = await getUserByEmail(formValues.email);
  const passwordOk = user ? await verifyPassword(value, user.password_hash) : false;
  if (!user || !passwordOk || user.status === "disabled") {
    return { value, error: true, message: errorMessage };
  }
  return { value, error: false, message: "" };
};

export const isEmailUnique = async (value: string, { errorMessage }: ValidatorOptions) => {
  const existing = await getUserByEmail(value);
  if (existing) {
    return { value, error: true, message: errorMessage };
  }
  return { value, error: false, message: "" };
};

export const isEmailUnusedByOthers = async (value: string, { errorMessage }: ValidatorOptions) => {
  const principal = await getPrincipal();
  const existing = await getUserByEmail(value);
  if (existing && existing.id !== principal.user?.userId) {
    return { value, error: true, message: errorMessage };
  }
  return { value, error: false, message: "" };
};

export const isCurrentPassword = async (value: string, { errorMessage }: ValidatorOptions) => {
  const principal = await getPrincipal();
  if (!principal.user) {
    return { value, error: true, message: errorMessage };
  }
  const user = await getUserByEmail(principal.user.email);
  const ok = user ? await verifyPassword(value, user.password_hash) : false;
  if (!ok) {
    return { value, error: true, message: errorMessage };
  }
  return { value, error: false, message: "" };
};

export const isMatchingPassword = (value: string, { errorMessage }: ValidatorOptions, formValues: FormValues) => {
  if (value !== formValues.newPassword) {
    return { value, error: true, message: errorMessage };
  }
  return { value, error: false, message: "" };
};
