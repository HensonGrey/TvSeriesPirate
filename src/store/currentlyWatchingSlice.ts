import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentlyWatching {
  showId: number;
  showTitle: string;
  showType: string;
  imagePath: string;
  seasonNum?: number;
  episodeNum?: number;
}

const initialState: CurrentlyWatching[] = [];

const CurrentlyWatchingSlice = createSlice({
  name: "currentlyWatching",
  initialState,
  reducers: {
    setCurrentlyWatchingList: (
      state,
      action: PayloadAction<CurrentlyWatching[]>
    ) => {
      return action.payload;
    },
    addToWatching: (state, action: PayloadAction<CurrentlyWatching>) => {
      state.push(action.payload);
    },
    updateCurrentlyWatching: (
      state,
      action: PayloadAction<{
        showId: number;
        showType: string;
        seasonNum: number;
        episodeNum: number;
      }>
    ) => {
      const { showId, showType, seasonNum, episodeNum } = action.payload;

      const elementToUpdateIndex = state.findIndex(
        (el) => el.showId === showId && el.showType === showType
      );
      if (elementToUpdateIndex === -1)
        throw new Error("Element could not be found!");

      state[elementToUpdateIndex] = {
        ...state[elementToUpdateIndex],
        seasonNum,
        episodeNum,
      };
    },

    removeFromWatching: (state, action: PayloadAction<number>) => {
      return state.filter((show) => show.showId !== action.payload);
    },
  },
});

export const {
  setCurrentlyWatchingList,
  addToWatching,
  updateCurrentlyWatching,
  removeFromWatching,
} = CurrentlyWatchingSlice.actions;
export default CurrentlyWatchingSlice.reducer;
