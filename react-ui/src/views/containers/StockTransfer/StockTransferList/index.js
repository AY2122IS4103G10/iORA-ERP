import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllStockTransfer,
  selectAllOrders,
} from "../../../../stores/slices/stocktransferSlice";
import { selectUserSite } from "../../../../stores/slices/userSlice";
import {
  SelectableTable,
  SelectColumnFilter,
} from "../../../components/Tables/SelectableTable";
import { DashedBorderES } from "../../../components/EmptyStates/DashedBorder";

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
    accessor: (row) => row?.statusHistory?.slice(-1)[0].status,
    Filter: SelectColumnFilter,
    filter: "includes",
  },
  {
    Header: "Last Updated",
    accessor: (row) => {
      let timeStamp = row?.statusHistory?.slice(-1)[0].timeStamp;
      var datetime =
        (timeStamp[3] < 10 ? "0" + timeStamp[3] : timeStamp[3]) +
        ":" +
        (timeStamp[4] < 10 ? "0" + timeStamp[4] : timeStamp[4]) +
        " " +
        timeStamp[2] +
        "/" +
        timeStamp[1] +
        "/" +
        timeStamp[0];
      return datetime;
    },
  },
];

export const StockTransferList = ({subsys}) => {
    const dispatch = useDispatch();
    // const status = useSelector((state) => state.stocktransfer.status)
    const sto = useSelector(selectAllOrders);
    let currSiteId = useSelector(selectUserSite);

    const columns = useMemo(() => cols, [])
    const path = `/${subsys.subsys}/stocktransfer`;

  useEffect(() => {
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
