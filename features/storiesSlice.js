import { createSlice } from "@reduxjs/toolkit";

export const storiesSlice = createSlice({
  name: "stories",
  initialState: {
    stories: null,
    viewedStory: null,
  },
  reducers: {
    addStories: (state, action) => {
      state.stories = action.payload;
      state.viewedStory = action.payload;
    },
    updateViewedStory: (state, action) => {
      state.viewedStory = action.payload;
    },
    quitViewedStory: (state) => {
      state.viewedStory = null;
    },
  },
});

export const { updateViewedStory, quitViewedStory } = storiesSlice.actions;

export const allStories = (state) => state.stories.stories;
export const viewStories = (state) => state.stories.viewedStory;

export default storiesSlice.reducer;
