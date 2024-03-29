import { useState } from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../../../components/NavBar";
import { SideBar } from "../../../components/SideBar";
import {
  UserIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/outline";

const navigation = [
  { name: "Home", href: "/home", icon: HomeIcon },
  { name: "Account", href: "/account", icon: UserIcon },
];

const secondaryNavigation = [
  { name: "Help", href: "#", icon: QuestionMarkCircleIcon },
  { name: "Privacy", href: "#", icon: ShieldCheckIcon }, 
];

export const HomeIndex = () => {
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
              
            </div>
          }
        />
        <main className="flex-1 pb-8 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
