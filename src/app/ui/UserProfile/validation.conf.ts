import {
  isFieldEmpty,
  isValidEmail,
  isEmailUnusedByOthers,
  isCurrentPassword,
  isMatchingPassword,
} from "@/lib/formValidation/validatorTests";
import { initialFormState } from "@/lib/formValidation/formHelpers";
import type { FormConfig } from "@/definitions/formDefinitions";

const profileFields = {
  forename: {
    tests: [{ test: isFieldEmpty, options: { errorMessage: "Forename is required!" } }],
  },
  surname: {
    tests: [{ test: isFieldEmpty, options: { errorMessage: "Surname is required!" } }],
  },
  email: {
    tests: [
      { test: isFieldEmpty, options: { errorMessage: "Email address is required!" } },
      { test: isValidEmail, options: { errorMessage: "You must enter a valid email address!" } },
      { test: isEmailUnusedByOthers, options: { errorMessage: "That email address is already registered!" } },
    ],
  },
  phone: {
    tests: [{ test: isFieldEmpty, options: { errorMessage: "Phone number is required!" } }],
  },
};

export const profileFormConf: FormConfig<"forename" | "surname" | "email" | "phone"> = {
  config: { initialState: initialFormState(profileFields) },
  fields: profileFields,
};

const passwordFields = {
  currentPassword: {
    tests: [
      { test: isFieldEmpty, options: { errorMessage: "Current password is required!" } },
      { test: isCurrentPassword, options: { errorMessage: "Current password is incorrect" } },
    ],
  },
  newPassword: {
    tests: [{ test: isFieldEmpty, options: { errorMessage: "New password is required!" } }],
  },
  confirmPassword: {
    tests: [
      { test: isFieldEmpty, options: { errorMessage: "Please confirm the new password!" } },
      { test: isMatchingPassword, options: { errorMessage: "New passwords do not match" } },
    ],
  },
};

export const passwordFormConf: FormConfig<"currentPassword" | "newPassword" | "confirmPassword"> = {
  config: { initialState: initialFormState(passwordFields) },
  fields: passwordFields,
};
