import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../store/slices/user-slice";
import postSlice from "../store/slices/post-slice";

const store = configureStore({
  reducer: {
    userSlice,
    postSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
