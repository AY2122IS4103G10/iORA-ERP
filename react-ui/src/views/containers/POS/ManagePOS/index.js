import { Outlet, Route, Routes } from "react-router-dom";

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
      <Outlet />
    </>
  );
};
