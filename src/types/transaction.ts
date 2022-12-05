import { DocumentReference, Timestamp } from "firebase/firestore";
import { WithRef } from "./base";
import { Staff } from "./staff";

export type TransactionStatus = "Unpaid" | "Paid" | "Cancel" | undefined;

export type TransactionWithRef = Transaction & WithRef<Transaction>;

export type Transaction = {
  [index: string]: any;
  tid: string;
  license_number: string;
  timestamp_in: Timestamp;
  image_in?: string;
  fee: number;
  status: TransactionStatus;
  paid: number;
  timestamp_out: Timestamp | null;
  image_out?: string;
  remark?: string;
  add_by?: DocumentReference<Staff>;
  is_overnight?: boolean;
  is_cancel?: boolean;
  is_edit?: boolean;
};

export type AddTransactionForm = {
  mannual: boolean;
  license_number: string;
  timestamp_in: string;
  image_in: File | null;
  add_by?: string;
};

export type AddTransactionErrors = {
  [index: string]: string;
  license_number: string;
  timestamp_in: string;
  image_in: string;
  form: string;
};

export type NewTransaction = {
  [index: string]: string | Timestamp | undefined;
  license_number: string;
  timestamp_in: Timestamp;
  image_in?: string;
  add_by: string;
};

export type EditTransaction = {
  [index: string]: string | Timestamp | undefined;
  license_number?: string;
  timestamp_in?: Timestamp;
  timestamp_out?: Timestamp;
  image_in?: string;
  image_out?: string;
  remark?: string;
};

export type EditTransactionForm = {
  [index: string]: string | File | null;
  license_number: string;
  timestamp_in: string;
  timestamp_out: string;
  image_in: File | null;
  image_out: File | null;
  remark: string;
};

export type EditTransactionErrors = {
  [index: string]: string;
  license_number: string;
  timestamp_in: string;
  timestamp_out: string;
  image_in: string;
  image_out: string;
  remark: string;
  form: string;
};

export type CancelTransactionErrors = {
  [index: string]: string;
  form: string;
};
