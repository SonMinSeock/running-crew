import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  userId: string;
  userName: string;
  photoUrl?: string;
  provider: string;
}

const initialState: UserState = {
  userId: "",
  userName: "",
  photoUrl: "",
  provider: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
      state.photoUrl = action.payload.photoUrl;
      state.provider = action.payload.provider;
    },
    clearUser(state) {
      state.userId = "";
      state.userName = "";
      state.photoUrl = "";
      state.provider = "";
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
