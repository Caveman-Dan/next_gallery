"use server";

import { handleServerError } from "../errorHandling";
import type { FormValues, FormConfig, FormState, FieldConfig, InputTest } from "@/definitions/formDefinitions";

export const validateForm = async (formValues: FormValues, formConfig: FormConfig): Promise<FormState> => {
  const newFormState = JSON.parse(JSON.stringify(formConfig.config.initialState));

  Object.keys(formValues).forEach(async (field) => {
    const fieldConfig: FieldConfig = formConfig.fields[field];
    if (!fieldConfig) {
      handleServerError({ message: "Form submission not configured correctly!" });
    } else {
      for (const test of fieldConfig.tests ?? []) {
        if (newFormState[field].errors) break;
        const testResult: InputTest = await test.test(formValues[field], test.options, formValues);
        newFormState[field].value = testResult.value;
        if (!newFormState[field].errors) newFormState[field].errors = testResult.error;
        if (testResult.message && testResult.message.length > 0) newFormState[field].messages?.push(testResult.message);
      }
    }
  });

  return newFormState;
};
