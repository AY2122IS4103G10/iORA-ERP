import { Routes, Route, Outlet } from "react-router-dom";
import { PrivateRoute } from "./routes/PrivateRoute.js";
import { SMIndex } from "./views/containers/Index/SMIndex";
import { AdminIndex } from "./views/containers/Index/AdminIndex";
import { MFIndex } from "./views/containers/Index/MFIndex";
import { WHIndex } from "./views/containers/Index/WHIndex";
import { ManageProducts } from "./views/containers/Products/ManageProducts";
import { ProductForm } from "./views/containers/Products/ProductForm";
import { ProductDetails } from "./views/containers/Products/ProductDetails";
import { ViewStockLevels } from "./views/containers/StockLevels/ManageStockLevels";
import { Login } from "./views/containers/Auth/Login";
import { Home } from "./views/containers/Auth/Home";
import { HomeIndex } from "./views/containers/Index/HomeIndex";
import { ManageVouchers } from "./views/containers/Vouchers/ManageVouchers";
import { VoucherForm } from "./views/containers/Vouchers/VoucherForm";
import { VoucherDetails } from "./views/containers/Vouchers/VoucherDetails/index.js";
import { StoreIndex } from "./views/containers/Index/Store";
import { SMRoute } from "./routes/SMRoute";
import { ManagePromotions } from "./views/containers/Promotions/ManagePromotions";
import { ADRoute } from "./routes/ADRoute";
import { ManageSites } from "./views/containers/Sites/ManageSites";
import { SiteForm } from "./views/containers/Sites/SiteForm";
import { ManageCompanies } from "./views/containers/Companies/ManageCompanies";
import { ManageProcurement } from "./views/containers/Procurement/ManageProcurement";
import { ProcurementForm } from "./views/containers/Procurement/ProcurementForm";
import { CompanyForm } from "./views/containers/Companies/CompanyForm";
import { SiteDetails } from "./views/containers/Sites/SiteDetails";
import { ViewStoreStock } from "./views/containers/StockLevels/ManageStoreStock";
import { ManageStockTransfer } from "./views/containers/StockTransfer/ManageStockTransfer";
import { StockTransferForm } from "./views/containers/StockTransfer/StockTransferForm";
import { CompanyDetails } from "./views/containers/Companies/CompanyDetails";
import { ProcurementDetails } from "./views/containers/Procurement/ProcurementDetails";
import { ManageEmployee } from "./views/containers/Employee/ManageEmployee";
import { EmployeeForm } from "./views/containers/Employee/CreateEmployeeForm";
import { EmployeeDetails } from "./views/containers/Employee/EmployeeDetails/index.js";
import { ManageDepartment } from "./views/containers/Department/ManageDepartment";
import { DepartmentForm } from "./views/containers/Department/DepartmentForm";
import { DepartmentDetails } from "./views/containers/Department/DepartmentDetails/index.js";
import { ManageJobTitle } from "./views/containers/JobTitle/ManageJobTitle";
import { JobTitleForm } from "./views/containers/JobTitle/JobTitleForm";
import { JobTitleDetails } from "./views/containers/JobTitle/JobTitleDetails/index.js";
import Error from "./views/containers/Auth/Error";
import { Auth } from "./views/containers/Auth/Auth";
import { PosMain } from "./views/containers/POS/Main";
import { PosOrder } from "./views/containers/POS/Order";
import { StockLevelForm } from "./views/containers/StockLevels/StockLevelForm";
import { ViewStockTransfer } from "./views/containers/StockTransfer/ViewStockTransfer";
import { ManageVendors } from "./views/containers/Vendor/ManageVendors";
import { VendorDetails } from "./views/containers/Vendor/VendorDetails";
import { VendorForm } from "./views/containers/Vendor/VendorForm";
import {Auth} from "./views/containers/Auth/Auth";
import {PosMain} from "./views/containers/POS/Main";
import {PosOrder} from "./views/containers/POS/Order";
import { FrontPage } from "./views/containers/SelfService/FrontPage";
import { Order } from "./views/containers/SelfService/Order";
import {StockLevelForm} from "./views/containers/StockLevels/StockLevelForm";
import {ViewStockTransfer} from "./views/containers/StockTransfer/ViewStockTransfer";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Auth />}>
          {/* Common Infrastructure */}
          <Route index element={<Login />} />
          <Route path="home" element={<HomeIndex />}>
            <Route index element={<Home />} />
          </Route>

          {/* Sales and Marketing Subsystem */}
          <Route
            path="sm"
            element={
              <PrivateRoute>
                <SMRoute>
                  <SMIndex />
                </SMRoute>
              </PrivateRoute>
            }
          >
            <Route path="products" element={<Outlet />}>
              <Route index element={<ManageProducts />} />
              <Route path=":prodCode" element={<ProductDetails />} />
              <Route path="create" element={<ProductForm />} />
              <Route path="edit/:prodId" element={<ProductForm />} />
              <Route path="promotions" element={<ManagePromotions />} />
            </Route>
            <Route
              path="stocklevels/*"
              element={<ViewStockLevels subsys="sm" />}
            />

            <Route path="stocktransfer" element={<Outlet />}>
              <Route index element={<ManageStockTransfer subsys="sm" />} />
              <Route
                path="create"
                element={<StockTransferForm subsys="sm" />}
              />
              <Route path=":id" element={<ViewStockTransfer subsys="sm" />} />
              <Route
                path="edit/:id"
                element={<StockTransferForm subsys="sm" />}
              />
            </Route>

            <Route path="procurements" element={<Outlet />}>
              <Route index element={<ManageProcurement />} />
              <Route path=":procurementId" element={<ProcurementDetails />} />
              <Route path="create" element={<ProcurementForm />} />
              <Route path="edit/:orderId" element={<ProcurementForm />} />
            </Route>
            <Route path="vouchers" element={<Outlet />}>
              <Route index element={<ManageVouchers />} />
              <Route path=":voucherCode" element={<VoucherDetails />} />
              <Route path="create" element={<VoucherForm />} />
              <Route path="edit/:voucherId" element={<VoucherForm />} />
            </Route>
          </Route>

          {/* Store Management Subsystem */}
          <Route
            path="str"
            element={
              <PrivateRoute>
                <StoreIndex />
              </PrivateRoute>
            }
          >
            <Route path="stocklevels/*" element={<ViewStoreStock />} />
            <Route path="stocktransfer" element={<Outlet />}>
              <Route index element={<ManageStockTransfer subsys="str" />} />
              <Route path=":id" element={<ViewStockTransfer subsys="str" />} />
              <Route
                path="edit/:id"
                element={<StockTransferForm subsys="str" />}
              />
            </Route>
          </Route>

          {/* Admin Subsystem */}
          <Route
            path="ad"
            element={
              //Change to admin route
              <PrivateRoute>
                <AdminIndex />
              </PrivateRoute>
              // <ADRoute>
              /* </ADRoute> */
            }
          >
            <Route path="sites" element={<Outlet />}>
              <Route index element={<ManageSites />} />
              <Route path=":siteId" element={<SiteDetails />} />
              <Route path="create" element={<SiteForm />} />
              <Route path="edit/:siteId" element={<SiteForm />} />
            </Route>
            <Route path="companies" element={<Outlet />}>
              <Route index element={<ManageCompanies />} />
              <Route path=":companyId" element={<CompanyDetails />} />
              <Route path="create" element={<CompanyForm />} />
              <Route path="edit/:companyId" element={<CompanyForm />} />
            </Route>
            <Route path="employees" element={<Outlet />}>
              <Route index element={<ManageEmployee />} />
              <Route path=":name" element={<EmployeeDetails />} />
              <Route path="create" element={<EmployeeForm />} />
              <Route path="edit/:employeeId" element={<EmployeeForm />} />
            </Route>
            <Route path="jobTitles" element={<Outlet />}>
              <Route index element={<ManageJobTitle />} />
              <Route path=":title" element={<JobTitleDetails />} />
              <Route path="create" element={<JobTitleForm />} />
              <Route path="edit/:jobTitleId" element={<JobTitleForm />} />
            </Route>
            <Route path="departments" element={<Outlet />}>
              <Route index element={<ManageDepartment />} />
              <Route path=":name" element={<DepartmentDetails />} />
              <Route path="create" element={<DepartmentForm />} />
              <Route path="edit/:departmentId" element={<DepartmentForm />} />
            </Route>
            <Route path="vendors" element={<Outlet />}>
              <Route index element={<ManageVendors />} />
              <Route path=":vendorId" element={<VendorDetails />} />
              <Route path="create" element={<VendorForm />} />
              <Route path="edit/:vendorId" element={<VendorForm />} />
            </Route>
          </Route>

          {/* Manufacturing Subsystem*/}
          <Route
            path="mf"
            element={
              <PrivateRoute>
                <MFIndex />
              </PrivateRoute>
            }
          >
            <Route path="procurements" element={<Outlet />}>
              <Route index element={<ManageProcurement />} />
              <Route path=":procurementId" element={<ProcurementDetails />} />
              <Route path="create" element={<ProcurementForm />} />
              <Route path="edit/:orderId" element={<VoucherForm />} />
            </Route>
          </Route>

          {/* Warehouse Subsystem */}
          <Route
            path="wh"
            element={
              <PrivateRoute>
                <WHIndex />
              </PrivateRoute>
            }
          >
            <Route
              path="stocklevels/*"
              element={<ViewStoreStock subsys="wh" />}
            />
            <Route path="procurements" element={<Outlet />}>
              <Route index element={<ManageProcurement />} />
              <Route path=":procurementId" element={<ProcurementDetails />} />
              <Route path="create" element={<ProcurementForm />} />
              <Route path="edit/:orderId" element={<VoucherForm />} />
            </Route>

            <Route path="stocktransfer" element={<Outlet />}>
              <Route index element={<ManageStockTransfer subsys="wh" />} />
              <Route path=":id" element={<ViewStockTransfer subsys="wh" />} />
              <Route
                path="edit/:id"
                element={<StockTransferForm subsys="wh" />}
              />
            </Route>
          </Route>
        </Route>

        {/* Self Service Kiosk*/}
        <Route path="ss" element={<Outlet />}>
          <Route index element={<FrontPage />} />
          <Route path="order" element={<Order />} />
        </Route>

        <Route path="*" element={<Error />} />

        {/* POS */}
        <Route path="pos">
          <Route path="main" element={<PosMain />}></Route>
          <Route path="order" element={<PosOrder />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
