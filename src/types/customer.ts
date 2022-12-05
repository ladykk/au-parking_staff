import { WithRef } from "./base";
import { CarWithRef } from "./car";

export type CustomerWithRef = Customer & WithRef<Customer>;

export type Customer = {
  uid: string;
  displayName: string;
  photoUrl: string | null;
};

export type CustomerWithCarRef = Customer & { cars: Array<CarWithRef> };
