import { isFieldEmpty, isValidEmail, isEmailUnique } from "@/lib/formValidation/validatorTests";
import type { FormConfig } from "@/definitions/formDefinitions";
import { initialFormState } from "@/lib/formValidation/formHelpers";

const fields = {
  forename: {
    isRequired: true,
    tests: [
      {
        test: isFieldEmpty,
        options: {
          errorMessage: "Forename is required!",
        },
      },
    ],
  },
  surname: {
    isRequired: true,
    tests: [
      {
        test: isFieldEmpty,
        options: {
          errorMessage: "Surname is required!",
        },
      },
    ],
  },
  username: {
    isRequired: true,
    tests: [
      {
        test: isFieldEmpty,
        options: {
          errorMessage: "Username is required!",
        },
      },
    ],
  },
  email: {
    isRequired: true,
    tests: [
      {
        test: isFieldEmpty,
        options: {
          errorMessage: "Email address is required!",
        },
      },
      {
        test: isValidEmail,
        options: { errorMessage: "You must enter a valid email address!" },
      },
      {
        test: isEmailUnique,
        options: { errorMessage: "That email address is already registered!" },
      },
    ],
  },
  pwd: {
    isRequired: true,
    tests: [
      {
        test: isFieldEmpty,
        options: {
          errorMessage: "Password is required!",
        },
      },
    ],
  },
  phone: {
    isRequired: true,
    tests: [
      {
        test: isFieldEmpty,
        options: {
          errorMessage: "Phone number is required!",
        },
      },
    ],
  },
};

const signupFormValidationConf: FormConfig = {
  config: {
    initialState: initialFormState(fields),
  },
  fields,
};

export default signupFormValidationConf;
