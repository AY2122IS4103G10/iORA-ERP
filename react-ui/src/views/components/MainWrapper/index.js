import { useState } from "react";
import { NavBar } from "../NavBar";
import { SideBar } from "../SideBar";

export default function MainWrapper({
  navigation,
  secondaryNavigation,
  children,
  badge,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-full bg-slate-50">
      <SideBar
        navigation={navigation}
        secondaryNavigation={secondaryNavigation}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="lg:pl-64 flex flex-col flex-1">
        <NavBar setSidebarOpen={setSidebarOpen} badge={badge}/>
        <main className="flex-1 pb-8">{children}</main>
      </div>
    </div>
  );
}
