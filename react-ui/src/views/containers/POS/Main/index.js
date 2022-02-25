import { SideBar } from "../../../components/SideBar";
import { HeaderWithAction } from "../../../components/HeaderWithAcction";

export const PosMain = () => {
  return (
    <div className="bg-white shadow">
      <HeaderWithAction title="POS System" name="Exit">
        <button
          type="button"
          class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create
        </button>
      </HeaderWithAction>
    </div>
  );
};
