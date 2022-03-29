import { useNavigate } from "react-router-dom";
import { Tabs } from "../../../components/Tabs";

const tabs = [
  {
    id: 1,
    name: "Membership Tiers",
    href: `/sm/rewards-loyalty/tiers`,
    current: false,
  },
  {
    id: 2,
    name: "Vouchers",
    href: `/sm/rewards-loyalty/vouchers`,
    current: true,
  },
];

const Header = ({ title, buttonText }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
        <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                {title}
              </h1>
            </div>
          </div>
          <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              onClick={() => navigate("create")}
            >
              Add {!buttonText ? title.toLowerCase() : buttonText}
            </button>
          </div>
        </div>
        <div className="ml-3">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </div>
  );
};
export const ManageRewardsLoyalty = ({ title, buttonText, children }) => {
  return (
    <>
      <Header title={title} buttonText={buttonText} />
      {children}
    </>
  );
};
