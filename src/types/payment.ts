import { Timestamp, DocumentReference } from "firebase/firestore";
import { FormErrorType, WithRef } from "./base";
import { Customer } from "./customer";

export type PaymentStatus =
  | "Pending"
  | "Success"
  | "Failed"
  | "Process"
  | "Refund"
  | "Canceled";

export type PaymentWithRef = Payment & WithRef<Payment>;

export type Payment = {
  pid: string;
  client_secret: string;
  amount: number;
  timestamp: Timestamp;
  status: PaymentStatus;
  reason?: string;
  paid_by?: DocumentReference<Customer>;
};
