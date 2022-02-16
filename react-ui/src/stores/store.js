import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import productReducer from './slices/productSlice';
import prodFieldReducer from "./slices/prodFieldSlice";
import voucherReducer from "./slices/voucherSlice";
import siteReducer from "./slices/siteSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    prodFields: prodFieldReducer,
    vouchers: voucherReducer,
    sites: siteReducer,
  }
})