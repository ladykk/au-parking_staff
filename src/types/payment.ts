import { Timestamp, DocumentReference } from "firebase/firestore";
import { FormErrorType, WithRef } from "./base";
import { Customer } from "./customer";

export type PaymentStatus = "Pending" | "Approve" | "Reject" | "Refund";

export type PaymentWithRef = Payment & WithRef<Payment>;

export type Payment = {
  pid: string;
  amount: number;
  timestamp: Timestamp;
  status: PaymentStatus;
  slip: string;
  paid_by?: DocumentReference<Customer>;
};

export type CreatePayment = {
  amount: number;
  slip: string;
  timestamp: Timestamp;
  paid_by?: DocumentReference<Customer>;
};

export type CreatePaymentForm = {
  amount: number;
  slip: File | null;
  timestamp: string;
  paid_by: string;
};

export type CreatePaymentErrors = {
  slip: string;
  timestamp: string;
} & FormErrorType;
