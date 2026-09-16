import { isFieldEmpty, isValidEmail, isValidLogin } from "@/lib/formValidation/validatorTests";
import type { FormConfig } from "@/definitions/formDefinitions";
import { initialFormState } from "@/lib/formValidation/formHelpers";

const fields = {
  email: {
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
  password: {
    tests: [
      {
        test: isFieldEmpty,
        options: { errorMessage: "Password is required!" },
      },
      {
        test: isValidLogin,
        options: { errorMessage: "Invalid email or password" },
      },
    ],
  },
};

const loginFormConf: FormConfig = {
  config: {
    initialState: initialFormState(fields),
  },
  fields,
};

export default loginFormConf;
