import type { ValidatorOptions } from "@/definitions/formDefinitions";

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
