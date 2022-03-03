import { Route, Routes } from "react-router-dom";

import { PosPurchaseHistory } from "../PurchaseHistory";
import { PosPurchaseOrder } from "../PurchaseOrder";
import { SectionHeading } from "../../../components/HeadingWithTabs";
import { OrderDetails } from "../OrderDetails";

const tabs = [
  { name: "Order", href: "orderPurchase", current: true },
  { name: "History", href: "orderHistory", current: false },
];

export const ManagePOS = (subsys) => {
  return (
    <>
      <SectionHeading header="POS" tabs={tabs} />
      <Routes>
        <Route
          path="orderHistory"
          element={<PosPurchaseHistory subsys={subsys} />}
        />
        <Route path=":orderId" element={<OrderDetails />} />
        <Route
          path="orderPurchase"
          element={<PosPurchaseOrder subsys={subsys} />}
        />
      </Routes>
    </>
  );
};
