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
import customerReducer from "./slices/customerSlice";
import supportTicketReducer from "./slices/supportTicketSlice"
import employeeReducer from "./slices/employeeSlice";
import jobTitleReducer from "./slices/jobTitleSlice";
import notificationsReducer from "./slices/notificationsSlice";
import departmentReducer from "./slices/departmentSlice";
import vendorReducer from "./slices/vendorSlice";
import posReducer from "./slices/posSlice";
import membershipTierReducer from "./slices/membershipTierSlice";

export default configureStore({
  reducer: {
    companies: companyReducer,
    customers: customerReducer,
    department: departmentReducer,
    employee: employeeReducer,
    jobTitle: jobTitleReducer,
    membershipTiers: membershipTierReducer,
    notifications: notificationsReducer,
    products: productReducer,
    prodFields: prodFieldReducer,
    procurements: procurementReducer,
    promotions: promotionsReducer,
    sites: siteReducer,
    user: userReducer,
    stocklevel: stocklevelReducer,
    stocktransfer: stocktransferReducer,
    supportTickets: supportTicketReducer,
    vendors: vendorReducer,
    vouchers: voucherReducer,
    pos: posReducer,
  },
});
