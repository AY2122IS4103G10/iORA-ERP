import { Outlet, Route, Routes } from "react-router-dom";
import { Auth } from "./views/containers/Auth/Auth";
import { Login } from "./views/containers/Auth/Login";
import { Register } from "./views/containers/Auth/Register";
import { Account } from "./views/containers/Auth/Settings/Account";
import { Profile } from "./views/containers/Auth/Settings/Profile";
import { Cart } from "./views/containers/Cart";
import { CheckoutSuccessful } from "./views/containers/Checkout/CheckoutSuccessful";
import { ManageCheckout } from "./views/containers/Checkout/ManageCheckout";
import { ECIndex } from "./views/containers/Index/ECIndex";
import { HomeIndex } from "./views/containers/Index/HomeIndex";
import { SettingsIndex } from "./views/containers/Index/SettingsIndex";
import { Listings } from "./views/containers/Listings";
import { Membership } from "./views/containers/Membership";
import { PurchaseHistoryList } from "./views/containers/PurchaseHistory/PurchaseHistoryList";
import { PurchaseHistoryDetails } from "./views/containers/PurchaseHistory/ViewAPurchaseHistory";
import { SupportList } from "./views/containers/Support/SupportList";
import ViewModel from "./views/containers/ViewModel";

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
          <Route path="checkout/success/:id" element={<CheckoutSuccessful />} />

          <Route path="membership" element={<Membership />} />

          <Route path="support" element={<SupportList />} />

          <Route path="orders" element={<Outlet />}>
            <Route index element={<PurchaseHistoryList />} />
            <Route path=":orderId" element={<PurchaseHistoryDetails />} />
          </Route>

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
    </div >
  );
}

export default App;
