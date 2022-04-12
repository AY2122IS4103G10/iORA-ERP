import moment from "moment";
import { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { api } from "../../../../environments/Api";
import { fetchAnOrder } from "../../../../stores/slices/posSlice";

export const PosSearch = ({ subsys }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [searchCustomer, setSearchCustomer] = useState("");
  const [inputTypeSelected, setInputTypeSelected] = useState("email");
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const onSearchClicked = async (evt) => {
    evt.preventDefault();
    const { id } = search && (await dispatch(fetchAnOrder(search)).unwrap());
    id
      ? navigate(pathname.replace("search", id))
      : addToast(`Error: Customer Order not found.`, {
          appearance: "error",
          autoDismiss: true,
        });
  };

  const onSearchCustomerClicked = (evt) => {
    evt.preventDefault();
    if (Boolean(searchCustomer)) {
      const fetchCustomer = async () => {
        setLoading(true);
        try {
          const { data } = await api.get(
            inputTypeSelected === "id"
              ? `sam/customer/view`
              : `sam/customer/${inputTypeSelected}`,
            searchCustomer
          );
          setCustomerOrders(data.orders);
        } catch (error) {
          addToast(`Error: ${error.response.data}`, {
            appearance: "error",
            autoDismiss: true,
          });
        } finally {
          setLoading(false);
        }
      };
      fetchCustomer();
    }
  };

  const onSearchChanged = (e) => setSearch(e.target.value);
  const onSearchCustomerChanged = (e) => setSearchCustomer(e.target.value);
  const onInputTypeSelectedChanged = (e) =>
    setInputTypeSelected(e.target.value);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Search Customer Order by Receipt Number
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

      <div className="mt-4">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Search Customer Orders
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Enter customer email address or contact number to view their
                orders.
              </p>
            </div>
            <form
              className="mt-5 sm:flex sm:items-center"
              onSubmit={onSearchCustomerClicked}
            >
              <div className="w-full sm:max-w-xs">
                <label htmlFor="order-no" className="sr-only">
                  Customer Contact / Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type={inputTypeSelected === "email" ? "email" : "number"}
                    name="search"
                    id="search"
                    className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder={`Enter ${
                      inputTypeSelected === "email"
                        ? "email address"
                        : inputTypeSelected === "phone"
                        ? "contact number"
                        : "id"
                    }.`}
                    value={searchCustomer}
                    onChange={onSearchCustomerChanged}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <label htmlFor="type" className="sr-only">
                      Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      className="focus:ring-cyan-500 focus:border-cyan-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                      value={inputTypeSelected}
                      onChange={onInputTypeSelectedChanged}
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="id">Id</option>
                    </select>
                  </div>
                </div>
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

      {loading ? (
        <div className="flex mt-5 items-center justify-center">
          <TailSpin color="#00BCD4" height={20} width={20} />
        </div>
      ) : (
        <div className="max-h-screen mt-4 bg-white shadow overflow-auto sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {customerOrders.map((order) => {
              return (
                <li key={order.id}>
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div className="truncate">
                        <p className="text-base font-medium text-cyan-600 truncate">
                          Order #{order.id}
                        </p>
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <p>
                              {moment
                                .unix(order.dateTime / 1000)
                                .format("DD/MM/YY, HH:mm:ss")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                        <div className="ml-4 flex items-center space-x-4">
                          <p className="text-base font-medium text-gray-600 truncate">
                            ${order.totalAmount.toFixed(2)}
                          </p>
                          <div className="sm:mt-0 sm:ml-5">
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                              onClick={() =>
                                navigate(`/str/orders/${order.id}`)
                              }
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
