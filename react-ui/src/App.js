import { Routes, Route, Outlet } from "react-router-dom";
import { PrivateRoute } from "./routes/PrivateRoute.js";
import { SMIndex } from "./views/containers/Index/SMIndex";
import { AdminIndex } from "./views/containers/Index/AdminIndex";
import { MFIndex } from "./views/containers/Index/MFIndex";
import { WHIndex } from "./views/containers/Index/WHIndex";
import { ManageProducts } from "./views/containers/Products/ManageProducts";
import { ProductForm } from "./views/containers/Products/ProductForm";
import { ProductDetails } from "./views/containers/Products/ProductDetails";
import { SiteStocks } from "./views/containers/StockLevels/BySite/index.js";
import { ProductStocks } from "./views/containers/StockLevels/ByProduct/index.js";
import { AsiteStock } from "./views/containers/StockLevels/ASiteStock/index.js";
import { AProductStock } from "./views/containers/StockLevels/AProductStock/index.js";
import { MyStoreStock } from "./views/containers/StockLevels/StoreStockList/index.js";
import { EditStockLevel } from "./views/containers/StockLevels/EditStockLevel/index.js";
import { Login } from "./views/containers/Auth/Login";
import { Home } from "./views/containers/Auth/Home";
import { HomeIndex } from "./views/containers/Index/HomeIndex";
import { ManageVouchers } from "./views/containers/Vouchers/ManageVouchers";
import { VoucherForm } from "./views/containers/Vouchers/VoucherForm";
import { VoucherDetails } from "./views/containers/Vouchers/VoucherDetails/index.js";
import { StoreIndex } from "./views/containers/Index/StrIndex";
// import { SMRoute } from "./routes/SMRoute";
import { ManagePromotions } from "./views/containers/Promotions/ManagePromotions";
// import { ADRoute } from "./routes/ADRoute";
import { ManageSites } from "./views/containers/Sites/ManageSites";
import { SiteForm } from "./views/containers/Sites/SiteForm";
import { ManageCompanies } from "./views/containers/Companies/ManageCompanies";
import { ManageProcurement } from "./views/containers/Procurement/ManageProcurement";
import { ProcurementForm } from "./views/containers/Procurement/ProcurementForm";
import { CompanyForm } from "./views/containers/Companies/CompanyForm";
import { SiteDetails } from "./views/containers/Sites/SiteDetails";
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
import { ManagePOS } from "./views/containers/POS/ManagePOS";
import { StockLevelForm } from "./views/containers/StockLevels/ProdStockLevelForm";
import { ViewStockTransfer } from "./views/containers/StockTransfer/ViewStockTransfer";
import { ManageVendors } from "./views/containers/Vendor/ManageVendors";
import { VendorDetails } from "./views/containers/Vendor/VendorDetails";
import { VendorForm } from "./views/containers/Vendor/VendorForm";
import { FrontPage } from "./views/containers/SelfService/FrontPage";
import { Order } from "./views/containers/SelfService/Order";
import { ManageCustomer } from "./views/containers/Customer/ManageCustomer";
import { CustomerDetails } from "./views/containers/Customer/CustomerDetails";
import { CustomerForm } from "./views/containers/Customer/CustomerForm";
import { ManageMembershipTier } from "./views/containers/MembershipTier/ManageMembershipTier/index.js";
import { MembershipTierDetails } from "./views/containers/MembershipTier/MembershipTierDetails/index.js";
import { MembershipTierForm } from "./views/containers/MembershipTier/MembershipTierForm/index.js";
import { PosPurchaseHistory } from "./views/containers/POS/PurchaseHistory/index.js";
import { OrderDetails } from "./views/containers/POS/OrderDetails/index.js";
import { PosPurchaseOrder } from "./views/containers/POS/PurchaseOrder/index.js";
import { ProcurementList } from "./views/containers/Procurement/ProcurementList/index.js";
import { useLocation } from "react-router-dom";
import { ProcurementSearch } from "./views/containers/Procurement/ProcurementSearch/index.js";
import { LGIndex } from "./views/containers/Index/LGIndex/index.js";
import { ProductsList } from "./views/containers/Products/ProductsList/index.js";
import { ProductPrint } from "./views/containers/Products/ProductPrint/index.js";
import { ProcurementWrapper } from "./views/containers/Procurement/ProcurementWrapper/index.js";
import { ProcurementPickPack } from "./views/containers/Procurement/ProcurementPickPack/index.js";
import { ManageOnlineOrders } from "./views/containers/OnlineOrder/ManageOnlineOrders/index.js";
import { OnlineOrderList } from "./views/containers/OnlineOrder/OnlineOrderList/index.js";
import { OnlineOrderSearch } from "./views/containers/OnlineOrder/OnlineOrderSearch/index.js";
import { ManageOrders } from "./views/containers/Orders/ManageOrders/index.js";
import { OrderList } from "./views/containers/Orders/OrderList/index.js";
import { OrderSearch } from "./views/containers/Orders/OrderSearch/index.js";
import { CustomerOrderWrapper } from "./views/containers/Orders/CustomerOrderWrapper/index.js";
import { CustomerOrderDetails } from "./views/containers/Orders/CustomerOrderDetails/index.js";
import { StockTransferWrapper } from "./views/containers/StockTransfer/StockTransferWrapper/index.js";
import { StockTransferPickPack } from "./views/containers/StockTransfer/StockTransferPickPack/index.js";
import { StockTransferList } from "./views/containers/StockTransfer/StockTransferList/index.js";
import { StockTransferSearch } from "./views/containers/StockTransfer/StockTransferSearch/index.js";

