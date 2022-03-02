import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";

import { NavBar } from "../../../components/NavBar";
import { SideBar } from "../../../components/SideBar";
import {
  CogIcon,
  CollectionIcon,
  DocumentTextIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@heroicons/react/outline";
import { updateCurrSite } from "../../../../stores/slices/userSlice";

const navigation = [
  { name: "Home", href: "/home", icon: HomeIcon, current: true },
  { name: "Stock Levels", href: "/wh/stocklevels/my", icon: CollectionIcon, current: false },
  { name: "Procurement", href: "/wh/procurements", icon: DocumentTextIcon, current: false },
  { name: "Stock Transfer Order", href: "/wh/stocktransfer", icon: TruckIcon, current: true}
];

const secondaryNavigation = [
  { name: "Settings", href: "#", icon: CogIcon },
  { name: "Help", href: "#", icon: QuestionMarkCircleIcon },
  { name: "Privacy", href: "#", icon: ShieldCheckIcon },
];

export const WHIndex = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateCurrSite(2));
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
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Warehouse
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
