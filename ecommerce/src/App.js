import { Routes, Route } from "react-router-dom";
import { Login } from "./views/containers/Auth/Login";
import { Profile } from "./views/containers/Auth/Settings/Profile";
import { Register } from "./views/containers/Auth/Register";
import { Cart } from "./views/containers/Cart";
import { ECIndex } from "./views/containers/Index/ECIndex";
import { SettingsIndex } from "./views/containers/Index/SettingsIndex";
import { Account } from "./views/containers/Auth/Settings/Account";
import { Auth } from "./views/containers/Auth/Auth";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <Auth>
              <ECIndex />
            </Auth>
          }
        >
          <Route index element={<Cart />} />
          <Route path="settings" element={<SettingsIndex />}>
            <Route path="profile" element={<Profile />} />
            <Route path="account" element={<Account />} />
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
