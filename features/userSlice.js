import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    profile: null,
    photosCollection: null,
    followerCount: 0,
    chatlist: null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.profile = null;
      state.photosCollection = null;
      state.followerCount = 0;
      state.chatlist = null;
    },

    addProfile: (state, action) => {
      state.profile = action.payload;
    },
    addPhoto: (state, action) => {
      state.photosCollection = action.payload;
    },

    addChatlist: (state, action) => {
      state.chatlist = action.payload;
    },
  },
});

export const { login, logout, addProfile, addPhoto, addChatlist } =
  userSlice.actions;

export const selectUser = (state) => state.user.user;

export const selectProfile = (state) => state.user.profile;

export const selectPhotos = (state) => state.user.photosCollection;

export const selectChatlist = (state) => state.user.chatlist;

export default userSlice.reducer;
