import { Outlet } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { Login } from "./views/containers/Auth/Login";
import { Profile } from "./views/containers/Auth/Profile";
import { Register } from "./views/containers/Auth/Register";
import { Cart } from "./views/containers/Cart";
import { ECIndex } from "./views/containers/Index/ECIndex";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ECIndex />}>
          <Route index element={<Cart />} />
          <Route path="profile" element={<Profile />} />
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
