import { FormState } from "@/definitions/formDefinitions";

export const loginFormInitialState: FormState = {
  email: {
    value: "",
    error: false,
    message: "",
  },
  pwd: {
    value: "",
    error: false,
    message: "",
  },
};
