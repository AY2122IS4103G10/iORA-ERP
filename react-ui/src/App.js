import {Outlet, Route, Routes, useLocation} from "react-router-dom";
import {PrivateRoute} from "./routes/PrivateRoute.js";
import {Auth} from "./views/containers/Auth/Auth";
import Error from "./views/containers/Auth/Error";
import {Home} from "./views/containers/Auth/Home";
import {Login} from "./views/containers/Auth/Login";
import {CompanyDetails} from "./views/containers/Companies/CompanyDetails";
import {CompanyForm} from "./views/containers/Companies/CompanyForm";
import {ManageCompanies} from "./views/containers/Companies/ManageCompanies";
import {CustomerDetails} from "./views/containers/Customer/CustomerDetails";
import {CustomerForm} from "./views/containers/Customer/CustomerForm";
import {ManageCustomer} from "./views/containers/Customer/ManageCustomer";
import {DepartmentDetails} from "./views/containers/Department/DepartmentDetails";
import {DepartmentForm} from "./views/containers/Department/DepartmentForm";
import {ManageDepartment} from "./views/containers/Department/ManageDepartment";
import {EmployeeForm} from "./views/containers/Employee/CreateEmployeeForm";
import {EmployeeDetails} from "./views/containers/Employee/EmployeeDetails";
import {ManageEmployee} from "./views/containers/Employee/ManageEmployee";
import {AdminIndex} from "./views/containers/Index/AdminIndex";
import {HomeIndex} from "./views/containers/Index/HomeIndex";
import {LGIndex} from "./views/containers/Index/LGIndex";
import {MFIndex} from "./views/containers/Index/MFIndex";
import {SMIndex} from "./views/containers/Index/SMIndex";
import {StoreIndex} from "./views/containers/Index/StrIndex";
import {WHIndex} from "./views/containers/Index/WHIndex";
import {JobTitleDetails} from "./views/containers/JobTitle/JobTitleDetails";
import {JobTitleForm} from "./views/containers/JobTitle/JobTitleForm";
import {ManageJobTitle} from "./views/containers/JobTitle/ManageJobTitle";
import {MembershipTierDetails} from "./views/containers/MembershipTier/MembershipTierDetails";
import {MembershipTierForm} from "./views/containers/MembershipTier/MembershipTierForm";
import {MembershipTierList} from "./views/containers/MembershipTier/MembershipTierList";
import {ManageOnlineOrders} from "./views/containers/OnlineOrder/ManageOnlineOrders";
import {OnlineOrderList} from "./views/containers/OnlineOrder/OnlineOrderList";
import {OnlineOrderPickPack} from "./views/containers/OnlineOrder/OnlineOrderPickPack/index.js";
import {OnlineOrderSearch} from "./views/containers/OnlineOrder/OnlineOrderSearch";
import {CustomerOrderDetails} from "./views/containers/Orders/CustomerOrderDetails";
import {CustomerOrderWrapper} from "./views/containers/Orders/CustomerOrderWrapper";
import {ManageOrders} from "./views/containers/Orders/ManageOrders";
import {OrderList} from "./views/containers/Orders/OrderList";
import {OrderSearch} from "./views/containers/Orders/OrderSearch";
import {ManagePOS} from "./views/containers/POS/ManagePOS";
import {OrderDetails} from "./views/containers/POS/OrderDetails";
import {PosPurchaseHistory} from "./views/containers/POS/PurchaseHistory";
import {PosPurchaseOrder} from "./views/containers/POS/PurchaseOrder";
import {ManageProcurement} from "./views/containers/Procurement/ManageProcurement";
import {ProcurementDelivery} from "./views/containers/Procurement/ProcurementDelivery";
import {ProcurementDetails} from "./views/containers/Procurement/ProcurementDetails";
import {ProcurementForm} from "./views/containers/Procurement/ProcurementForm";
import {ProcurementList} from "./views/containers/Procurement/ProcurementList";
import {ProcurementPickPack} from "./views/containers/Procurement/ProcurementPickPack";
import {ProcurementSearch} from "./views/containers/Procurement/ProcurementSearch";
import {ProcurementWrapper} from "./views/containers/Procurement/ProcurementWrapper";
import {ManageProducts} from "./views/containers/Products/ManageProducts";
import {ProductDetails} from "./views/containers/Products/ProductDetails";
import {ProductForm} from "./views/containers/Products/ProductForm";
import {ProductPrint} from "./views/containers/Products/ProductPrint";
import {ProductsList} from "./views/containers/Products/ProductsList";
import {ManageProfile} from "./views/containers/Profile/ManageProfile/index.js";
import {PasswordForm} from "./views/containers/Profile/PasswordForm/index.js";
import {Profile} from "./views/containers/Profile/Profile/index.js";
import {ProfileForm} from "./views/containers/Profile/ProfileForm/index.js";
import {Settings} from "./views/containers/Profile/Settings/index.js";
import {ManageSupportTicket} from "./views/containers/SupportTicket/ManageSupportTicket";
import {SupportTicketDetails} from "./views/containers/SupportTicket/SupportTicketDetails/index.js";
// import { SMRoute } from "./routes/SMRoute";
import {ManagePromotions} from "./views/containers/Promotions/ManagePromotions";
import {FrontPage} from "./views/containers/SelfService/FrontPage";
import {Order} from "./views/containers/SelfService/Order";
// import { ADRoute } from "./routes/ADRoute";
import {ManageSites} from "./views/containers/Sites/ManageSites";
import {SiteDetails} from "./views/containers/Sites/SiteDetails";
import {SiteForm} from "./views/containers/Sites/SiteForm";
import {AProductStock} from "./views/containers/StockLevels/AProductStock";
import {AsiteStock} from "./views/containers/StockLevels/ASiteStock";
import {ProductStocks} from "./views/containers/StockLevels/ByProduct";
import {SiteStocks} from "./views/containers/StockLevels/BySite";
import {EditStockLevel} from "./views/containers/StockLevels/EditStockLevel";
import {StockLevelForm} from "./views/containers/StockLevels/ProdStockLevelForm";
import {MyStoreStock} from "./views/containers/StockLevels/StoreStockList";
import {ManageStockTransfer} from "./views/containers/StockTransfer/ManageStockTransfer";
import {StockTransferDelivery} from "./views/containers/StockTransfer/StockTransferDelivery/index.js";
import {StockTransferForm} from "./views/containers/StockTransfer/StockTransferForm";
import {StockTransferList} from "./views/containers/StockTransfer/StockTransferList";
import {StockTransferPickPack} from "./views/containers/StockTransfer/StockTransferPickPack";
import {StockTransferSearch} from "./views/containers/StockTransfer/StockTransferSearch";
import {StockTransferWrapper} from "./views/containers/StockTransfer/StockTransferWrapper";
import {ViewStockTransfer} from "./views/containers/StockTransfer/ViewStockTransfer";
import {ManageVendors} from "./views/containers/Vendor/ManageVendors";
import {VendorDetails} from "./views/containers/Vendor/VendorDetails";
import {VendorForm} from "./views/containers/Vendor/VendorForm";
import {ManageRewardsLoyalty} from "./views/containers/Vouchers/ManageVouchers";
import {VoucherDetails} from "./views/containers/Vouchers/VoucherDetails";
import {VoucherForm} from "./views/containers/Vouchers/VoucherForm";
import {VouchersList} from "./views/containers/Vouchers/VouchersList";
import {ProductRFID} from "./views/containers/Products/ProductRFID/index.js";
import { ResetPassword } from "./views/containers/Auth/ResetPassword/index.js";

