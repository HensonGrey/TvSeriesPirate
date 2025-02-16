import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ShowProps {
  showId: number;
  showType: string;
  imagePath: string | null;
  showTitle: string;
}

const initialState: ShowProps[] = [];

const WatchListSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    setFavourites: (state, action: PayloadAction<ShowProps[]>) => {
      return action.payload;
    },
    addFavourite: (state, action: PayloadAction<ShowProps>) => {
      state.push(action.payload);
    },
    removeFavourite: (state, action: PayloadAction<number>) => {
      return state.filter((show) => show.showId !== action.payload);
    },
  },
});

export const { setFavourites, addFavourite, removeFavourite } =
  WatchListSlice.actions;
export default WatchListSlice.reducer;
