import {Link, useLocation, useMatch} from "react-router-dom";
import {useState, useSelector, useEffect, useMemo} from "react";
import {posApi} from "../../../../environments/Api";
import {EditableCell, SimpleTable} from "../../../components/Tables/SimpleTable";

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

const header = () => {
  return (
    <div className="px-4 sm:px-6 lg:max-w-5/6 lg:mx-auto lg:px-8 flex">
      <div className="w-1/6 pt-4 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200"></div>
      <div className="w-1/6 pt-4 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
        <div className="py-4 md:flex flex items-left justify-between border-b border-indigo-500 lg:border-none">
          <h1 className="ml-3 md:flex text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
            POS System
          </h1>
        </div>
      </div>
      <div className="w-3/6 py-8 pb-5 border-b border-gray-200 sm:pb-0 ">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <a
              href="/pos/order"
              className="inline-block py-4 px-4 text-sm font-medium text-center text-gray-500 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300">
              Purchase
            </a>
          </li>
          <li className="mr-2">
            <a
              href="#"
              className="inline-block py-4 px-4 text-sm font-medium text-center text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500"
              aria-current="page">
              Purchase History
            </a>
          </li>
          <li className="mr-2">
            <a
              href="#"
              className="inline-block py-4 px-4 text-sm font-medium text-center text-gray-500 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300">
              Store Pick-up
            </a>
          </li>
          <li className="mr-2">
            <a
              href="#"
              className="inline-block py-4 px-4 text-sm font-medium text-center text-gray-500 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300">
              Administrative
            </a>
          </li>
        </ul>
      </div>
      <div className="ml-12 py-6">
        <Link to={`#`}>
          <button
            type="button"
            className="ml-10 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Logout
          </button>
        </Link>
      </div>
    </div>
  );
};

export const OrderTable = ({data}) => {
  //const [site, setSite] = u
  /*const columns = useMemo(
    () => [
      {
        Header: "OrderId",
        accessor: "",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Company",
        accessor: (row) => row.company.name,
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Country",
        accessor: (row) => row.address.country,
        Filter: SelectColumnFilter,
        filter: "includes",
      },
    ],
    []
  );*/
};
const orderTable = (siteId) => {
  /*const data = useSelector(fetchSiteOrders);
  const posStatus = useSelector((state) => state.pos.status);
  const error = useSelector((state) => state.site.error);

  useEffect(() => {
    procurementsStatus === "idle" && dispatch(fetchProcurements());
  }, [procurementsStatus, dispatch]);*/

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
                    CustomerNumber
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

export const PosMain = (site) => {
  const siteId = useState(site);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    posApi.getOrders("/store/customerOrder/", siteId).then((response) => {
      setOrder(response.data);
    });
  }, [siteId]);

  return (
    <>
      <div className="bg-white shadow">{header()}</div>
      <div class="w-10/12 py-10 md:container md:mx-auto">
        <OrderTable data={order} />
      </div>
    </>
  );
};
