import { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllStockTransfer,
  getLogisticsSTOBySite,
  selectAllOrders,
} from "../../../../stores/slices/stocktransferSlice";
import {
  selectUserSite,
  updateCurrSite,
} from "../../../../stores/slices/userSlice";
import {
  SelectableTable,
  SelectColumnFilter,
} from "../../../components/Tables/SelectableTable";
import { DashedBorderES } from "../../../components/EmptyStates/DashedBorder";
import moment from "moment";
import { TailSpin } from "react-loader-spinner";
import { CheckCircleIcon } from "@heroicons/react/outline";

const cols = [
  {
    Header: "Id",
    accessor: "id",
  },
  {
    Header: "From",
    accessor: "fromSite.name",
    Filter: SelectColumnFilter,
    filter: "includes",
  },
  {
    Header: "To",
    accessor: "toSite.name",
    Filter: SelectColumnFilter,
    filter: "includes",
  },
  {
    Header: "Status",
    accessor: (row) => row.statusHistory[row.statusHistory.length - 1].status,
    Filter: SelectColumnFilter,
    filter: "includes",
  },
  {
    Header: "Last Updated",
    accessor: (row) =>
      moment
        .unix(row.statusHistory[row.statusHistory.length - 1].timeStamp / 1000)
        .format("DD/MM/YY, HH:mm:ss"),
  },
];

export const StockTransferList = ({ subsys }) => {
  const dispatch = useDispatch();
  const sto = useSelector(selectAllOrders);
  const { pathname } = useLocation();
  let currSiteId = useSelector(selectUserSite);
  const stOrderStatus = useSelector((state) => state.stocktransfer.status);

  const columns = useMemo(() => cols, []);
  const path = `/${subsys}/stocktransfer`;
  useEffect(() => {
    dispatch(updateCurrSite());
    dispatch(
      subsys === "lg"
        ? getLogisticsSTOBySite(currSiteId)
        : getAllStockTransfer(currSiteId)
    );
  }, [dispatch, currSiteId, subsys]);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        {stOrderStatus === "loading" ? (
          <div className="flex mt-5 items-center justify-center">
            <TailSpin color="#00BFFF" height={20} width={20} />
          </div>
        ) : Boolean(sto.length) ? (
          <SelectableTable columns={columns} data={sto} path={path} />
        ) : pathname.includes("sm") ? (
          <Link to="/sm/stockTransfer/create">
            <DashedBorderES item="stock transfer" />
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
