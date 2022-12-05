import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../types/messages";
import { getUpdateTime } from "../utils/datetime";
import { RootState } from "./store";
import moment from "moment-timezone";

type State = {
  [index: string]: string | Array<Message>;
  updateTime: string;
  messages: Array<Message>;
};

const initialState: State = {
  updateTime: getUpdateTime(),
  messages: [],
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState: initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      console.log(action.payload.id);
      if (
        state.messages.find((message) => message.body === action.payload.body)
      )
        return state;

      let message: Message = {
        ...action.payload,
        timestamp: moment(),
      };

      const old_message = state.messages.find(
        (old_message) =>
          old_message.type === "report/message" &&
          message.type === "report/message" &&
          old_message.rid === message.rid
      );

      let messages = old_message
        ? state.messages.filter((message) => message.id !== old_message.id)
        : state.messages;

      return (state = {
        ...state,
        messages: [message, ...messages],
        updateTime: getUpdateTime(),
      });
    },
    clearMessage: (state, action: PayloadAction<string | undefined>) => {
      return (state = {
        ...state,
        messages: state.messages.filter(
          (message) => message.id !== action.payload
        ),
      });
    },
    clearAllMessages: (state) => {
      return (state = {
        ...state,
        messages: [],
      });
    },
  },
});

export const { addMessage, clearMessage, clearAllMessages } =
  messagesSlice.actions;
export default messagesSlice.reducer;

export const selectMessages = (state: RootState) => state.messages.messages;
export const selectMessagesUpdateTime = (state: RootState) =>
  state.messages.updateTime;
