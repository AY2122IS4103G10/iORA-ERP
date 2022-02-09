import { Routes, Route } from "react-router-dom";

import ManageProducts from "./app/containers/ManageProducts";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ManageProducts />} />
      </Routes>
    </div>
  );
}

export default App;