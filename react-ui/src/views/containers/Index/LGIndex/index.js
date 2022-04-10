import {
  CogIcon,
  DocumentTextIcon,
  LogoutIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TruckIcon,
} from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { sitesApi } from "../../../../environments/Api";
import {
  selectUserSite,
  updateCurrSite,
} from "../../../../stores/slices/userSlice";
import { EnterSiteModal } from "../../../components/Modals/EnterSiteModal";
import { NavBar } from "../../../components/NavBar";
import { SideBar } from "../../../components/SideBar";

const navigation = [
  { name: "Exit Subsystem", href: "/home", icon: LogoutIcon, current: true },
  {
    name: "Procurement",
    href: "/lg/procurements",
    icon: DocumentTextIcon,
    current: false,
  },
  {
    name: "Stock Transfer",
    href: "/lg/stocktransfer",
    icon: TruckIcon,
    current: false,
  },
  {
    name: "Online Order",
    href: "/lg/orders",
    icon: ShoppingBagIcon,
    current: false,
  },
];

const secondaryNavigation = [
  { name: "Settings", href: "/account/settings", icon: CogIcon },
  { name: "Help", href: "#", icon: QuestionMarkCircleIcon },
  { name: "Privacy", href: "#", icon: ShieldCheckIcon },
];

export const LGIndex = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const siteId = useSelector(selectUserSite);
  const [sites, setSites] = useState([]);
  const [siteSelected, setSiteSelected] = useState(sites[0]);
  const [siteCode, setSiteCode] = useState("");
  const { addToast } = useToasts();

  useEffect(() => {
    const fetchAllSites = async () => {
      const { data } = await sitesApi.getAll();
      setSites(data);
      setSiteSelected(data[0]);
      siteId === 0 && openSiteModal();
    };
    fetchAllSites();
  }, [siteId]);

  const handleEnterSite = (evt) => {
    evt.preventDefault();
    if (siteSelected.siteCode === siteCode.trim()) {
      localStorage.setItem("siteId", siteSelected.id);
      addToast(`Logged in to ${siteSelected.name}`, {
        appearance: "success",
        autoDismiss: true,
      });
      dispatch(updateCurrSite());
      setSiteCode("");
      closeSiteModal();
    } else {
      addToast("Error: Invalid site code. Please try again.", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  const onSiteCodeChanged = (e) => setSiteCode(e.target.value);

  const openSiteModal = () => setOpen(true);
  const closeSiteModal = () => setOpen(false);

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
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                Logistics
              </span>
            </div>
          }
        />
        <main className="flex-1 pb-8 ">
          <>
            <Outlet />
            {[sites, siteSelected, setSiteSelected].every(Boolean) && (
              <EnterSiteModal
                open={open}
                closeModal={siteId !== 0 ? closeSiteModal : openSiteModal}
                sites={sites}
                siteSelected={siteSelected}
                setSiteSelected={setSiteSelected}
                siteCode={siteCode}
                onSiteCodeChanged={onSiteCodeChanged}
                handleEnterSite={handleEnterSite}
              />
            )}
          </>
        </main>
      </div>
    </div>
  );
};
