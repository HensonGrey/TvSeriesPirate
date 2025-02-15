import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: number[] = [];

const WatchListSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    setFavourites: (state, action: PayloadAction<number[]>) => {
      return action.payload;
    },
    addFavourite: (state, action: PayloadAction<number>) => {
      state.push(action.payload);
    },
    removeFavourite: (state, action: PayloadAction<number>) => {
      return state.filter((id) => id !== action.payload);
    },
  },
});

export const { setFavourites, addFavourite, removeFavourite } =
  WatchListSlice.actions;
export default WatchListSlice.reducer;
