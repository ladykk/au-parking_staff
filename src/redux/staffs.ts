import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { StaffWithRef } from "../types/staff";
import { getUpdateTime } from "../utils/datetime";

type State = {
  [index: string]: string | Array<StaffWithRef>;
  updateTime: string;
  staffs: Array<StaffWithRef>;
};

const initialState: State = {
  updateTime: "Updating...",
  staffs: [],
};

export const staffSlice = createSlice({
  name: "staffs",
  initialState: initialState,
  reducers: {
    setStaffs: (state, action: PayloadAction<Array<StaffWithRef>>) => {
      return (state = {
        ...state,
        staffs: action.payload,
        updateTime: getUpdateTime(),
      });
    },
    clearStaffs: (state) => {
      state = initialState;
      return state;
    },
  },
});

export const { setStaffs, clearStaffs } = staffSlice.actions;
export default staffSlice.reducer;

export const selectStaffs = (state: RootState) => state.staffs.staffs;
export const selectStaffsUpdateTime = (state: RootState) =>
  state.staffs.updateTime;
