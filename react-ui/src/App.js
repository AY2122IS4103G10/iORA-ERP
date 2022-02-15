import { Routes, Route, Outlet } from "react-router-dom";
import { Index } from "./views/containers/Index";
import { ManageProducts } from "./views/containers/Products/ManageProducts";
import { ProductForm } from "./views/containers/Products/ProductForm";
import { ProductDetails } from "./views/containers/Products/ProductDetails";
import { ViewStockLevels } from "./views/containers/StockLevels/ViewStockLevels";
import Login from "./views/containers/Login";
import { ManageVouchers } from "./views/containers/Vouchers/ManageVouchers";
import { VoucherForm } from "./views/containers/Vouchers/VoucherForm";
import { VoucherDetails } from "./views/containers/Vouchers/VoucherDetails/index.js";

function App() {
  return (
    <div>
      <Routes>
        {/* login */}
        {/* <Route path="/"></Route> */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Index />}>
          <Route path="products" element={<Outlet />}>
            <Route index element={<ManageProducts />} />
            <Route path=":prodCode" element={<ProductDetails />} />
            <Route path="create" element={<ProductForm />} />
            <Route path="edit/:prodId" element={<ProductForm />} />
          </Route>
          <Route path="stocklevels/*" element={<ViewStockLevels />} />
          <Route path="vouchers" element={<Outlet />}>
            <Route index element={<ManageVouchers />} />
            <Route path=":voucherId" element={<VoucherDetails />} />
            <Route path="create" element={<VoucherForm />} />
            <Route path="edit/:voucherId" element={<VoucherForm />} />
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
