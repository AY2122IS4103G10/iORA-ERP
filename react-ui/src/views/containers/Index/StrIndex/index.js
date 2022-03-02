import { Outlet } from "react-router-dom";
import {
  ArchiveIcon,
  HomeIcon,
  CogIcon,
  ClockIcon,
  CollectionIcon,
  ScaleIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  DocumentReportIcon,
} from "@heroicons/react/outline";

import MainWrapper from "../../../components/MainWrapper";
import { useEffect } from "react";
import { updateCurrSite } from "../../../../stores/slices/userSlice";
import { useDispatch } from "react-redux";

const navigation = [
  { name: "Home", href: "/home", icon: HomeIcon, current: true },
  {
    name: "POS",
    href: "/str/pos/orderPurchase",
    icon: ClockIcon,
    current: false,
  },
  {
    name: "Stock Levels",
    href: "/str/stocklevels/my",
    icon: CollectionIcon,
    current: false,
  },
  { name: "Stock Transfer", 
    href: "/str/stocktransfer", 
    icon: ArchiveIcon, 
    current: false },
  {
    name: "Pickup Orders",
    href: "/str/pickup",
    icon: CreditCardIcon,
    current: false,
  },
  {
    name: "Reports & Analytics",
    href: "#",
    icon: DocumentReportIcon,
    current: false,
  },
];

const secondaryNavigation = [
  { name: "Settings", href: "#", icon: CogIcon },
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
