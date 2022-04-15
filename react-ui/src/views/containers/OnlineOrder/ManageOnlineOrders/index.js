import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrSite } from "../../../../stores/slices/userSlice";
import { Tabs } from "../../../components/Tabs";

const Header = ({ subsys }) => {
  const tabs =
    subsys === "wh"
      ? [
          {
            id: 1,
            name: "Search Order",
            href: `/${subsys}/orders/search`,
            current: false,
          },
          {
            id: 2,
            name: "All Orders",
            href: `/${subsys}/orders`,
            current: true,
          },
          {
            id: 3,
            name: "Picking",
            href: `/${subsys}/orders/picking`,
            current: false,
          },
        ]
      : [
          {
            id: 1,
            name: "Search Order",
            href: `/${subsys}/orders/search`,
            current: false,
          },
          {
            id: 2,
            name: "All Orders",
            href: `/${subsys}/orders`,
            current: true,
          },
        ];

  return (
    <div className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
        <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                Online Orders
              </h1>
            </div>
          </div>
          {subsys === "wh" && (
            <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
              <a
                href="https://app.staging.shippit.com/new_orders/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  Shippit Portal
                </button>
              </a>
            </div>
          )}
        </div>
        <div className="ml-3">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </div>
  );
};

export const ManageOnlineOrders = ({ subsys, children }) => {
  const dispatch = useDispatch();
  const currSiteStatus = useSelector((state) => state.user.currSiteStatus);

  useEffect(() => {
    currSiteStatus === "idle" && dispatch(updateCurrSite());
  }, [dispatch, currSiteStatus]);

  return (
    <>
      <Header subsys={subsys} />
      {children}
    </>
  );
};
