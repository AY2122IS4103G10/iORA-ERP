import { Link } from "react-router-dom";
import { Tabs } from "../../../components/Tabs";

const smTabs = [
  { name: "All Products", href: "/sm/products", current: true },
  {
    name: "Promotions",
    href: "/sm/products/promotions",
    current: false,
  },
];

const whTabs = [
  { name: "Print Label", href: "/wh/products/print", current: true },
  {
    name: "RFID",
    href: "/wh/products/rfid",
    current: false,
  },
];

const Header = ({ subsys }) => {
  return (
    <div className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
        <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                Products
              </h1>
            </div>
          </div>
          {subsys === "sm" && (
            <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
              <Link to="/sm/products/create">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  Add product
                </button>
              </Link>
            </div>
          )}
        </div>

        <div className="ml-3">
          <Tabs tabs={subsys === "sm" ? smTabs : whTabs} />
        </div>
      </div>
    </div>
  );
};

export const ManageProducts = ({ subsys, children }) => {
  return (
    <>
      <Header subsys={subsys} />
      {children}
    </>
  );
};
