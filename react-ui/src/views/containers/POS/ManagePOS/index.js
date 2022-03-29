import { HandIcon } from "@heroicons/react/outline";
import { Outlet, useNavigate } from "react-router-dom";
import { SectionHeading } from "../../../components/HeadingWithTabs";

const tabs = [
  { name: "Order", href: "orderPurchase", current: true },
  { name: "History", href: "orderHistory", current: false },
  { name: "Search Order", href: "orderHistory/search", current: false },
];

export const ManagePOS = (subsys) => {
  const navigate = useNavigate();

  return (
    <>
      <SectionHeading
        header="POS"
        tabs={tabs}
        button={
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            onClick={() => navigate("/ss")}
          >
            <HandIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Launch Self Service Kiosk
          </button>
        }
      />
      <Outlet />
    </>
  );
};
