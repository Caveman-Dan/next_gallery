"use server";

import { handleServerError } from "../errorHandling";
import type { FormValues, FormConfig, FormState, FieldConfig, InputTest } from "@/definitions/formDefinitions";

export const validateForm = async (formValues: FormValues, formConfig: FormConfig): Promise<FormState> => {
  let newFormState = JSON.parse(JSON.stringify(formConfig.config.initialState));

  Object.keys(formValues).forEach((field) => {
    const fieldConfig: FieldConfig = formConfig.fields[field];
    if (!fieldConfig) {
      handleServerError({ message: "Form submission not configured correctly!" });
      // throw Error("Form submission not configured correctly!");
    } else {
      fieldConfig.tests!.forEach((test) => {
        const testResult: InputTest = test.test(formValues[field], test.options);
        newFormState[field].value = testResult.value;
        if (!newFormState[field].errors) newFormState[field].errors = testResult.error;
        if (testResult.message && testResult.message.length > 0) newFormState[field].messages?.push(testResult.message);
      });
    }
  });

  return newFormState;
};
