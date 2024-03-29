import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrSite } from "../../../../stores/slices/userSlice";
import { Tabs } from "../../../components/Tabs";

const Header = ({ subsys }) => {
  const tabs = [
    {
      id: 1,
      name: "Search Order",
      href: `/${subsys}/orders/search`,
      current: false,
    },
    {
      id: 2,
      name: "Store",
      href: `/${subsys}/orders/store`,
      current: true,
    },
    {
      id: 2,
      name: "Online",
      href: `/${subsys}/orders/online`,
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
                Orders
              </h1>
            </div>
          </div>
        </div>
        <div className="ml-3">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </div>
  );
};

export const ManageOrders = ({ subsys, children }) => {
  const dispatch = useDispatch();
  const currSiteStatus = useSelector((state) => state.user.currSiteStatus);

  useEffect(() => {
    currSiteStatus === "idle" && dispatch(updateCurrSite());
  }, [dispatch, currSiteStatus]);
  
  return (
    <>
      {<Header subsys={subsys} />}
      {children}
    </>
  );
};
