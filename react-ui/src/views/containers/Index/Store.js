import { Outlet } from "react-router-dom";
import { 
    HomeIcon, 
    ClockIcon, 
    ScaleIcon, 
    CreditCardIcon, 
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

export const StoreIndex = () => (
  <div className="h-screen bg-gray-100">
    <MainWrapper navigation={navigation}> 
      <Outlet />
    </MainWrapper>
  </div>
);
