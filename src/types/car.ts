import { WithRef, FormErrorType } from "./base";

export type CarWithRef = Car & WithRef<Car>;

export type Car = {
  license_number: string;
  province: string;
  brand: string;
  color: string;
};

export type AddCarErrors = Car & FormErrorType;
