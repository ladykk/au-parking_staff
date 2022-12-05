import { Moment } from "moment";

export type Message = ReportMessage | CallStaffMessage;

type MessageBase = {
  id: string;
  title: string;
  body: string;
  timestamp?: Moment;
};

type ReportMessage = MessageBase & {
  type: "report/create" | "report/message";
  rid: string;
};

type CallStaffMessage = MessageBase & {
  type: "call_staff";
};
