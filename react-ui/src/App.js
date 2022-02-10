import { Routes, Route } from "react-router-dom";

import ManageProducts from "./app/containers/ManageProducts";

function App() {
  return (
    <div className="h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<ManageProducts />} />
      </Routes>
    </div>
  );
}

export default App;