import { Routes, Route } from "react-router-dom";

import ManageProducts from "./views/containers/ManageProducts";

function App() {
  return (
    <div className="wrapper">
      <div className="h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<ManageProducts />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
