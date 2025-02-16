import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: boolean = false;

const signedInSlice = createSlice({
  name: "signedIn",
  initialState,
  reducers: {
    setSignedIn: (state, action: PayloadAction<boolean>) => action.payload,
  },
});

export const { setSignedIn } = signedInSlice.actions;
export default signedInSlice.reducer;
