import { HeaderWithAction } from "../../../components/HeaderWithAcction";
import { Link, useLocation, useMatch } from "react-router-dom";

export const PosOrder = () => {
  return (
    <>
      <div className="bg-white shadow">
        <nav class="w-11/12 mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div class="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
            <div class="flex items-center">
              <h1 className="ml-10 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                Purchase
              </h1>
            </div>
            <div class="ml-12 space-x-4">
              <Link to={`/pos/main`}>
                <button
                  type="button"
                  class="ml-10 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Main Page
                </button>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};
