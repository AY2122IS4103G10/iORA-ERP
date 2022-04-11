import { CheckCircleIcon } from "@heroicons/react/outline";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { onlineOrderApi, orderApi } from "../../../../environments/Api";
import { selectUserSite } from "../../../../stores/slices/userSlice";
import {
  SelectColumnFilter,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";

const OrderTable = ({ data, handleOnClick, type }) => {
  const columns = useMemo(
    () =>
      type === "online"
        ? [
            {
              Header: "#",
              accessor: "id",
            },
            {
              Header: "Status",
              accessor: (row) =>
                row.statusHistory
                  ? row.statusHistory[row.statusHistory.length - 1].status
                  : "[status]",
              Filter: SelectColumnFilter,
              filter: "includes",
            },
            {
              Header: "Customer No.",
              accessor: (row) => row.customerId,
            },
            {
              Header: "Total Amount",
              accessor: "totalAmount",
              Cell: (row) => `${row.value.toFixed(2)}`,
            },
            {
              Header: "Date",
              accessor: "dateTime",
              Cell: (e) => moment(e.value).format("DD/MM/YY, HH:mm:ss"),
            },
          ]
        : [
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
              Cell: (row) => `${row.value.toFixed(2)}`,
            },
            {
              Header: "Date",
              accessor: "dateTime",
              Cell: (e) => moment(e.value).format("DD/MM/YY, HH:mm:ss"),
            },
          ],
    [type]
  );
  return (
    <SimpleTable columns={columns} data={data} handleOnClick={handleOnClick} />
  );
};

export const OrderList = ({ subsys, type }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const currSiteId = parseInt(useSelector(selectUserSite));

  useEffect(() => {
    setLoading(true);
    const fetchStoreOrders = async () => {
      const { data } = await orderApi.getAllStore();
      setData(data);
    };

    const fetchOnlineOrders = async () => {
      const { data } = await orderApi.getAllOnline();
      setData(data);
    };

    const fetchOnlineBySite = async (currSiteId) => {
      const { data } = await onlineOrderApi.getAllBySite(currSiteId);
      setData(data);
    };

    if (subsys === "sm") {
      if (type === "store") fetchStoreOrders().then(() => setLoading(false));
      else fetchOnlineOrders().then(() => setLoading(false));
    } else fetchOnlineBySite(currSiteId).then(() => setLoading(false));
  }, [subsys, currSiteId, type]);

  const handleOnClick = (row) =>
    navigate(`/${subsys}/orders/${row.original.id}`);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        {loading ? (
          <div className="flex mt-5 items-center justify-center">
            <TailSpin color="#00BCD4" height={20} width={20} />
          </div>
        ) : Boolean(data.length) ? (
          <OrderTable data={data} handleOnClick={handleOnClick} type={type} />
        ) : (
          <div className="relative block w-full rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
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
