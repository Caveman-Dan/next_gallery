import { isFieldEmpty, isValidEmail } from "../validatorTests";
import { loginFormInitialState } from "@/initialiseData/initialiseData";
import type { FormConfig, FormState } from "@/definitions/formDefinitions";

const loginFormConf: FormConfig = {
  config: {
    initialState: loginFormInitialState,
  },
  fields: {
    email: {
      isRequired: true,
      tests: [
        {
          test: isFieldEmpty,
          options: { errorMessage: "Email address is required!" },
        },
        {
          test: isValidEmail,
          options: { errorMessage: "You must enter a valid email address!" },
        },
      ],
    },
    pwd: {
      tests: [
        {
          test: isFieldEmpty,
          options: { errorMessage: "Password is required!" },
        },
      ],
    },
  },
};

export default loginFormConf;
