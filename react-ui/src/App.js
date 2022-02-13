import { Routes, Route, Outlet } from "react-router-dom";
import { Index } from "./views/containers/Index";
import { ManageProducts } from "./views/containers/Products/ManageProducts";
import { AddProductForm } from "./views/containers/Products/AddProductForm";
import { ProductDetails } from "./views/containers/Products/ProductDetails";
import { EditProductForm } from "./views/containers/Products/EditProductForm";

function App() {
  return (
    <div>
      <Routes>
        {/* login */}
        {/* <Route path="/"></Route> */}
        <Route path="/" element={<Index />}>
          <Route path="products" element={<Outlet />}>
            <Route index element={<ManageProducts />} />
            <Route path=":prodCode" element={<ProductDetails />} />
            <Route path="create" element={<AddProductForm />} />
            <Route path="edit/:prodCode" element={EditProductForm}/>
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
