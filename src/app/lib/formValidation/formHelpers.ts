import type { FieldConfig, FormConfig, FormState, FormValues, InputState } from "@/definitions/formDefinitions";

export const inputInitialState: InputState = {
  value: "",
  errors: false,
  messages: [],
};

export const initialFormState = (fields: Record<string, FieldConfig>): FormState =>
  Object.fromEntries(Object.keys(fields).map((name) => [name, { ...inputInitialState }]));

export const readFormValues = (formData: FormData | undefined, formConfig: FormConfig): FormValues =>
  Object.fromEntries(Object.keys(formConfig.fields).map((name) => [name, String(formData?.get(name) ?? "")]));
