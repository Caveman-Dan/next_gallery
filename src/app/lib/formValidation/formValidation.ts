import type { FormValues, FormConfig, FormState, FieldConfig } from "@/definitions/formDefinitions";

export const validateForm = (formValues: FormValues, formConfig: FormConfig): FormState => {
  console.log(`HERE: ${JSON.stringify(formConfig.config.initialState)}`);
  let newFormState = JSON.parse(JSON.stringify(formConfig.config.initialState));

  Object.keys(formValues).forEach((field) => {
    const fieldConfig: FieldConfig = formConfig.fields[field];
    if (!fieldConfig) {
      throw Error("Form submission not configured correctly!");
    } else {
      fieldConfig.tests!.forEach((test) => {
        newFormState[field] = test.test(formValues[field], test.options);
      });
    }
  });

  return newFormState;
};
