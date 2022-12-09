import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";

// Reducers
import carsReducer from "./cars";
import customersReducer from "./customers";
import staffsReducer from "./staffs";
import transactionsReducer from "./transactions";

const store = configureStore({
  reducer: {
    cars: carsReducer,
    customers: customersReducer,
    staffs: staffsReducer,
    transactions: transactionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
