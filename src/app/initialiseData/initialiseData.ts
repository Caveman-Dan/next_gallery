import { FormState, InputState } from "@/definitions/formDefinitions";

export const inputInitialState: InputState = {
  value: "",
  errors: false,
  messages: [],
};

export const loginFormInitialState: FormState = {
  email: inputInitialState,
  pwd: inputInitialState,
};
