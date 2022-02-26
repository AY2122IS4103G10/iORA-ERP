import { SideBar } from "../../../components/SideBar";
import { HeaderWithAction } from "../../../components/HeaderWithAcction";

const exitButton = () => {
  return (
    <button
      type="button"
      class="ml-10 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      <a href="#" />
      Logout
    </button>
  );
};

export const PosMain = () => {
  return (
    <div className="bg-white shadow">
      <HeaderWithAction title="POS System" button={exitButton()}></HeaderWithAction>
    </div>
  );
};
