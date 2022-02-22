import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import productReducer from "./slices/productSlice";
import prodFieldReducer from "./slices/prodFieldSlice";
import procurementReducer from "./slices/procurementSlice";
import promotionsReducer from "./slices/promotionsSlice";
import siteReducer from "./slices/siteSlice";
import stocklevelReducer from "./slices/stocklevelSlice";
import voucherReducer from "./slices/voucherSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    prodFields: prodFieldReducer,
    procurements: procurementReducer,
    promotions: promotionsReducer,
    sites: siteReducer,
    stocklevel: stocklevelReducer,
    vouchers: voucherReducer,
  },
});
