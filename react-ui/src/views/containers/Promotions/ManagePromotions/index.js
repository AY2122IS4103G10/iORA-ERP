import { Link } from "react-router-dom";
import { PromotionsList } from "../PromotionsList";

const header = (
  <div className="bg-white shadow">
    <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
      <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <div>
              <div className="flex items-center">
                <img
                  className="h-16 w-16 rounded-full sm:hidden"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.6&w=256&h=256&q=80"
                  alt=""
                />
                <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                  Promotions
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
          <Link to="/sm/vouchers/create">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          >
            Add promotion
          </button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export const ManagePromotions = () => {
  return (
    <>
      {header}
      {<PromotionsList />}
    </>
  );
}
