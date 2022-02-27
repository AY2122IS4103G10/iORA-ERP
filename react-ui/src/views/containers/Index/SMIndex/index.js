import { useState } from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../../../components/NavBar";
import { SideBar } from "../../../components/SideBar";
import {
  ArchiveIcon,
  CogIcon,
  DocumentReportIcon,
  DocumentTextIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TicketIcon,
} from "@heroicons/react/outline";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon, current: true },
  { name: "Products", href: "/sm/products", icon: ShoppingBagIcon, current: false },
  {
    name: "Stock Levels",
    href: "/sm/stocklevels/sites",
    icon: ScaleIcon,
    current: false,
  },
  { name: "Stock Transfer", href: "/sm/stocktransfer", icon: ArchiveIcon, current: false },
  { name: "Procurement Orders", href: "/sm/procurements", icon: DocumentTextIcon, current: false },
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
