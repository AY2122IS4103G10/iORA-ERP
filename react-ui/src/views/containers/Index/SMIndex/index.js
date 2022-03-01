import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { NavBar } from "../../../components/NavBar";
import { SideBar } from "../../../components/SideBar";
import {
  ArchiveIcon,
  CogIcon,
  CollectionIcon,
  DocumentReportIcon,
  DocumentTextIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TicketIcon,
} from "@heroicons/react/outline";
import { updateCurrSite } from "../../../../stores/slices/userSlice";

const navigation = [
  { name: "Home", href: "/home", icon: HomeIcon, current: true },
  { name: "Products", href: "/sm/products", icon: ShoppingBagIcon, current: false },
  {
    name: "Stock Levels",
    href: "/sm/stocklevels/sites",
    icon: CollectionIcon,
    current: false,
  },
  { name: "Procurement", href: "/sm/procurements", icon: DocumentTextIcon, current: false },
  { name: "Stock Transfer", href: "/sm/stocktransfer", icon: ArchiveIcon, current: false },
  {
    name: "Vouchers",
    href: "/sm/vouchers",
    icon: TicketIcon,
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

export const SMIndex = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(updateCurrSite(1));
  },[dispatch])


  return (
    <div className="min-h-screen bg-gray-100">
      <SideBar
        navigation={navigation}
        secondaryNavigation={secondaryNavigation}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="lg:pl-64 flex flex-col flex-1">
        <NavBar
          setSidebarOpen={setSidebarOpen}
          badge={
            <div className="flex-1 flex py-4">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                Sales and Marketing
              </span>
            </div>
          }
        />
        <main className="flex-1 pb-8 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
