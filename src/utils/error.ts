import { Dispatch, SetStateAction } from "react";

export class FormError extends Error {
  errors: any;
  constructor(errors: any) {
    super("Form Error");
    this.errors = errors;
  }
}

export const handleFormError = (
  e: any,
  attributes: string[],
  setError: Dispatch<SetStateAction<any>>
) => {
  if (e instanceof FormError) {
    const filteredErrors: { [index: string]: string } = {};
    attributes.forEach((attribute) => {
      if (e.errors[attribute]) filteredErrors[attribute] = e.errors[attribute];
    });
    setError((errors: any) => ({
      ...errors,
      ...filteredErrors,
    }));
  }
};

export const handleHelperError = (from: string, e: any) =>
  console.error({ type: "helper", from: from, error: e });
