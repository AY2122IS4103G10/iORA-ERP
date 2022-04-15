import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { SimpleModal } from "../SimpleModal";
import SimpleSelectMenu from "../../SelectMenus/SimpleSelectMenu";

export const EnterSiteModal = ({
  open,
  closeModal,
  sites,
  siteSelected,
  setSiteSelected,
  siteCode,
  onSiteCodeChanged,
  handleEnterSite,
  disableSiteCode,
}) => {
  const navigate = useNavigate();
  return (
    <SimpleModal open={open} closeModal={closeModal}>
      <div className="inline-block align-bottom bg-white h-80 rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
        <form onSubmit={handleEnterSite}>
          <div>
            <div className="m-4 mt-2">
              <Dialog.Title
                as="h3"
                className="text-center text-lg leading-6 font-medium text-gray-900"
              >
                Choose Site and enter Site Code
              </Dialog.Title>
            </div>
            <div className="pb-3">
              <SimpleSelectMenu
                options={sites}
                selected={siteSelected}
                setSelected={setSiteSelected}
              />
            </div>
            {!disableSiteCode &&<input
              type="text"
              name="siteCode"
              id="siteCode"
              className="flex-grow shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Site Code"
              value={siteCode}
              onChange={onSiteCodeChanged}
            />}
          </div>
          <div className="pt-4">
            <div className="mt-5 grid grid-cols-1 gap-2 justify-center">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                Enter
              </button>

              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                onClick={() => navigate("/home")}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </SimpleModal>
  );
};