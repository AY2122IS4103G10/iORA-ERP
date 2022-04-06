import {
  ArchiveIcon,
  ClockIcon,
  CogIcon,
  CollectionIcon,
  DocumentReportIcon,
  LogoutIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
} from "@heroicons/react/outline";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { updateCurrSite } from "../../../../stores/slices/userSlice";
import MainWrapper from "../../../components/MainWrapper";

const navigation = [
  { name: "Exit Subsystem", href: "/home", icon: LogoutIcon, current: true },
  {
    name: "POS",
    href: "/str/pos/orderPurchase",
    icon: ClockIcon,
    current: false,
  },
  {
    name: "Online Orders",
    href: "/str/orders/search",
    icon: ShoppingBagIcon,
    current: false,
  },
  {
    name: "Stock Levels",
    href: "/str/stocklevels/my",
    icon: CollectionIcon,
    current: false,
  },
  {
    name: "Stock Transfer",
    href: "/str/stocktransfer/search",
    icon: ArchiveIcon,
    current: false,
  },
  {
    name: "Reports & Analytics",
    href: "/str/analytics",
    icon: DocumentReportIcon,
    current: false,
  },
];

const secondaryNavigation = [
  { name: "Settings", href: "/account/settings", icon: CogIcon },
  { name: "Help", href: "#", icon: QuestionMarkCircleIcon },
  { name: "Privacy", href: "#", icon: ShieldCheckIcon },
];

export const StoreIndex = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateCurrSite());
  }, [dispatch]);

  return (
    <div className="h-screen bg-gray-100">
      <MainWrapper
        navigation={navigation}
        secondaryNavigation={secondaryNavigation}
        badge={
          <div className="flex-1 flex py-4">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
              Store
            </span>
          </div>
        }
      >
        <Outlet />
      </MainWrapper>
    </div>
  );
};
