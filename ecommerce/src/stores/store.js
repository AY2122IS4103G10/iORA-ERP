import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import listingReducer from "./slices/listingSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    listing: listingReducer,
  },
});
