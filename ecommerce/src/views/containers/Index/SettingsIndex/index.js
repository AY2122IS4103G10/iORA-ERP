import { Outlet } from "react-router-dom";
import {
  StarIcon,
  CogIcon,
  ShoppingBagIcon,
  UserCircleIcon,
} from "@heroicons/react/outline";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { classNames } from "../../../../utilities/Util";

const subNavigation = [
  { name: "Profile", href: "/settings/profile", icon: UserCircleIcon },
  { name: "Account", href: "/settings/account", icon: CogIcon },
  { name: "Your orders", href: "/orders", icon: ShoppingBagIcon },
  { name: "Your membership", href: "/membership", icon: StarIcon },
];

export const SettingsIndex = () => {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-gray-100 max-w-7xl mx-auto pb-10 lg:py-12 lg:px-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
        <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <nav className="space-y-1">
            {subNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  pathname.includes(item.href)
                    ? "bg-gray-50 text-indigo-600 hover:bg-white"
                    : "text-gray-900 hover:text-gray-900 hover:bg-gray-50",
                  "group rounded-md px-3 py-2 flex items-center text-sm font-medium"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                <item.icon
                  className={classNames(
                    pathname.includes(item.href)
                      ? "text-indigo-500"
                      : "text-gray-400 group-hover:text-gray-500",
                    "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>
        <Outlet />
      </div>
    </div>
  );
};
