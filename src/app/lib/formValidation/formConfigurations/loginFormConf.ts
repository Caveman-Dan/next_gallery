import { isFieldEmpty } from "../validatorArguments";
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
        },
      ],
    },
    pwd: {
      tests: [
        {
          test: isFieldEmpty,
          options: { error: "Password is required!" },
        },
      ],
    },
  },
};

export default loginFormConf;
