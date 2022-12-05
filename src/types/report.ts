import { DocumentReference, Timestamp } from "firebase/firestore";
import { WithRef } from "./base";
import { Customer } from "./customer";
import { Staff } from "./staff";
import { Transaction } from "./transaction";

export type ReportStatus = "Pending" | "Open" | "Closed";

export type ReportTopic = "Transaction" | "Payment" | "System Fault" | "Others";

export type ReportWithRef = Report & WithRef<Report>;

export type Report = {
  rid: string;
  topic: ReportTopic;
  description: string;
  customer: DocumentReference<Customer>;
  created_timestamp: Timestamp;
  status: ReportStatus;
  t_ref?: DocumentReference<Transaction>;
  staff: DocumentReference<Staff> | null;
  closed_timestamp: Timestamp | null;
  response: string | null;
  is_edit?: boolean;
};

export type CreateReport = {
  topic: string;
  description: string;
  customer: DocumentReference<Customer>;
  t_ref?: DocumentReference<Transaction>;
};

export type CreateReportForm = {
  [index: string]: string | undefined;
  topic: string;
  description: string;
  customer?: string;
  t_ref?: string;
};

export type CreateReportError = {
  [index: string]: string;
  topic: string;
  description: string;
  t_ref: string;
  form: string;
};
