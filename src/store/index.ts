import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../store/slices/user-slice";

const store = configureStore({
  reducer: {
    userSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
