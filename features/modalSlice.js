import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    postStoriesModal: false,
    viewStoriesModal: false,
    menuModal: false,
    postImageModal: false,
  },
  reducers: {
    openpostStoriesModal: (state) => {
      state.postStoriesModal = true;
    },
    closepostSotryModal: (state) => {
      state.postStoriesModal = false;
    },
    openviewStoriesModal: (state) => {
      state.viewStoriesModal = true;
    },
    closeviewStoriesModal: (state) => {
      state.viewStoriesModal = false;
    },
    openMenuModal: (state) => {
      state.menuModal = true;
    },
    closemenuModal: (state) => {
      state.menuModal = false;
    },
    openPostImageModal: (state) => {
      state.postImageModal = true;
    },
    closePostImageModal: (state) => {
      state.postImageModal = false;
    },
  },
});

export const {
  openpostStoriesModal,
  closepostSotryModal,
  openviewStoriesModal,
  closeviewStoriesModal,
  openMenuModal,
  closemenuModal,
  openPostImageModal,
  closePostImageModal,
} = modalSlice.actions;

export const selectPostStoriesModalIsOpen = (state) =>
  state.modal.postStoriesModal;

export const selectViewStoriesModalIsOpen = (state) =>
  state.modal.viewStoriesModal;

export const selectMenuModalIsOpen = (state) => state.modal.menuModal;

export const selectPostImageModalIsOpen = (state) => state.modal.postImageModal;

export default modalSlice.reducer;
