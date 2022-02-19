import { useState } from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../../../components/NavBar";
import { SideBar } from "../../../components/SideBar";
import {
  CogIcon,
  DocumentReportIcon,
  HomeIcon,
  OfficeBuildingIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@heroicons/react/outline";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon, current: true },
  { name: "Employees", href: "/ad/employees", icon: UsersIcon, current: false },
  { name: "Sites", href: "/ad/sites", icon: OfficeBuildingIcon, current: false },
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

export const AdminIndex = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [currPage, setCurrPage] = useState(0);

  // const changePage = (tabnumber) => setCurrPage(tabnumber);
  return (
    <div className="min-h-full ">
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
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                Administrative
              </span>
            </div>
          }
        />
        <main className="flex-1 pb-8 h-screen bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
