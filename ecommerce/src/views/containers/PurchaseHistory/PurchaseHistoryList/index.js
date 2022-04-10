import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  SimpleTable,
  SelectColumnFilter,
} from "../../../components/Tables/SimpleTable";
import { selectUserOrders } from "../../../../stores/slices/userSlice";

const columns = [
  {
    Header: "#",
    accessor: "id",
  },
  {
    Header: "Date of Purchase",
    accessor: "dateTime",
    Cell: (e) => moment(e.value).format("MMMM Do, YYYY"),
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: (e) => (Boolean(e.value) ? e.value : "Completed"),
    Filter: SelectColumnFilter,
    filter: "includes",
  },
  {
    Header: "Purchase Amount",
    accessor: "totalAmount",
    Cell: (e) => `$${e.value.toFixed(2)}`,
  },
];

export const PurchaseHistoryList = () => {
  const navigate = useNavigate();
  const data = useSelector(selectUserOrders);

  const handleOnClick = (row) => navigate(`${row.original.id}`);
  return (
    <div className="min-h-full">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="max-w-6xl md:flex md:items-center md:justify-between md:space-x-5 px-3 pt-4">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
            </div>
          </div>
        </div>
        <div className="mt-8 max-w-6xl grid grid-cols-1 gap-6 lg:grid-flow-col-dense lg:grid-cols-1">
          <div className="space-y-6 lg:col-start-1 lg:col-span-2">
            <section aria-labelledby="stocks-level">
              <div className="ml-2 mr-2">
                {data === [] ? (
                  <p>No Records</p>
                ) : (
                  <SimpleTable
                    columns={columns}
                    data={data}
                    handleOnClick={handleOnClick}
                  />
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};
