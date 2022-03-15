import { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllStockTransfer,
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

  const columns = useMemo(() => cols, []);
  const path = `/${subsys}/stocktransfer`;
  useEffect(() => {
    dispatch(updateCurrSite());
    dispatch(getAllStockTransfer(currSiteId));
  }, [dispatch, currSiteId]);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        {Boolean(sto.length) ? (
          <SelectableTable columns={columns} data={sto} path={path} />
        ) : (
          pathname.includes("sm") && (
            <Link to="/sm/stockTransfer/create">
              <DashedBorderES item="stock transfer" />
            </Link>
          )
        )}
      </div>
    </div>
  );
};
