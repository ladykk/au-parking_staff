import { FirebaseError } from "firebase/app";
import {
  addDoc,
  collection,
  DocumentData,
  DocumentSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { Firestore } from "../utils/firebase";
import { Chat, Sender, SendImage } from "../types/chat";
import { handleHelperError } from "../utils/error";

// [Model]
// M - Model chat.
export const modelChat = (doc: DocumentSnapshot<DocumentData>): Chat => {
  const data = doc.data() as Chat;
  return { _ref: doc.ref, ...data };
};

// [Functions]
// F - Send message.
export const sendReportMessage = async (
  rid: string,
  sender: Sender,
  message: string
) => {
  const payload: Chat = {
    source: "response",
    timestamp: serverTimestamp(),
    message: {
      type: "text",
      text: message,
      sender: sender,
    },
  };
  await addDoc(collection(Firestore, "reports", rid, "chats"), payload).catch(
    (err) => {
      handleHelperError("claimReport", err);
      throw new Error(
        `Cannot send message.${
          err instanceof FirebaseError ? ` (${err.message})` : ""
        }`
      );
    }
  );
};

// F - Send image.
export const sendReportImage = async (
  rid: string,
  sender: Sender,
  image: SendImage
) => {
  const payload: Chat = {
    source: "response",
    timestamp: serverTimestamp(),
    message: {
      type: "image",
      ...image,
      sender: sender,
    },
  };
  await addDoc(collection(Firestore, "reports", rid, "chats"), payload).catch(
    (err) => {
      handleHelperError("claimReport", err);
      throw new Error(
        `Cannot send message.${
          err instanceof FirebaseError ? ` (${err.message})` : ""
        }`
      );
    }
  );
};
