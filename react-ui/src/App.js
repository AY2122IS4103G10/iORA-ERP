import { Routes, Route, Outlet } from "react-router-dom";
import { Index } from "./views/containers/Index";
import { ManageProducts } from "./views/containers/Products/ManageProducts";
import { AddProductForm } from "./views/containers/Products/AddProductForm";
import Login from "./views/containers/Login";

function App() {
  return (
    <div className="wrapper">
      <div className="h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/" element={<Index />}>
            <Route path="products" element={<Outlet />}>
              <Route index element={<ManageProducts />} />
              <Route path="create" element={<AddProductForm />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
