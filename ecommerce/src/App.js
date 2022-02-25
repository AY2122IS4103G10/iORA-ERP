import { Outlet } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { Login } from "./views/containers/Auth/Login";
import { Register } from "./views/containers/Auth/Register";
import { ECIndex } from "./views/containers/Index/ECIndex";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<ECIndex />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
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
