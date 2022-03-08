import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import {
  ArchiveIcon,
  CogIcon,
  FolderOpenIcon,
  ShoppingBagIcon,
  TruckIcon,
  UsersIcon,
} from "@heroicons/react/outline";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import accessRightsMap from "../../../../constants/accessRightsPaths";
import { api } from "../../../../environments/Api";
import SimpleSelectMenu from "../../../components/SelectMenus/SimpleSelectMenu";
import { useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { classNames } from "../../../../utilities/Util";

export const EnterStoreModal = ({
  open,
  closeModal,
  stores,
  store,
  setStore,
  siteCode,
  setSiteCode,
  handleEnterStore,
}) => {
  return (
    <SimpleModal open={open} closeModal={closeModal}>
      <div className="inline-block align-bottom bg-white h-80 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
        <div>
          <div className="m-4 mt-2">
            <Dialog.Title
              as="h3"
              className="text-center text-lg leading-6 font-medium text-gray-900"
            >
              Choose Store and Enter Site Code
            </Dialog.Title>
          </div>
          <div className="pb-3">
            <SimpleSelectMenu
              options={stores}
              selected={store}
              setSelected={setStore}
            />
          </div>
          <input
            type="text"
            name="siteCode"
            id="siteCode"
            className="flex-grow shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Site Code"
            value={siteCode}
            onChange={setSiteCode}
            onKeyPress={(e) => e.key === "Enter" && handleEnterStore()}
          />
        </div>
        <div className="pt-4">
          <div className="mt-5 grid grid-cols-1 gap-2 justify-center">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              onClick={handleEnterStore}
            >
              Enter
            </button>

            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </SimpleModal>
  );
};

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
                src={
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                }
                alt=""
              />
            </div>
            <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
              <p className="text-sm font-medium text-gray-600">Welcome back,</p>
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
            <span className="text-gray-900">{stat.label}</span>
            {": "}
            <span className="text-gray-600">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Tiles = ({ actions, openEnterStoreModal }) => {
  return (
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
            action.focus,
            "relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset m-4 "
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
              {action.href === "/str" ? (
                <button
                  className="focus:outline-none"
                  onClick={() => openEnterStoreModal()}
                >
                  {/* Extend touch target to entire panel */}
                  <span className="absolute inset-0" aria-hidden="true" />
                  <strong>{action.title}</strong>
                </button>
              ) : (
                <a href={action.href} className="focus:outline-none">
                  {/* Extend touch target to entire panel */}
                  <span className="absolute inset-0" aria-hidden="true" />
                  <strong>{action.title}</strong>
                </a>
              )}
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
  );
};

const paths = [
  {
    title: "Sales and Marketing",
    href: "/sm",
    icon: UsersIcon,
    focus: "focus-within:ring-indigo-500",
    iconForeground: "text-indigo-700",
    iconBackground: "bg-indigo-50",
    description:
      "View and modify product inventories. Access Customer Relations Management. Launch Procurement Orders.",
  },
  {
    title: "Administrator",
    href: "/ad",
    icon: FolderOpenIcon,
    focus: "focus-within:ring-pink-500",
    iconForeground: "text-pink-700",
    iconBackground: "bg-pink-50",
    description:
      "Access and edit business profiles of companies, departments, vendors, job titles and access rights.",
  },
  {
    title: "Manufacturing",
    href: "/mf",
    icon: CogIcon,
    focus: "focus-within:ring-yellow-500",
    iconForeground: "text-yellow-700",
    iconBackground: "bg-yellow-50",
    description: "Assist procurement orders and view all updates.",
  },
  {
    title: "Warehouse",
    href: "/wh",
    icon: ArchiveIcon,
    focus: "focus-within:ring-teal-500",
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
    description:
      "Search product inventories and stock levels to assist in logistics and movement as well as deliveries.",
  },
  {
    title: "Store",
    href: "/str",
    icon: ShoppingBagIcon,
    focus: "focus-within:ring-rose-500",
    iconForeground: "text-rose-700",
    iconBackground: "bg-rose-50",
    description:
      "Click here for the Point-of-Sale system and pages to view the store's stock.",
  },
  {
    title: "Logistics",
    href: "/lg",
    icon: TruckIcon,
    focus: "focus-within:ring-purple-500",
    iconForeground: "text-purple-700",
    iconBackground: "bg-purple-50",
    description:
      "Click here for the Point-of-Sale system and pages to view the store's stock.",
  },
];

export function Home() {
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const [openEnterStore, setOpenEnterStore] = useState(false);
  const [siteCode, setSiteCode] = useState("");
  const [storeNames, setStoreNames] = useState({ 0: "Choose one" });
  const stores = Object.keys(storeNames).map((key) => {
    return { id: key, name: storeNames[key] };
  });
  const [store, setStore] = useState(stores[0]);

  useEffect(() => {
    localStorage.removeItem("siteId");
    api.getAll("/store/storeNames").then((response) => {
      setStoreNames({ 0: "Choose one", ...response.data });
    });
  }, [setStoreNames]);

  const handleEnterStore = () => {
    api
      .getAll(`/store/storeLogin?id=${store.id}&siteCode=${siteCode}`)
      .then((response) => {
        localStorage.setItem("siteId", response.data.id);
        addToast(`Successfully logged in to ${store.name}`, {
          appearance: "success",
          autoDismiss: true,
        });
        closeEnterStoreModal();
        navigate("/str");
      })
      .catch((err) => {
        addToast(`Error: ${err.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  const openEnterStoreModal = () => setOpenEnterStore(true);
  const closeEnterStoreModal = () => setOpenEnterStore(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const stats = [
    { label: "Company", value: user.company.name },
    { label: "Department", value: user.department.deptName },
    {
      label: `${user.payType.slice(0, 1)}${user.payType
        .slice(1)
        .toLowerCase()} Salary`,
      value: `$${user.salary.toFixed(2)}`,
    },
  ];
  const availablePaths = accessRightsMap(user.jobTitle.responsibility).map(
    (x) => paths[x]
  );

  return (
    <>
      <Header
        jobTitle={user.jobTitle.description}
        name={user.name}
        stats={stats}
      />
      <Tiles
        actions={availablePaths}
        openEnterStoreModal={openEnterStoreModal}
      />
      <EnterStoreModal
        open={openEnterStore}
        closeModal={closeEnterStoreModal}
        stores={stores}
        store={store}
        setStore={(e) => setStore(e)}
        siteCode={siteCode}
        setSiteCode={(e) => setSiteCode(e.target.value)}
        handleEnterStore={handleEnterStore}
      />
    </>
  );
}
