import { Outlet } from "react-router-dom";
import { 
    HomeIcon,
    CogIcon, 
    ClockIcon, 
    ScaleIcon, 
    CreditCardIcon, 
    QuestionMarkCircleIcon,
    ShieldCheckIcon,
    DocumentReportIcon } from "@heroicons/react/outline";

import MainWrapper from "../../components/MainWrapper";


const navigation = [
    { name: "Home", href: "/", icon: HomeIcon, current: true },
    { name: "POS", href: "/str/pos", icon: ClockIcon, current: false },
    { name: "Stock Levels", href: "/str/stocklevels", icon: ScaleIcon, current: false },
    { name: "Stock Orders", href: "#", icon: CreditCardIcon, current: false },
    { name: "Pickup Orders", href: "/str/pickup", icon: CreditCardIcon, current: false },
    { name: "Reports & Analytics", href: "#", icon: DocumentReportIcon, current: false },
  ];


  const secondaryNavigation = [
    { name: "Settings", href: "#", icon: CogIcon },
    { name: "Help", href: "#", icon: QuestionMarkCircleIcon },
    { name: "Privacy", href: "#", icon: ShieldCheckIcon },
  ];

export const StoreIndex = () => (
  <div className="h-screen bg-gray-100">
    <MainWrapper navigation={navigation} secondaryNavigation={secondaryNavigation}> 
      <Outlet />
    </MainWrapper>
  </div>
);
