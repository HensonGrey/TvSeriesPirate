import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import watchListReducer from "./WatchListSlice";
import signedInReducer from "./signedInSlice";
import currentlyWatchingReducer from "./currentlyWatchingSlice";
import persistReducer from "redux-persist/es/persistReducer";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  favourites: watchListReducer,
  signedIn: signedInReducer,
  currentlyWatching: currentlyWatchingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
