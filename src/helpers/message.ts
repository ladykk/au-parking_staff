import { onMessage } from "firebase/messaging";
import { useEffect } from "react";
import { addMessage } from "../redux/messages";
import { AppDispatch } from "../redux/store";
import { Messages } from "../utils/firebase";

export function useMessages(dispatch: AppDispatch) {
  useEffect(() => {
    onMessage(Messages, (payload) => {
      switch (payload.data?.type) {
        case "report/create":
        case "report/message":
          dispatch(
            addMessage({
              id: payload.data?.id as string,
              type: payload.data?.type,
              title: payload.notification?.title as string,
              body: payload.notification?.body as string,
              rid: payload.data.rid as string,
            })
          );
          break;
        case "call_staff":
          dispatch(
            addMessage({
              id: payload.data?.id as string,
              type: payload.data?.type,
              title: payload.notification?.title as string,
              body: payload.notification?.body as string,
            })
          );
          break;

        default:
          break;
      }
    });
  }, [Messages]);
}
