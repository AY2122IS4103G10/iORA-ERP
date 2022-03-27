import { CheckCircleIcon } from "@heroicons/react/outline";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { api, logisticsApi } from "../../../../environments/Api";
import { selectUserSite } from "../../../../stores/slices/userSlice";
import { DashedBorderES } from "../../../components/EmptyStates/DashedBorder";
import {
  SelectColumnFilter,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";

export const ProcurementTable = ({ data, handleOnClick }) => {
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
        Header: "HQ",
        accessor: (row) => row.headquarters,
      },
      {
        Header: "Manufacturing",
        accessor: (row) =>
          Boolean(row.manufacturing) ? row.manufacturing : "-",
      },
      {
        Header: "Warehouse",
        accessor: (row) => row.warehouse,
      },
      {
        Header: "Last Updated",
        accessor: (row) =>
          moment
            .unix(
              row.statusHistory[row.statusHistory.length - 1].timeStamp / 1000
            )
            .format("DD/MM/YY, HH:mm:ss"),
      },
    ],
    []
  );
  return (
    <SimpleTable columns={columns} data={data} handleOnClick={handleOnClick} />
  );
};

export const ProcurementList = ({ subsys }) => {
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const currSiteId = parseInt(useSelector(selectUserSite));

  useEffect(() => {
    const fetchAllProcurement = async () => {
      setLoading(true);
      try {
        const { data } = await (subsys === "lg"
          ? logisticsApi.getPOBySiteStatus(currSiteId, "READY_FOR_SHIPPING")
          : api.getAll(
              subsys === "sm"
                ? "sam/procurementOrder/all"
                : `manufacturing/procurementOrder/site/${currSiteId}`
            ));
        setData(data);
      } catch (err) {
        addToast(`Error: ${err.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAllProcurement();
  }, [subsys, currSiteId, addToast]);

  const handleOnClick = (row) =>
    navigate(`/${subsys}/procurements/${row.original.id}`);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        {loading ? (
          <div className="flex mt-5 items-center justify-center">
            <TailSpin color="#00BFFF" height={20} width={20} />
          </div>
        ) : Boolean(data.length) ? (
          <ProcurementTable data={data} handleOnClick={handleOnClick} />
        ) : subsys === "sm" ? (
          <Link to="/sm/procurements/create">
            <DashedBorderES item="procurement order" />
          </Link>
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
