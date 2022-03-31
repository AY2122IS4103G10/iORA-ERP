import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "./slices/companySlice";
import customerReducer from "./slices/customerSlice";
import dashboardReducer from "./slices/dashboardSlice";
import departmentReducer from "./slices/departmentSlice";
import employeeReducer from "./slices/employeeSlice";
import jobTitleReducer from "./slices/jobTitleSlice";
import membershipTierReducer from "./slices/membershipTierSlice";
import notificationsReducer from "./slices/notificationsSlice";
import posReducer from "./slices/posSlice";
import procurementReducer from "./slices/procurementSlice";
import prodFieldReducer from "./slices/prodFieldSlice";
import productReducer from "./slices/productSlice";
import promotionsReducer from "./slices/promotionsSlice";
import siteReducer from "./slices/siteSlice";
import stocklevelReducer from "./slices/stocklevelSlice";
import stocktransferReducer from "./slices/stocktransferSlice";
import supportTicketReducer from "./slices/supportTicketSlice";
import userReducer from "./slices/userSlice";
import vendorReducer from "./slices/vendorSlice";
import voucherReducer from "./slices/voucherSlice";

export default configureStore({
  reducer: {
    companies: companyReducer,
    customers: customerReducer,
    dashboard: dashboardReducer,
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
