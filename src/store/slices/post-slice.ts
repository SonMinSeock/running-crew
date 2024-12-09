import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PostState {
  userId: string;
  photoUrl?: string;
  title: string;
  description: string;
  imgUrl?: string;
  createdAt?: number;
}

const initialState: PostState[] = [];

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost(state, action: PayloadAction<PostState>) {
      state.push(action.payload);
    },
  },
});

export const postActions = postSlice.actions;

export default postSlice.reducer;
