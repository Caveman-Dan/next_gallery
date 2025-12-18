import type { ValidatorOptions } from "@/definitions/formDefinitions";

export const isFieldEmpty = (value: string, { error }: ValidatorOptions) => {
  if (!value) {
    return {
      value,
      error: true,
      message: error,
    };
  } else {
    return {
      value,
      error: false,
      message: "",
    };
  }
};
