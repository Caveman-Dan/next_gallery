export type InputState = {
  value: string;
  errors: boolean;
  messages?: string[];
};

export type InputTest = {
  value: string;
  error: boolean;
  message?: string;
};

export type FormState = {
  [key: string]: InputState;
};

export type FormValues = { [key: string]: string };

export type ValidatorOptions = {
  errorMessage: string;
  // extend as needed
};

export type ValidatorTest = (value: string, options: ValidatorOptions) => InputTest;

export type FieldTest = {
  test: ValidatorTest;
  options: ValidatorOptions;
};

export type FieldConfig = {
  isRequired?: boolean; // optional, defaults to false if omitted
  tests?: FieldTest[];
};

export type FieldsConfig = {
  [key: string]: FieldConfig;
};

export type FormConfig = {
  config: {
    initialState: FormState;
  };
  fields: FieldsConfig;
};
