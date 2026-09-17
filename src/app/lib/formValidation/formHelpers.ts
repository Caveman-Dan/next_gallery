import type { FieldConfig, FormConfig, FormValues, InputState } from "@/definitions/formDefinitions";

export const inputInitialState: InputState = {
  value: "",
  errors: false,
  messages: [],
};

export const initialFormState = <K extends string>(fields: Record<K, FieldConfig>): Record<K, InputState> =>
  Object.fromEntries(Object.keys(fields).map((name) => [name, { ...inputInitialState }])) as Record<K, InputState>;

export const readFormValues = (formData: FormData | undefined, formConfig: FormConfig): FormValues =>
  Object.fromEntries(Object.keys(formConfig.fields).map((name) => [name, String(formData?.get(name) ?? "")]));
