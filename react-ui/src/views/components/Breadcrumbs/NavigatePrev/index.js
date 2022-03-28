import { Link } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/solid";

export const NavigatePrev = () => {
  return (
    <nav
      className="flex items-start px-2 py-3 sm:px-4 lg:px-6"
      aria-label="Breadcrumb"
    >
      <Link
        to={-1}
        className="inline-flex items-center space-x-3 text-sm font-medium text-gray-900"
      >
        <ChevronLeftIcon
          className="-ml-2 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
        <span>Back</span>
      </Link>
    </nav>
  );
};
