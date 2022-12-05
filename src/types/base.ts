import { DocumentReference } from "firebase/firestore";

export interface WithRef<T> {
  _ref: DocumentReference<T>;
}

export type FormErrorType = {
  form: string;
};
