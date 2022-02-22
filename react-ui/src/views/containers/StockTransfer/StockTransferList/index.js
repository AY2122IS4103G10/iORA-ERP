import { SelectableTable } from "../../../components/Tables/SelectableTable";


const columns = [
    {
        Header: "Id",
        accessor: "id",
    },
    {
        Header: "From",
        accessor: "from",
    },
    {
        Header: "To",
        accessor: "to",
    },
]



export const StockTransferList = () => {
    return (
        <SelectableTable columns={columns} data={} />
    );
}