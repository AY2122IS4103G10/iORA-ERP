import {
  CogIcon,
  DocumentReportIcon,
  LibraryIcon,
  LogoutIcon,
  OfficeBuildingIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  TruckIcon,
  UserGroupIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/outline";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { classNames } from "../../../../utilities/Util";
import { NavBar } from "../../../components/NavBar";
import { SideBar } from "../../../components/SideBar";

export const tabs = [
  { name: "Employees", href: "/ad/employees", icon: UsersIcon, index: 0 },
  { name: "Sites", href: "/ad/sites", icon: OfficeBuildingIcon, index: 1 },
  { name: "Companies", href: "/ad/companies", icon: LibraryIcon, index: 2 },
  {
    name: "Departments",
    href: "/ad/departments",
    icon: UserGroupIcon,
    index: 3,
  },
  { name: "Job Titles", href: "/ad/jobTitles", icon: UserIcon, index: 4 },
  { name: "Vendors", href: "/ad/vendors", icon: TruckIcon, index: 5 },
  {
    name: "Reports & Analytics",
    href: "/ad/analytics",
    icon: DocumentReportIcon,
    index: 6,
  },
];
const navigation = [
  { name: "Exit Subsystem", href: "/home", icon: LogoutIcon, current: true },
  ...tabs,
];

const secondaryNavigation = [
  { name: "Settings", href: "/account/settings", icon: CogIcon },
  { name: "Help", href: "#", icon: QuestionMarkCircleIcon },
  { name: "Privacy", href: "#", icon: ShieldCheckIcon },
];

export const Header = ({ button, title }) => {
  const location = useLocation();
  const [currTab, setCurrTab] = useState(
    tabs.filter((x) => x.href === location.pathname)[0].index
  );

  const changeTab = (tabnumber) => setCurrTab(tabnumber);
  return (
    <div className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
        <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <div>
                <div className="flex items-center">
                  <img
                    className="h-16 w-16 rounded-full sm:hidden"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.6&w=256&h=256&q=80"
                    alt=""
                  />
                  <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                    {title}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">{button}</div>
        </div>
        <div className="ml-3">
          <div className="sm:block">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  to={tab.href}
                  className={classNames(
                    tab.index === currTab
                      ? "border-cyan-500 text-cyan-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                  )}
                  aria-current={currTab ? "page" : undefined}
                  onClick={() => changeTab(tab.index)}
                >
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

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
