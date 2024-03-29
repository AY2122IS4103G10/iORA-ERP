import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { classNames } from "../../../utilities/Util";

export const Tabs = ({ tabs }) => {
  const { pathname } = useLocation();
  const [currTab, setCurrTab] = useState("");

  const changeTab = (tabnumber) => setCurrTab(tabnumber);
  
  return (
    <div className="sm:block">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab, i) => (
          <Link
            key={tab.name}
            to={tab.href}
            className={classNames(
              currTab === i || pathname.endsWith(tab.href)
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
              "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
            )}
            aria-current={tab.current ? "page" : undefined}
            onClick={() => changeTab(i)}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};
