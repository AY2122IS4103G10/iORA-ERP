import { Routes, Route, Outlet } from "react-router-dom";
import { SMIndex } from "./views/containers/Index/SMIndex";
import { AdminIndex } from "./views/containers/Index/AdminIndex";
import { ManageProducts } from "./views/containers/Products/ManageProducts";
import { ProductForm } from "./views/containers/Products/ProductForm";
import { ProductDetails } from "./views/containers/Products/ProductDetails";
import { ViewStockLevels } from "./views/containers/StockLevels/ManageStockLevels";
import { SiteStocks } from "./views/containers/StockLevels/BySite";
import { ProductStocks } from "./views/containers/StockLevels/ByProduct";
import { AsiteStock } from "./views/containers/StockLevels/ASiteStock";
import Login from "./views/containers/Login";
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
import { ViewStoreStock } from "./views/containers/StockLevels/ManageStoreStock ";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Sales and Marketing Subsystem */}
        <Route
          path="/sm"
          element={
            <SMRoute>
              <SMIndex />
            </SMRoute>
          }
        >
          <Route path="products" element={<Outlet />}>
            <Route index element={<ManageProducts />} />
            <Route path=":prodCode" element={<ProductDetails />} />
            <Route path="create" element={<ProductForm />} />
            <Route path="edit/:prodId" element={<ProductForm />} />
            <Route path="promotions" element={<ManagePromotions />} />
          </Route>
          <Route path="stocklevels/*" element={<ViewStockLevels />}/>
          <Route path="procurements" element={<Outlet />}>
            <Route index element={<ManageProcurement />} />
            {/* <Route path=":voucherCode" element={<VoucherDetails />} /> */}
            <Route path="create" element={<ProcurementForm />} />
            {/* <Route path="edit/:voucherId" element={<VoucherForm />} /> */}
          </Route>
          <Route path="vouchers" element={<Outlet />}>
            <Route index element={<ManageVouchers />} />
            <Route path=":voucherCode" element={<VoucherDetails />} />
            <Route path="create" element={<VoucherForm />} />
            <Route path="edit/:voucherId" element={<VoucherForm />} />
          </Route>
        </Route>

        {/* Store Management Subsystem */}
        <Route path="/str" element={<StoreIndex/>}>
          <Route path="stocklevels/*" element={<ViewStoreStock/>}/>
        </Route>

        {/* Admin Subsystem */}
        <Route
          path="/ad"
          element={
            //Change to admin route
            // <ADRoute>
              <AdminIndex />
            /* </ADRoute> */
          }
        >
          <Route path="sites" element={<Outlet />}>
            <Route index element={<ManageSites />} />
            <Route path=":siteId" element={<ProductDetails />} />
            <Route path="create" element={<SiteForm />} />
            <Route path="edit/:siteId" element={<SiteForm />} />
          </Route>
          <Route path="companies" element={<Outlet />}>
            <Route index element={<ManageCompanies />} />
            <Route path=":siteId" element={<ProductDetails />} />
            <Route path="create" element={<SiteForm />} />
            <Route path="edit/:siteId" element={<SiteForm />} />
          </Route>
        </Route>
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