function App() {
  const { pathname } = useLocation();
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
                <SMIndex />
              </PrivateRoute>
            }
          >
            <Route path="products" element={<Outlet />}>
              <Route
                index
                element={
                  <ManageProducts subsys="sm">
                    <ProductsList />
                  </ManageProducts>
                }
              />
              <Route path=":prodCode" element={<ProductDetails />} />
              <Route path="create" element={<ProductForm />} />
              <Route path="edit/:prodId" element={<ProductForm />} />
              <Route path="promotions" element={<ManagePromotions />} />
            </Route>
            <Route path="stocklevels">
              <Route path="my/:id" element={<StockLevelForm subsys="sm" />} />
              <Route path="my" element={<MyStoreStock subsys="sm" />} />
              <Route path="sites" element={<SiteStocks subsys="sm" />} />
              <Route path="products" element={<ProductStocks subsys="sm" />} />
              <Route path=":id" element={<AsiteStock />} />
              <Route
                path="products/:id"
                element={<AProductStock subsys="sm" />}
              />
            </Route>
            {/* Stock Transfer Orders */}
            <Route path="stocktransfer" element={<Outlet />}>
              <Route
                index
                element={
                  <ManageStockTransfer subsys="sm">
                    <StockTransferList subsys="sm" />
                  </ManageStockTransfer>
                }
              />
              <Route
                path="search"
                element={
                  <ManageStockTransfer subsys="sm">
                    <StockTransferSearch subsys="sm" />
                  </ManageStockTransfer>
                }
              />
              <Route
                path="create"
                element={<StockTransferForm subsys="sm" />}
              />
              <Route path=":id" element={<StockTransferWrapper subsys="sm" />}>
                <Route index element={<ViewStockTransfer subsys="sm" />} />
                <Route path="pick-pack" element={<StockTransferPickPack />} />
              </Route>
              <Route
                path="edit/:id"
                element={<StockTransferForm subsys="sm" />}
              />
            </Route>

            {/* Procurement Orders */}
            <Route path="procurements" element={<Outlet />}>
              <Route
                index
                element={
                  <ManageProcurement subsys="sm">
                    <ProcurementList pathname={pathname} subsys="sm" />
                  </ManageProcurement>
                }
              />
              <Route
                path="search"
                element={
                  <ManageProcurement subsys="sm">
                    <ProcurementSearch subsys="sm" />
                  </ManageProcurement>
                }
              />
              <Route
                path=":procurementId"
                element={<ProcurementWrapper subsys="sm" />}
              >
                <Route index element={<ProcurementDetails subsys="sm" />} />
                <Route path="pick-pack" element={<ProcurementPickPack />} />
              </Route>
              <Route path="create" element={<ProcurementForm />} />
              <Route path="edit/:orderId" element={<ProcurementForm />} />
            </Route>

            {/* Customer Orders */}
            <Route path="orders" element={<Outlet />}>
              <Route
                index
                element={
                  <ManageOrders subsys="sm">
                    <OrderList subsys="sm" />
                  </ManageOrders>
                }
              />
              <Route
                path="search"
                element={
                  <ManageOrders subsys="sm">
                    <OrderSearch subsys="sm" />
                  </ManageOrders>
                }
              />
              <Route
                path=":orderId"
                element={<CustomerOrderWrapper subsys="sm" />}
              >
                <Route index element={<CustomerOrderDetails subsys="sm" />} />
                <Route path="pick-pack" element={<ProcurementPickPack />} />
              </Route>
              <Route path="create" element={<ProcurementForm />} />
              <Route path="edit/:orderId" element={<ProcurementForm />} />
            </Route>

            {/* Vouchers */}
            <Route path="vouchers" element={<Outlet />}>
              <Route index element={<ManageVouchers />} />
              <Route path=":voucherCode" element={<VoucherDetails />} />
              <Route path="create" element={<VoucherForm />} />
              <Route path="edit/:voucherId" element={<VoucherForm />} />
            </Route>

            {/* Customers */}
            <Route path="customers" element={<Outlet />}>
              <Route index element={<ManageCustomer />} />
              <Route path=":customerId" element={<CustomerDetails />} />
              <Route path="create" element={<CustomerForm />} />
              <Route path="edit/:customerId" element={<CustomerForm />} />
              <Route path="tiers" element={<Outlet />}>
                <Route index element={<ManageMembershipTier />} />
                <Route path=":name" element={<MembershipTierDetails />} />
                <Route path="create" element={<MembershipTierForm />} />
                <Route path="edit/:name" element={<MembershipTierForm />} />
              </Route>
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
            <Route path="stocklevels">
              <Route path="my/:id" element={<StockLevelForm subsys="str" />} />
              <Route path="my" element={<MyStoreStock subsys="str" />} />
              <Route path="edit" element={<EditStockLevel subsys="str" />} />
              <Route path="sites" element={<SiteStocks subsys="str" />} />
              <Route path="products" element={<ProductStocks subsys="str" />} />
              <Route path=":id" element={<AsiteStock />} />
              <Route
                path="products/:id"
                element={<AProductStock subsys="str" />}
              />
            </Route>
{/* Stock Transfer */}
            <Route path="stocktransfer" element={<Outlet />}>
            <Route
                index
                element={
                  <ManageStockTransfer subsys="str">
                    <StockTransferList subsys="str" />
                  </ManageStockTransfer>
                }
              />
              <Route
                path="search"
                element={
                  <ManageStockTransfer subsys="str">
                    <StockTransferSearch subsys="str" />
                  </ManageStockTransfer>
                }
              />
              <Route
                path="create"
                element={<StockTransferForm subsys="str" />}
              />
              <Route path=":id" element={<StockTransferWrapper subsys="str" />}>
                <Route index element={<ViewStockTransfer subsys="str" />} />
                <Route path="pick-pack" element={<StockTransferPickPack />} />
              </Route>
              <Route
                path="edit/:id"
                element={<StockTransferForm subsys="str" />}
              />
            </Route>
            <Route path="pos" element={<ManagePOS />}>
              <Route path="orderHistory" element={<Outlet />}>
                <Route index element={<PosPurchaseHistory />} />
                <Route path=":orderId" element={<OrderDetails />} />
              </Route>
              <Route path="orderPurchase" element={<PosPurchaseOrder />} />
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
              <Route path=":employeeId" element={<EmployeeDetails />} />
              <Route path="create" element={<EmployeeForm />} />
              <Route path="edit/:employeeId" element={<EmployeeForm />} />
            </Route>
            <Route path="jobTitles" element={<Outlet />}>
              <Route index element={<ManageJobTitle />} />
              <Route path=":jobTitleId" element={<JobTitleDetails />} />
              <Route path="create" element={<JobTitleForm />} />
              <Route path="edit/:jobTitleId" element={<JobTitleForm />} />
            </Route>
            <Route path="departments" element={<Outlet />}>
              <Route index element={<ManageDepartment />} />
              <Route path=":departmentId" element={<DepartmentDetails />} />
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
              <Route
                index
                element={
                  <ManageProcurement subsys="mf">
                    <ProcurementList pathname={pathname} subsys="mf" />
                  </ManageProcurement>
                }
              />
              <Route
                path="search"
                element={
                  <ManageProcurement subsys="mf">
                    <ProcurementSearch subsys="mf" />
                  </ManageProcurement>
                }
              />
              <Route
                path=":procurementId"
                element={<ProcurementWrapper subsys="mf" />}
              >
                <Route index element={<ProcurementDetails subsys="mf" />} />
                <Route path="pick-pack" element={<ProcurementPickPack />} />
              </Route>
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
            <Route path="products" element={<Outlet />}>
              <Route
                path="print"
                element={
                  <ManageProducts subsys="wh">
                    <ProductPrint subsys="wh" />
                  </ManageProducts>
                }
              />
            </Route>
            {/* Stock Levels */}
            <Route path="stocklevels">
              <Route path="my/:id" element={<StockLevelForm subsys="wh" />} />
              <Route path="my" element={<MyStoreStock subsys="wh" />} />
              <Route path="edit" element={<EditStockLevel subsys="wh" />} />
              <Route path="sites" element={<SiteStocks subsys="wh" />} />
              <Route path="products" element={<ProductStocks subsys="wh" />} />
              <Route path=":id" element={<AsiteStock />} />
              <Route
                path="products/:id"
                element={<AProductStock subsys="wh" />}
              />
            </Route>
            {/* Procurement Orders */}
            <Route path="procurements" element={<Outlet />}>
              <Route
                index
                element={
                  <ManageProcurement subsys="wh">
                    <ProcurementList subsys="wh" />
                  </ManageProcurement>
                }
              />
              <Route
                path="search"
                element={
                  <ManageProcurement subsys="wh">
                    <ProcurementSearch subsys="wh" />
                  </ManageProcurement>
                }
              />
              <Route
                path=":procurementId"
                element={<ProcurementWrapper subsys="wh" />}
              >
                <Route index element={<ProcurementDetails subsys="wh" />} />
                <Route path="pick-pack" element={<ProcurementPickPack />} />
              </Route>
            </Route>

            {/* Online Orders */}
            <Route path="online-orders" element={<Outlet />}>
              <Route
                index
                element={
                  <ManageOnlineOrders subsys="wh">
                    <OnlineOrderList subsys="wh" />
                  </ManageOnlineOrders>
                }
              />

              <Route
                path="search"
                element={
                  <ManageOnlineOrders subsys="wh">
                    <OnlineOrderSearch subsys="wh" />
                  </ManageOnlineOrders>
                }
              />
              {/* <Route
                path=":procurementId"
                element={<ProcurementWrapper subsys="wh" />}
              >
                <Route index element={<ProcurementDetails subsys="wh" />} />
                <Route path="pick-pack" element={<ProcurementPickPack />} />
              </Route> */}
            </Route>
            {/* Stock Transfer Orders */}
            <Route path="stocktransfer" element={<Outlet />}>
              <Route
                index
                element={
                  <ManageStockTransfer subsys="wh">
                    <StockTransferList subsys="wh" />
                  </ManageStockTransfer>
                }
              />
              <Route
                path="search"
                element={
                  <ManageStockTransfer subsys="wh">
                    <StockTransferSearch subsys="wh" />
                  </ManageStockTransfer>
                }
              />
              <Route
                path="create"
                element={<StockTransferForm subsys="wh" />}
              />
              <Route path=":id" element={<StockTransferWrapper subsys="wh" />}>
                <Route index element={<ViewStockTransfer subsys="wh" />} />
                <Route path="pick-pack" element={<StockTransferPickPack />} />
              </Route>
              <Route
                path="edit/:id"
                element={<StockTransferForm subsys="wh" />}
              />
            </Route>
          </Route>

          {/* Logistics Subsystem */}
          <Route
            path="lg"
            element={
              <PrivateRoute>
                <LGIndex />
              </PrivateRoute>
            }
          >
            <Route path="stocktransfer" element={<Outlet />}>
              <Route index element={<ManageStockTransfer subsys="lg" />} />
              <Route path=":id" element={<ViewStockTransfer subsys="lg" />} />
            </Route>
          </Route>
        </Route>

        {/* Self Service Kiosk*/}
        <Route path="ss" element={<Outlet />}>
          <Route index element={<FrontPage />} />
          <Route path="order" element={<Order />} />
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
