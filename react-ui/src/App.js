import { Routes, Route, Outlet } from "react-router-dom";
import { Index } from "./views/containers/Index";
import { ManageProducts } from "./views/containers/Products/ManageProducts";
import { AddProductForm } from "./views/containers/Products/AddProductForm";
import { ViewStockLevels } from "./views/containers/StockLevels/ViewStockLevels";
import Login from "./views/containers/Login";

function App() {
  return (
    <div className="wrapper">
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<Index />}>
          <Route path="products" element={<Outlet />}>
            <Route index element={<ManageProducts />} />
            <Route path="create" element={<AddProductForm />} />
          </Route>
          <Route path="stocklevels/*" element={<ViewStockLevels />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
