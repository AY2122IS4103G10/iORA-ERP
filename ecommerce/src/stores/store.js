import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import listingReducer from "./slices/listingSlice";
import purchasesReducer from "./slices/purchasesSlice";
import supportTicketReducer from "./slices/supportTicketSlice";
import userReducer from "./slices/userSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    listing: listingReducer,
    cart: cartReducer,
    purchases: purchasesReducer,
    supportTickets: supportTicketReducer,
  },
});
