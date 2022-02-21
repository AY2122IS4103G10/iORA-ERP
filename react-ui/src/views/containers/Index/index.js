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
  { name: "Products", href: "/sm/products", icon: ClockIcon, current: false },
  { name: "Stock Levels", href: "/sm/stocklevels", icon: ScaleIcon, current: false },
  { name: "Stock Orders", href: "#", icon: CreditCardIcon, current: false },
  { name: "Vouchers", href: "/sm/vouchers", icon: CreditCardIcon, current: false },
  { name: "Reports & Analytics", href: "#", icon: DocumentReportIcon, current: false },
];

export const Index = () => (
  <div className="h-screen bg-gray-100">
    <MainWrapper navigation={navigation}> 
      <Outlet />
    </MainWrapper>
  </div>
);
