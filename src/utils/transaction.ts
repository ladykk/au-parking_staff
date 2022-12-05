import { Timestamp } from "firebase/firestore";
import { Moment } from "moment";
import { timestampToMoment } from "./datetime";

export const isValidTimestamp = (
  time_in: Timestamp,
  time_out: Timestamp = Timestamp.now()
): boolean => {
  const timestamp_in = timestampToMoment(time_in) as Moment;
  const timestamp_out = timestampToMoment(time_out) as Moment;
  return timestamp_in.isBefore(timestamp_out);
};