function App() {
  const {pathname} = useLocation();
  return (
    <div>
      <Routes>
        <Route path="resetPassword" element={<ResetPassword />} />
        <Route path="/" element={<Auth />}>
          {/* Common Infrastructure */}
          <Route index element={<Login />} />

          {/* Sales and Marketing Subsystem */}
          <Route
            path="sm"
            element={
              <PrivateRoute>
                <SMIndex />
              </PrivateRoute>
            }>
            {/* Products */}
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

            {/* Stock Levels */}
            <Route path="stocklevels">
              <Route path="my/:id" element={<StockLevelForm subsys="sm" />} />
              <Route path="my" element={<MyStoreStock subsys="sm" />} />
              <Route path="sites" element={<SiteStocks subsys="sm" />} />
              <Route path="products" element={<ProductStocks subsys="sm" />} />
              <Route path=":id" element={<AsiteStock />} />
              <Route path="products/:id" element={<AProductStock subsys="sm" />} />
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
              <Route path="create" element={<StockTransferForm subsys="sm" />} />
              <Route path=":id" element={<StockTransferWrapper subsys="sm" />}>
                <Route index element={<ViewStockTransfer subsys="sm" />} />
                <Route path="pick-pack" element={<StockTransferPickPack />} />
                <Route path="delivery" element={<StockTransferDelivery />} />
              </Route>
              <Route path="edit/:id" element={<StockTransferForm subsys="sm" />} />
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
              <Route path=":procurementId" element={<ProcurementWrapper subsys="sm" />}>
                <Route index element={<ProcurementDetails subsys="sm" />} />
                <Route path="pick-pack" element={<ProcurementPickPack />} />
                <Route path="delivery" element={<ProcurementDelivery />} />
              </Route>
              <Route path="create" element={<ProcurementForm />} />
              <Route path="edit/:orderId" element={<ProcurementForm />} />
            </Route>

            {/* Customer Orders */}
            <Route path="orders" element={<Outlet />}>
              <Route
                path="search"
                element={
                  <ManageOrders subsys="sm">
                    <OrderSearch subsys="sm" />
                  </ManageOrders>
                }
              />
              <Route
                path="store"
                element={
                  <ManageOrders subsys="sm">
                    <OrderList subsys="sm" type="store" />
                  </ManageOrders>
                }
              />{" "}
              <Route
                path="online"
                element={
                  <ManageOrders subsys="sm">
                    <OrderList subsys="sm" type="online" />
                  </ManageOrders>
                }
              />
              <Route />
              <Route path=":orderId" element={<CustomerOrderWrapper subsys="sm" />}>
                <Route index element={<CustomerOrderDetails subsys="sm" />} />
                <Route path="pick-pack" element={<OnlineOrderPickPack />} />
              </Route>
              <Route path="create" element={<ProcurementForm />} />
              <Route path="edit/:orderId" element={<ProcurementForm />} />
            </Route>

            {/* Customers */}
            <Route path="customers" element={<Outlet />}>
              <Route index element={<ManageCustomer />} />
              <Route path=":customerId" element={<CustomerDetails />} />
              <Route path="create" element={<CustomerForm />} />
              <Route path="edit/:customerId" element={<CustomerForm />} />
            </Route>

            {/* Support Centre */}
            <Route path="support" element={<Outlet />}>
              <Route index element={<ManageSupportTicket />} />
              <Route path=":ticketId" element={<SupportTicketDetails />} />
            </Route>

            {/* Rewards & Loyalty */}
            <Route path="rewards-loyalty" element={<Outlet />}>
              <Route path="vouchers" element={<Outlet />}>
                <Route
                  index
                  element={
                    <ManageRewardsLoyalty title="Vouchers">
                      <VouchersList />
                    </ManageRewardsLoyalty>
                  }
                />
                <Route path=":voucherCode" element={<Outlet />}>
                  <Route index element={<VoucherDetails />} />
                  <Route path="edit" element={<VoucherForm />} />
                </Route>
                <Route path="create" element={<VoucherForm />} />
              </Route>
              <Route path="tiers" element={<Outlet />}>
                <Route
                  index
                  element={
                    <ManageRewardsLoyalty title="Membership Tiers" buttonText="tier">
                      <MembershipTierList />
                    </ManageRewardsLoyalty>
                  }
                />
                <Route path=":name" element={<Outlet />}>
                  <Route index element={<MembershipTierDetails />} />
                  <Route path="edit" element={<MembershipTierForm />} />
                </Route>
                <Route path="create" element={<MembershipTierForm />} />
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
            }>
            <Route path="stocklevels">
              <Route path="my/:id" element={<StockLevelForm subsys="str" />} />
              <Route path="my" element={<MyStoreStock subsys="str" />} />
              <Route path="edit" element={<EditStockLevel subsys="str" />} />
              <Route path="sites" element={<SiteStocks subsys="str" />} />
              <Route path="products" element={<ProductStocks subsys="str" />} />
              <Route path=":id" element={<AsiteStock />} />
              <Route path="products/:id" element={<AProductStock subsys="str" />} />
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
              <Route path="create" element={<StockTransferForm subsys="str" />} />
              <Route path=":id" element={<StockTransferWrapper subsys="str" />}>
                <Route index element={<ViewStockTransfer subsys="str" />} />
                <Route path="pick-pack" element={<StockTransferPickPack />} />
                <Route path="delivery" element={<StockTransferDelivery />} />
              </Route>
              <Route path="edit/:id" element={<StockTransferForm subsys="str" />} />
            </Route>
            <Route path="pos" element={<ManagePOS />}>
              <Route path="orderHistory" element={<Outlet />}>
                <Route index element={<PosPurchaseHistory />} />
                <Route path=":orderId" element={<OrderDetails />} />
              </Route>
              <Route path="orderPurchase" element={<PosPurchaseOrder />} />
            </Route>
            <Route path="orders" element={<Outlet />}>
              <Route
                index
                element={
                  <ManageOnlineOrders subsys="str">
                    <OnlineOrderList subsys="str" />
                  </ManageOnlineOrders>
                }
              />

              <Route
                path="search"
                element={
                  <ManageOnlineOrders subsys="str">
                    <OnlineOrderSearch subsys="str" />
                  </ManageOnlineOrders>
                }
              />
              <Route path=":orderId" element={<CustomerOrderWrapper subsys="str" />}>
                <Route index element={<CustomerOrderDetails />} />
                <Route path="pick-pack" element={<OnlineOrderPickPack />} />
              </Route>
            </Route>
          </Route>

          {/* Admin Subsystem */}
          <Route
            path="ad"
            element={
              <PrivateRoute>
                <AdminIndex />
              </PrivateRoute>
            }>
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
            }>
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
              <Route path=":procurementId" element={<ProcurementWrapper subsys="mf" />}>
                <Route index element={<ProcurementDetails subsys="mf" />} />
                <Route path="pick-pack" element={<ProcurementPickPack />} />
                <Route path="delivery" element={<ProcurementDelivery />} />
              </Route>
              <Route path="create" element={<ProcurementForm />} />
            </Route>
          </Route>

          {/* Warehouse Subsystem */}
          <Route
            path="wh"
            element={
              <PrivateRoute>
                <WHIndex />
              </PrivateRoute>
            }>
            <Route path="products" element={<Outlet />}>
              <Route
                path="print"
                element={
                  <ManageProducts subsys="wh">
                    <ProductPrint subsys="wh" />
                  </ManageProducts>
                }
              />
              <Route
                path="rfid"
                element={
                  <ManageProducts subsys="wh">
                    <ProductRFID subsys="wh" />
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
              <Route path="products/:id" element={<AProductStock subsys="wh" />} />
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
              <Route path=":procurementId" element={<ProcurementWrapper subsys="wh" />}>
                <Route index element={<ProcurementDetails />} />
                <Route path="pick-pack" element={<ProcurementPickPack />} />
                <Route path="delivery" element={<ProcurementDelivery />} />
              </Route>
            </Route>

            {/* Online Orders */}
            <Route path="orders" element={<Outlet />}>
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
              <Route path=":orderId" element={<CustomerOrderWrapper subsys="wh" />}>
                <Route index element={<CustomerOrderDetails />} />
                <Route path="pick-pack" element={<OnlineOrderPickPack />} />
              </Route>
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
              <Route path="create" element={<StockTransferForm subsys="wh" />} />
              <Route path=":id" element={<StockTransferWrapper subsys="wh" />}>
                <Route index element={<ViewStockTransfer subsys="wh" />} />
                <Route path="pick-pack" element={<StockTransferPickPack />} />
                <Route path="delivery" element={<StockTransferDelivery />} />
              </Route>
              <Route path="edit/:id" element={<StockTransferForm subsys="wh" />} />
            </Route>
          </Route>

          {/* Logistics Subsystem */}
          <Route
            path="lg"
            element={
              <PrivateRoute>
                <LGIndex />
              </PrivateRoute>
            }>
            <Route path="procurements" element={<Outlet />}>
              <Route
                index
                element={
                  <ManageProcurement subsys="lg">
                    <ProcurementList pathname={pathname} subsys="lg" />
                  </ManageProcurement>
                }
              />
              <Route
                path="search"
                element={
                  <ManageProcurement subsys="lg">
                    <ProcurementSearch subsys="lg" />
                  </ManageProcurement>
                }
              />
              <Route path=":procurementId" element={<ProcurementWrapper subsys="lg" />}>
                <Route index element={<ProcurementDetails subsys="lg" />} />
                <Route path="pick-pack" element={<ProcurementPickPack />} />
                <Route path="delivery" element={<ProcurementDelivery />} />
              </Route>
            </Route>
            <Route path="stocktransfer" element={<Outlet />}>
              <Route
                index
                element={
                  <ManageStockTransfer subsys="lg">
                    <StockTransferList subsys="lg" />
                  </ManageStockTransfer>
                }
              />
              <Route
                path="search"
                element={
                  <ManageStockTransfer subsys="lg">
                    <StockTransferSearch subsys="lg" />
                  </ManageStockTransfer>
                }
              />
              <Route path="create" element={<StockTransferForm subsys="lg" />} />
              <Route path=":id" element={<StockTransferWrapper subsys="lg" />}>
                <Route index element={<ViewStockTransfer />} />
                <Route path="pick-pack" element={<StockTransferPickPack />} />
                <Route path="delivery" element={<StockTransferDelivery />} />
              </Route>
              <Route path="edit/:id" element={<StockTransferForm subsys="wh" />} />
            </Route>
          </Route>

          {/* Common Infrastructure Subsystem */}
          <Route path="/" element={<HomeIndex />}>
            <Route path="home" element={<Home />} />
            <Route path="account" element={<ManageProfile />}>
              <Route index element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="edit" element={<ProfileForm />} />
              <Route path="changepass" element={<PasswordForm />} />
            </Route>
          </Route>
          {/* Self Service Kiosk*/}
          <Route path="ss" element={<Outlet />}>
            <Route index element={<FrontPage />} />
            <Route path="order" element={<Order />} />
            <Route path="order/:id" element={<Order />} />
          </Route>

          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
