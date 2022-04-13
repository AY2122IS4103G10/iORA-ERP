import { CheckCircleIcon } from "@heroicons/react/outline";
import moment from "moment";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    fetchSupportTickets,
    selectAllSupportTickets
} from "../../../../stores/slices/supportTicketSlice";
import { SelectColumnFilter, SimpleTable } from "../../../components/Tables/SimpleTable";

export const SupportTicketTable = ({ data, handleOnClick }) => {
    const columns = useMemo(
        () => [
            {
                Header: "Ticket Id",
                accessor: "id",
            },
            {
                Header: "Status",
                accessor: "status",
                Filter: SelectColumnFilter,
                filter: "includes",
                Cell: (e) => (e.value === "PENDING" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Pending
                    </span>
                ) :
                    (e.value === "PENDING_CUSTOMER" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
                            Pending Customer
                        </span>
                    ) :
                        (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Resolved
                            </span>
                        ))
                ),
            },
            {
                Header: "Category",
                accessor: "category",
                Filter: SelectColumnFilter,
                filter: "includes"
            },
            {
                Header: "Subject",
                accessor: "subject",
            },
            {
                Header: "Last Response",
                accessor: (row) => `${row.messages[row.messages.length - 1]}`,
                Cell: (e) => moment(e.timeStamp).format("DD/MM/YY, hh:mm")
            }
        ],
        []
    );

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="mt-4">
                <SimpleTable
                    columns={columns}
                    data={data}
                    handleOnClick={handleOnClick}
                />
            </div>
        </div>
    );
};

export const SupportTicketList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const data = useSelector(selectAllSupportTickets);
    useEffect(() => {
        dispatch(fetchSupportTickets());
    }, [dispatch]);

    const handleOnClick = (row) => navigate(`/sm/support/${row.original.id}`);

    return Boolean(data.length) ? (
        <SupportTicketTable data={data} handleOnClick={handleOnClick} />
    ) : (
        <div className="relative block w-full rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
                No tickets requiring attention.
            </span>
        </div>
    )
        ;

}