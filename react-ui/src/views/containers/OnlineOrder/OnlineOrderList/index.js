import { CheckCircleIcon } from "@heroicons/react/outline";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { api, onlineOrderApi } from "../../../../environments/Api";
import { selectUserSite } from "../../../../stores/slices/userSlice";
import {
  SelectColumnFilter,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";

const OnlineOrderTable = ({ data, handleOnClick }) => {
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "Status",
        accessor: (row) =>
          row.statusHistory[row.statusHistory.length - 1].status,
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Customer No.",
        accessor: "customerId",
      },
      {
        Header: "Total Amount",
        accessor: "totalAmount",
        Cell: (e) => `$${e.value.toFixed(2)}`,
      },
      {
        Header: "Updated",
        accessor: "dateTime",
        Cell: (e) => moment.unix(e.value / 1000).format("DD/MM/YY, HH:mm:ss"),
      },
    ],
    []
  );
  return (
    <SimpleTable columns={columns} data={data} handleOnClick={handleOnClick} />
  );
};

export const OnlineOrderList = ({ subsys }) => {
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const currSiteId = parseInt(useSelector(selectUserSite));

  useEffect(() => {
    const fetchOnlineOrdersOfSite = async () => {
      setLoading(true);
      try {
        const { data } = await (subsys === "str"
          ? onlineOrderApi.getAllPickupOfSite(currSiteId)
          : subsys === "lg"
          ? api.getAll(`online/order/${currSiteId}/READY_FOR_DELIVERY`)
          : onlineOrderApi.getAllBySite(currSiteId));

        if (subsys === "lg") {
          setData(data.filter((order) => !order.delivery));
        } else {
          setData(data);
        }
        setLoading(false);
      } catch (error) {
        addToast(`Error: ${error.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    };
    fetchOnlineOrdersOfSite();
  }, [currSiteId, addToast, subsys]);

  const handleOnClick = (row) =>
    navigate(`/${subsys}/orders/${row.original.id}`);

  return loading ? (
    <div className="flex mt-5 items-center justify-center">
      <TailSpin color="#00BFFF" height={20} width={20} />
    </div>
  ) : (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        {Boolean(data.length) ? (
          <OnlineOrderTable data={data} handleOnClick={handleOnClick} />
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
