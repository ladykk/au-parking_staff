import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { CustomerWithRef } from "../types/customer";
import { getUpdateTime } from "../utils/datetime";

type State = {
  [index: string]: boolean | string | Array<CustomerWithRef>;
  updateTime: string;
  customers: Array<CustomerWithRef>;
};

const initialState: State = {
  updateTime: "Updating...",
  customers: [],
};

export const customerSlice = createSlice({
  name: "customers",
  initialState: initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<Array<CustomerWithRef>>) => {
      return (state = {
        ...state,
        customers: action.payload,
        updateTime: getUpdateTime(),
      });
    },
    clearCustomers: (state) => {
      return (state = initialState);
    },
  },
});

export const { setCustomers, clearCustomers } = customerSlice.actions;
export default customerSlice.reducer;

export const selectCustomers = (state: RootState) => state.customers.customers;
export const selectCustomersUpdateTime = (state: RootState) =>
  state.customers.updateTime;
