import { createSlice } from "@reduxjs/toolkit";

const state = {
  userId: null,
  nickname: null,
  email: "",
  stateChange: false,
  avatar: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: state,
  reducers: {
    updateUserId(state, { payload }) {
      return {
        ...state,
        userId: payload.userId,
        nickname: payload.nickname,
        email: payload.email,
        avatar: payload.avatar,
      };
    },
    authSetChange(state, { payload }) {
      return { ...state, stateChange: payload.stateChange };
    },
    authReducerSignOut() {
      return state;
    },
    updateUserAvatar(state) {
      return {
        ...state,
        avatar: null,
      };
    },
  },
});

export const {
  updateUserId,
  authSetChange,
  authReducerSignOut,
  updateUserAvatar,
} = authSlice.actions;
