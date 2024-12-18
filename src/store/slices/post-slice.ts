import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "./user-slice";

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
  participantList: UserState[]; // 참여자 리스트 5명까지 참여가능
  isRunning: boolean;
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
