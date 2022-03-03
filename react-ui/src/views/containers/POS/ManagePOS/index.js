import { Outlet } from "react-router-dom";
import { SectionHeading } from "../../../components/HeadingWithTabs";


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
