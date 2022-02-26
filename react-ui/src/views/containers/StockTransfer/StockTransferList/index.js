import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllStockTransfer, selectAllOrders } from "../../../../stores/slices/stocktransferSlice";
import { SelectableTable, SelectColumnFilter } from "../../../components/Tables/SelectableTable";


const cols = [
    {
        Header: "Id",
        accessor: "id",
    },
    {
        Header: "From",
        accessor: "fromSite.name",
        Filter: SelectColumnFilter,
        filter: "includes"
    },
    {
        Header: "To",
        accessor: "toSite.name",
        Filter: SelectColumnFilter,
        filter: "includes",
    },
    {
        Header: "Status",
        accessor: (row) => row?.statusHistory?.slice(-1)[0].status
    },
    {
        Header: "Last Updated",
        accessor: (row) => {
            let timeStamp = row?.statusHistory?.slice(-1)[0].timeStamp;
            var datetime = (timeStamp[3] < 10 ? '0' + timeStamp[3] :  timeStamp[3]) + ':' + (timeStamp[4] < 10 ? '0' + timeStamp[4] :  timeStamp[4]) + " " + timeStamp[2] + "/" + timeStamp[1] + "/" + timeStamp[0]
            return datetime;

        }
    }
]



export const StockTransferList = (subsys) => {
    const dispatch = useDispatch();
    const sto = useSelector(selectAllOrders);
    const columns = useMemo(() => cols, [cols] )

    const path = `/${subsys.subsys.subsys}/stocktransfer`;
    useEffect(() => {
        dispatch(getAllStockTransfer());
    }, [])
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="mt-4">
                <SelectableTable columns={columns} data={sto} path={path}/>
            </div>
        </div>
    );
}