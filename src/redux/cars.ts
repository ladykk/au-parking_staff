import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { CarWithRef } from "../types/car";
import { getUpdateTime } from "../utils/datetime";

type State = {
  [index: string]: boolean | string | Array<CarWithRef>;
  updateTime: string;
  cars: Array<CarWithRef>;
};

const initialState: State = {
  updateTime: "Updating...",
  cars: [],
};

export const carsSlice = createSlice({
  name: "cars",
  initialState: initialState,
  reducers: {
    setCars: (state, action: PayloadAction<Array<CarWithRef>>) => {
      return (state = {
        ...state,
        cars: action.payload,
        updateTime: getUpdateTime(),
      });
    },

    clearCars: (state) => {
      return (state = initialState);
    },
  },
});

export const { setCars, clearCars } = carsSlice.actions;
export default carsSlice.reducer;

export const selectCars = (state: RootState) => state.cars.cars;
export const selectCarsUpdateTime = (state: RootState) => state.cars.updateTime;
