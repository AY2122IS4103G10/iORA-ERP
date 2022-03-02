import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../../../components/NavBar";
import { SideBar } from "../../../components/SideBar";
import {
  CogIcon,
  CreditCardIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/outline";
import { useDispatch } from "react-redux";
import { updateCurrSite } from "../../../../stores/slices/userSlice";

const navigation = [
  { name: "Home", href: "/home", icon: HomeIcon, current: true },
  { name: "Procurement", href: "/mf/procurements", icon: CreditCardIcon, current: false },
];

const secondaryNavigation = [
  { name: "Settings", href: "#", icon: CogIcon },
  { name: "Help", href: "#", icon: QuestionMarkCircleIcon },
  { name: "Privacy", href: "#", icon: ShieldCheckIcon },
];

export const MFIndex = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(updateCurrSite(21));
  }, [dispatch]);

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
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                Manufacturing
              </span>
            </div>
          }
        />
        <main className="flex-1 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
