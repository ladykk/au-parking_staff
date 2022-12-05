import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { TransactionWithRef } from "../types/transaction";
import { getUpdateTime } from "../utils/datetime";

type State = {
  updateTime: string;
  transactions: Array<TransactionWithRef>;
};

const initialState: State = {
  updateTime: "Updating...",
  transactions: [],
};

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState: initialState,
  reducers: {
    setTransactions: (
      state,
      action: PayloadAction<Array<TransactionWithRef>>
    ) => {
      return (state = {
        ...state,
        transactions: action.payload,
        updateTime: getUpdateTime(),
      });
    },

    clearTransactions: (state) => {
      state = initialState;
      return state;
    },
  },
});

export const { setTransactions, clearTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;

export const selectTransactions = (state: RootState) =>
  state.transactions.transactions;
export const selectTransactionsUpdateTime = (state: RootState) =>
  state.transactions.updateTime;
