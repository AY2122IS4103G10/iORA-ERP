import { CheckCircleIcon } from "@heroicons/react/outline";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { orderApi } from "../../../../environments/Api";
import { selectUserSite } from "../../../../stores/slices/userSlice";
import { DashedBorderES } from "../../../components/EmptyStates/DashedBorder";
import {
  SelectColumnFilter,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";

const OrderTable = ({ data, handleOnClick }) => {
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "Customer No.",
        accessor: (row) => row.customerId,
      },
      {
        Header: "Total Amount",
        accessor: "totalAmount",
        Cell: (row) => `${row.value.toFixed(2)}`
      },
      {
        Header: "Status",
        accessor: "status",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Date Created",
        accessor: "dateTime",
        Cell: (e) => moment(e.value).format("DD/MM/YY, HH:mm:ss"),
      },
    ],
    []
  );
  return (
    <SimpleTable columns={columns} data={data} handleOnClick={handleOnClick} />
  );
};

export const OrderList = ({ subsys }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const currSiteId = parseInt(useSelector(selectUserSite));

  useEffect(() => {
    orderApi.getAll().then((response) => {
      setData(response.data);
    });
  }, [subsys, currSiteId]);

  const handleOnClick = (row) =>
    navigate(`/${subsys}/orders/${row.original.id}`);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        {Boolean(data.length) ? (
          <OrderTable data={data} handleOnClick={handleOnClick} />
        ) : subsys === "sm" ? (
          <Link to="/sm/procurements/create">
            <DashedBorderES item="order" />
          </Link>
        ) : (
          <div className="relative block w-full rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              No orders requiring attention.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
