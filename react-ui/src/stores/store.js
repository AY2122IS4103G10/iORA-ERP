import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import productReducer from "./slices/productSlice";
import prodFieldReducer from "./slices/prodFieldSlice";
import procurementReducer from "./slices/procurementSlice";
import promotionsReducer from "./slices/promotionsSlice";
import siteReducer from "./slices/siteSlice";
import stocklevelReducer from "./slices/stocklevelSlice";
import voucherReducer from "./slices/voucherSlice";
import companyReducer from "./slices/companySlice"

export default configureStore({
  reducer: {
    companies: companyReducer,
    products: productReducer,
    prodFields: prodFieldReducer,
    procurements: procurementReducer,
    promotions: promotionsReducer,
    sites: siteReducer,
    user: userReducer,
    stocklevel: stocklevelReducer,
    vouchers: voucherReducer,
  },
});
