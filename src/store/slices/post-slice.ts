import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PostState {
  id?: string;
  userId: string;
  username: string;
  photoUrl?: string;
  title: string;
  description: string;
  runningDate: string;
  imgUrl?: string;
  createdAt?: number;
}

interface IinitialState {
  posts: PostState[];
  post: PostState | null;
}

const initialState: IinitialState = {
  posts: [],
  post: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<PostState[]>) {
      state.posts = action.payload;
    },
    setPost(state, action: PayloadAction<PostState>) {
      state.post = action.payload;
    },
    resetPost(state) {
      if (state.post) {
        state.post = null;
      }
    },
  },
});

export const postActions = postSlice.actions;

export default postSlice.reducer;
