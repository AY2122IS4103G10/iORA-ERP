import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import productReducer from "./slices/productSlice";
import prodFieldReducer from "./slices/prodFieldSlice";
import promotionsReducer from "./slices/promotionsSlice";
import siteReducer from "./slices/siteSlice";
import voucherReducer from "./slices/voucherSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    prodFields: prodFieldReducer,
    promotions: promotionsReducer,
    sites: siteReducer,
    vouchers: voucherReducer,
  },
});
