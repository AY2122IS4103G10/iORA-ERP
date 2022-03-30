import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import listingReducer from "./slices/listingSlice";
import cartReducer from "./slices/cartSlice";
import purchasesReducer from "./slices/purchasesSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    listing: listingReducer,
    cart: cartReducer,
    purchases: purchasesReducer,
  },
});
