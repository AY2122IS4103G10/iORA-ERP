import {Link} from "react-router-dom";
import {useState, useEffect, useMemo} from "react";
import {posApi} from "../../../../environments/Api";
import {useSelector, useDispatch} from "react-redux";
import {EditableCell, SimpleTable} from "../../../components/Tables/SimpleTable";
import {selectAllOrder} from "../../../../stores/slices/posSlice";
import {fetchSiteOrders} from "../../../../stores/slices/posSlice";
import {Header} from "../../../components/Header";

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

export const OrderTable = ({data}) => {
  const columns = useMemo(
    () => [
      {
        Header: "OrderId",
        accessor: "id",
      },
      {
        Header: "DateTime",
        accessor: "dateTime",
      },
      {
        Header: "Amount",
        accessor: (row) => row.payments.name.amount,
      },
      {
        Header: "Customer Number",
        accessor: (row) => row.customer.id,
      },
    ],
    []
  );
};
const orderTable = (data) => {
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-4 lg:-mx-6">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    OrderId
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DateTime
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Number
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only"></span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Jane Cooper
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Regional Paradigm Technician
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    jane.cooper@example.com
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Admin</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                      View
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const tabs = [
  {name: "By Site", href: "sites", current: true},
  {name: "By Products", href: "products", current: false},
];

export const PosMain = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectAllOrder);
  const orderStatus = useSelector((state) => state.pos.status);
  const siteId = useState(1);

  useEffect(() => {
    orderStatus === "idle" && dispatch(fetchSiteOrders(siteId));
  }, [orderStatus, dispatch]);

  return (
    <>
      <Header title="Order Purchase" />
    </>
  );
};
