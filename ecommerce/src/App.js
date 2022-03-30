import { Routes, Route } from "react-router-dom";
import { Login } from "./views/containers/Auth/Login";
import { Profile } from "./views/containers/Auth/Settings/Profile";
import { Register } from "./views/containers/Auth/Register";
import { Cart } from "./views/containers/Cart";
import { ECIndex } from "./views/containers/Index/ECIndex";
import { SettingsIndex } from "./views/containers/Index/SettingsIndex";
import { Account } from "./views/containers/Auth/Settings/Account";
import { Auth } from "./views/containers/Auth/Auth";
import { HomeIndex } from "./views/containers/Index/HomeIndex";
import { Listings } from "./views/containers/Listings";
import ViewModel from "./views/containers/ViewModel";
import { ManageCheckout } from "./views/containers/Checkout/ManageCheckout";
import { ManageMembership } from "./views/containers/Membership/ManageMembership";

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
          <Route index element={<HomeIndex />} />

          <Route path="products/view/:modelCode" element={<ViewModel />} />
          <Route path="products/:line">
            <Route path=":tag" element={<Listings />} />
            <Route path="" element={<Listings />} />
          </Route>

          <Route path="cart" element={<Cart />} />
          <Route path="cart/checkout" element={<ManageCheckout />} />

          <Route path="membership" element={<ManageMembership />} />

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
