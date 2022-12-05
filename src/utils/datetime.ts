import { Timestamp } from "firebase/firestore";
import moment, { Moment } from "moment";

const FORMAT = "DD/MM/YYYY HH:mm:ss";
const INPUT_FORMAT = "YYYY-MM-DDTHH:mm:ss";

export const getUpdateTime = (): string => {
  const currentTime = moment();
  return currentTime.format(FORMAT);
};

export const timestampToString = (input: Timestamp | null) => {
  if (!input) return "-";
  else return moment(input.toDate()).format(FORMAT);
};

export const timestampToInput = (input: Timestamp | null) => {
  if (!input) return "";
  else return moment(input.toDate()).format(INPUT_FORMAT);
};

export const timestampToMoment = (
  input: Timestamp | null
): Moment | undefined => {
  if (!input) return undefined;
  else return moment(input.toDate());
};

export const stringToMoment = (input: string) => {
  return moment(input, FORMAT);
};

export const stringToTimestamp = (input: string) => {
  const timestamp = moment(input, FORMAT);
  return Timestamp.fromDate(timestamp.toDate());
};

export const inputToTimestamp = (input: string) => {
  const timestamp = moment(input, INPUT_FORMAT);
  return Timestamp.fromDate(timestamp.toDate());
};

export const inputToMoment = (input: string) => {
  return input ? moment(input, INPUT_FORMAT) : undefined;
};

export const secondsFromNow = (base: string, seconds: number) =>
  Math.floor(
    stringToMoment(base).add(seconds, "seconds").diff(moment()) / 1000
  );

export const momentToUploadString = (input: Moment) =>
  input.format(INPUT_FORMAT);

export const isModuleConnected = (connected_timestamp: string) => {
  return moment(connected_timestamp, FORMAT)
    .add(10, "seconds")
    .isSameOrAfter(moment());
};
