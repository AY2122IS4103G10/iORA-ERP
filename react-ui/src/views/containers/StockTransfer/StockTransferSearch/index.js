import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastProvider, useToasts } from "react-toast-notifications";
import { api } from "../../../../environments/Api";
import { selectUserSite } from "../../../../stores/slices/userSlice";

export const StockTransferSearch = ({ subsys }) => {
  const { pathname } = useLocation();
  const { addToast } = useToasts();
  const currSiteId = useSelector(selectUserSite);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const onSearchChanged = (e) => setSearch(e.target.value);
  const onSearchClicked = (evt) => {
    const fetchStockTransfer = async () => {
      try {
        const { data } = await api.get("store/stockTransfer", search.trim());
        const { id, fromSite, toSite, statusHistory } = data;
        if (subsys === "lg") {
          if (
            currSiteId !== fromSite.id ||
            statusHistory[statusHistory.length - 1].status !==
              "READY_FOR_DELIVERY"
          )
            throw new Error("Not authorised to view order.");
        } else if (subsys === "str" || subsys === "wh") {
          if (currSiteId !== fromSite.id && currSiteId !== toSite.id)
            throw new Error("Not authorised to view order.");
        }
        navigate(pathname.replace("search", id));
      } catch (error) {
        addToast(
          `Error: ${
            error.response !== undefined
              ? error.response.data
              : error.message
          }`,
          {
            appearance: "error",
            autoDismiss: true,
          }
        );
        setSearch("");
      }
    };
    evt.preventDefault();
    search && fetchStockTransfer();
  };
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Search Stock Transfer Order
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Scan barcode or enter order number.</p>
            </div>
            <form
              className="mt-5 sm:flex sm:items-center"
              onSubmit={onSearchClicked}
            >
              <div className="w-full sm:max-w-xs">
                <label htmlFor="order-no" className="sr-only">
                  Order No.
                </label>
                <input
                  type="text"
                  name="order-no"
                  id="order-no"
                  className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search orders..."
                  value={search}
                  onChange={onSearchChanged}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
