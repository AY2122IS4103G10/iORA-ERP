import { useState } from "react";
import { NavBar } from "../NavBar";
import { SideBar } from "../SideBar";

export default function MainWrapper({content}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-full">
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:pl-64 flex flex-col flex-1">
        <NavBar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 pb-8">
          {content}
        </main>
      </div>
    </div>
  );
}
