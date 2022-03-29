import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { orderApi } from "../../../../environments/Api";

export const OrderSearch = ({ subsys }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { addToast } = useToasts();

  const canSearch = Boolean(search);
  const onSearchClicked = (evt) => {
    evt.preventDefault();
    if (canSearch)
      orderApi.get(search)
        .then((response) => {
          if (response.data !== "")
            navigate(pathname.replace("search", response.data.id));
          else
            addToast(`Error: Online Order not found.`, {
              appearance: "error",
              autoDismiss: true,
            });
        });
  };

  const onSearchChanged = (e) => setSearch(e.target.value);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Search Order
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
