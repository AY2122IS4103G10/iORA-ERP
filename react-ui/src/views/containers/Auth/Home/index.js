import { useState } from "react";
import { Dialog } from "@headlessui/react";
import {
  CogIcon,
  FolderOpenIcon,
  ShoppingBagIcon,
  TruckIcon,
  UsersIcon,
} from "@heroicons/react/outline";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";

const actions = [
  {
    title: "Sales and Marketing",
    href: "/sm",
    icon: UsersIcon,
    iconForeground: "text-indigo-700",
    iconBackground: "bg-indigo-50",
    description:
      "View and modify product inventories. Access Customer Relations Management. Launch Procurement Orders.",
  },
  {
    title: "Administrator",
    href: "/ad",
    icon: FolderOpenIcon,
    iconForeground: "text-pink-700",
    iconBackground: "bg-pink-50",
    description:
      "Access and edit business profiles of companies, departments, vendors, job titles and access rights.",
  },
  {
    title: "Manufacturing",
    href: "/mf",
    icon: CogIcon,
    iconForeground: "text-yellow-700",
    iconBackground: "bg-yellow-50",
    description: "Assist procurement orders and view all updates.",
  },
  {
    title: "Warehouse",
    href: "/wh",
    icon: TruckIcon,
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
    description:
      "Search product inventories and stock levels to assist in logistics and movement as well as deliveries.",
  },
  {
    title: "Store",
    href: "/str",
    icon: ShoppingBagIcon,
    iconForeground: "text-rose-700",
    iconBackground: "bg-rose-50",
    description:
      "Click here for the Point-of-Sale system and pages to view the store's stock.",
  },
];

const user = {
  name: "Emilia Birch",
  role: "Sales and Marketing Executive",
  imageUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const stats = [
  { label: "Vacation days left", value: 12 },
  { label: "Sick days left", value: 4 },
  { label: "Personal days left", value: 2 },
];
import accessRightsMap from "../../../../constants/accessRightsPaths";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const EnterStoreModal = ({ open, closeModal, siteCode, setSiteCode, handleEnterStore }) => {

  return (
    <SimpleModal open={open} closeModal={closeModal}>
      <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
        <div>
          <div className="m-2">
            <Dialog.Title
              as="h3"
              className="text-center text-lg leading-6 font-medium text-gray-900"
            >
              Enter Store's Site Code
            </Dialog.Title>
          </div>
        </div>
          <input
            type="email"
            name="email"
            id="email"
            className="flex-grow shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="0000000"
            value={siteCode}
            onChange={(e) => setSiteCode(e.target.value)}
          />
        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              onClick={handleEnterStore}
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    </SimpleModal>
  );

}



export function Home() {
  const [openEnterStore, setOpenEnterStore] = useState(false);
  const [siteCode, setSiteCode] = useState("");

  const handleEnterStore = () => {
    console.log("SiteCode: " + siteCode);
    //need to api to get site from sitecode + store in localstorage
    closeEnterStoreModal();
  }

  const openEnterStoreModal = () => setOpenEnterStore(true);
  const closeEnterStoreModal = () => setOpenEnterStore(false);



const Header = ({ name, jobTitle, stats }) => {
  return (
      <div className="rounded-lg bg-white overflow-hidden shadow">
        <h2 className="sr-only" id="profile-overview-title">
          Profile Overview
        </h2>
        <div className="bg-white p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:space-x-5">
              <div className="flex-shrink-0">
                <img
                  className="mx-auto h-20 w-20 rounded-full"
                  src={"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                  alt=""
                />
              </div>
              <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                <p className="text-sm font-medium text-gray-600">
                  Welcome back,
                </p>
                <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {name}
                </p>
                <p className="text-sm font-medium text-gray-600">{jobTitle}</p>
              </div>
            </div>
            <div className="mt-5 flex justify-center sm:mt-0">
              <a
                href="/account"
                className="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View profile
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 bg-gray-100 grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="px-6 py-5 text-sm font-medium text-center"
            >
              <span className="text-gray-900">{stat.label}</span>{": "}
              <span className="text-gray-600">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
  );
}

const Tiles = ({actions}) => {
  return (
    <>
    <div className="rounded-lg bg-gray-100 overflow-hidden divide-y divide-gray-200 sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px">
        {actions.map((action, actionIdx) => (
          <div
            key={action.title}
            className={classNames(
              actionIdx === 0
                ? "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none"
                : "",
              actionIdx === 1 ? "sm:rounded-tr-lg" : "",
              actionIdx === actions.length - 2 ? "sm:rounded-bl-lg" : "",
              actionIdx === actions.length - 1
                ? "rounded-bl-lg rounded-br-lg sm:rounded-bl-none"
                : "",
              "relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 m-4 "
            )}
          >
            <div>
              <span
                className={classNames(
                  action.iconBackground,
                  action.iconForeground,
                  "rounded-lg inline-flex p-3 ring-4 ring-white"
                )}
              >
                <action.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                {action.href === "/str" ?
                  <button className="focus:outline-none" onClick={() => openEnterStoreModal()}>
                    {/* Extend touch target to entire panel */}
                    <span className="absolute inset-0" aria-hidden="true" />
                    {action.title}
                  </button>
                  : <a href={action.href} className="focus:outline-none">
                    {/* Extend touch target to entire panel */}
                    <span className="absolute inset-0" aria-hidden="true" />
                    {action.title}
                  </a>
                }
              </h3>
              <p className="mt-2 text-sm text-gray-500">{action.description}</p>
            </div>
            <span
              className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
              aria-hidden="true"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
              </svg>
            </span>
          </div>
        ))}
      </div>
      <EnterStoreModal 
        open={openEnterStore} 
        closeModal={closeEnterStoreModal} 
        siteCode={siteCode} 
        setSiteCode={setSiteCode}
        handleEnterStore={handleEnterStore}/>
    </>
  );
  )
}

const paths = [
  {
    title: "Sales and Marketing",
    href: "/sm",
    icon: UsersIcon,
    iconForeground: "text-indigo-700",
    iconBackground: "bg-indigo-50",
    description:
      "View and modify product inventories. Access Customer Relations Management. Launch Procurement Orders.",
  },
  {
    title: "Administrator",
    href: "/ad",
    icon: FolderOpenIcon,
    iconForeground: "text-pink-700",
    iconBackground: "bg-pink-50",
    description:
      "Access and edit business profiles of companies, departments, vendors, job titles and access rights.",
  },
  {
    title: "Manufacturing",
    href: "/mf",
    icon: CogIcon,
    iconForeground: "text-yellow-700",
    iconBackground: "bg-yellow-50",
    description: "Assist procurement orders and view all updates.",
  },
  {
    title: "Warehouse",
    href: "#",
    icon: TruckIcon,
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
    description:
      "Search product inventories and stock levels to assist in logistics and movement as well as deliveries.",
  },
  {
    title: "Store",
    href: "/str",
    icon: ShoppingBagIcon,
    iconForeground: "text-rose-700",
    iconBackground: "bg-rose-50",
    description:
      "Click here for the Point-of-Sale system and pages to view the store's stock.",
  },
];

export function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const stats = [
    { label: "Company", value: user.company.name },
    { label: "Department", value: user.department.deptName },
    { label: `${user.payType.slice(0,1)}${user.payType.slice(1).toLowerCase()} Salary`, value: user.salary },
  ];
  const availablePaths = accessRightsMap(user.jobTitle.responsibility).map(x => paths[x]);

  return (
    <>
      <Header jobTitle={user.jobTitle.description} name={user.name} stats={stats}/>
      <Tiles actions={availablePaths}/>
    </>
  )
}