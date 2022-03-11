import {
  ArchiveIcon,
  CogIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { api } from "../../../../environments/Api";
import { selectUserSite } from "../../../../stores/slices/userSlice";
import { NavBar } from "../../../components/NavBar";
import { SideBar } from "../../../components/SideBar";
import { EnterSiteModal } from "../../../components/Modals/EnterSiteModal";

const navigation = [
  { name: "Home", href: "/home", icon: HomeIcon, current: true },
  {
    name: "Stock Transfer",
    href: "/lg/stocktransfer",
    icon: ArchiveIcon,
    current: false,
  },
];

const secondaryNavigation = [
  { name: "Settings", href: "#", icon: CogIcon },
  { name: "Help", href: "#", icon: QuestionMarkCircleIcon },
  { name: "Privacy", href: "#", icon: ShieldCheckIcon },
];

export const LGIndex = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const siteId = useSelector(selectUserSite);
  const [sites, setSites] = useState([]);
  const [siteSelected, setSiteSelected] = useState(sites[0]);
  const [siteCode, setSiteCode] = useState("");
  const { addToast } = useToasts();

  useEffect(() => {
    api
      .getAll("admin/viewSites/all")
      .then((response) => {
        setSites(response.data);
        setSiteSelected(response.data[0]);
      })
      .then(() => siteId === 0 && openSiteModal());
  }, [siteId]);

  const handleEnterSite = (evt) => {
    evt.preventDefault();
    if (siteSelected.siteCode === siteCode.trim()) {
      localStorage.setItem("siteId", siteSelected.id);
      addToast(`Logged in to ${siteSelected.name}`, {
        appearance: "success",
        autoDismiss: true,
      });
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