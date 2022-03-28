import { CheckIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

const ConfirmCollection = ({
  title,
  body,
  onCancelClicked,
  onConfirmClicked,
}) => {
  return (
    <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-sm transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
      <div>
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{body}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:col-start-2 sm:text-sm"
          onClick={onCancelClicked}
        >
          Cancel
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:col-start-1 sm:text-sm"
          onClick={onConfirmClicked}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export const OnlineOrderCollection = () => {
  const { orderId, subsys, status, pickupSite, currSiteId } =
    useOutletContext();
  const navigate = useNavigate();

  const onConfirmClicked = () => {};
  const onCancelClicked = () => navigate(-1);
  
  return (
    <div className="space-y-6 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-12 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
      <div className="space-y-6 lg:col-start-1 lg:col-span-2">
        {status.status === "READY_FOR_COLLECTION" &&
        pickupSite.id === currSiteId ? (
          <div className="flex justify-center">
            <ConfirmCollection
              subsys={subsys}
              orderId={orderId}
              title={"Confirm collection"}
              body={`Confirm order collected? This action cannot be undone.`}
              onCancelClicked={onCancelClicked}
              onConfirmClicked={onConfirmClicked}
            />
          </div>
        ) : (
          <div className="relative block w-full rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
            <span className="mt-2 block text-base font-medium text-gray-900">
              No items to collect.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
