import { useState } from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../../../components/NavBar";
import { SideBar } from "../../../components/SideBar";
import {
  CogIcon,
  DocumentReportIcon,
  HomeIcon,
  LibraryIcon,
  OfficeBuildingIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  TruckIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/outline";

export const tabs = [
  { name: "Employees", href: "/ad/employees", icon: UsersIcon, current: false },
  { name: "Sites", href: "/ad/sites", icon: OfficeBuildingIcon, current: false },
  { name: "Companies", href: "/ad/companies", icon: LibraryIcon, current: false },
  { name: "Departments", href: "/ad/departments", icon: UserGroupIcon, current: false },
  { name: "Job Titles", href: "/ad/jobTitles", icon: UserGroupIcon, current: false },
  { name: "Vendors", href: "/ad/vendors", icon: TruckIcon, current: false },
  {
    name: "Reports & Analytics",
    href: "#",
    icon: DocumentReportIcon,
    current: false,
  },
]

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon, current: true },
  ...tabs
];

const secondaryNavigation = [
  { name: "Settings", href: "#", icon: CogIcon },
  { name: "Help", href: "#", icon: QuestionMarkCircleIcon },
  { name: "Privacy", href: "#", icon: ShieldCheckIcon },
];

export const AdminIndex = () => {
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
