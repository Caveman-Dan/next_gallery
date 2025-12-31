import { isFieldEmpty, isValidEmail } from "@/lib/formValidation/validatorTests";
import { signupFormInitialState } from "@/initialiseData/initialiseData";
import type { FormConfig } from "@/definitions/formDefinitions";

const signupFormValidationConf: FormConfig = {
  config: {
    initialState: signupFormInitialState,
  },
  fields: {
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
  },
};

export default signupFormValidationConf;
