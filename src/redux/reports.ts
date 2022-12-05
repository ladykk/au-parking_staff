import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { ReportWithRef } from "../types/report";
import { getUpdateTime } from "../utils/datetime";

type State = {
  updateTime: string;
  reports: Array<ReportWithRef>;
};

const initialState: State = {
  updateTime: "Updating...",
  reports: [],
};

export const reportsSlice = createSlice({
  name: "reports",
  initialState: initialState,
  reducers: {
    setReports: (state, action: PayloadAction<Array<ReportWithRef>>) => {
      return (state = {
        ...state,
        reports: action.payload,
        updateTime: getUpdateTime(),
      });
    },

    clearReports: (state) => {
      state = initialState;
      return state;
    },
  },
});

export const { setReports, clearReports } = reportsSlice.actions;
export default reportsSlice.reducer;

export const selectReports = (state: RootState) => state.reports.reports;
export const selectReportsUpdateTime = (state: RootState) =>
  state.reports.updateTime;
