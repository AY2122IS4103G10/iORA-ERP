import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import productReducer from "./slices/productSlice";
import prodFieldReducer from "./slices/prodFieldSlice";
import procurementReducer from "./slices/procurementSlice";
import promotionsReducer from "./slices/promotionsSlice";
import siteReducer from "./slices/siteSlice";
import stocklevelReducer from "./slices/stocklevelSlice";
import stocktransferReducer from "./slices/stocktransferSlice";
import voucherReducer from "./slices/voucherSlice";
import companyReducer from "./slices/companySlice";
import employeeReducer from "./slices/employeeSlice";
import jobTitleReducer from "./slices/jobTitleSlice";
import departmentReducer from "./slices/departmentSlice";
import vendorReducer from "./slices/vendorSlice";
import posReducer from "./slices/posSlice";

export default configureStore({
  reducer: {
    companies: companyReducer,
    employee: employeeReducer,
    jobTitle: jobTitleReducer,
    department: departmentReducer,
    products: productReducer,
    prodFields: prodFieldReducer,
    procurements: procurementReducer,
    promotions: promotionsReducer,
    sites: siteReducer,
    user: userReducer,
    stocklevel: stocklevelReducer,
    stocktransfer: stocktransferReducer,
    vendors: vendorReducer,
    vouchers: voucherReducer,
    pos: posReducer,
  },
});
