import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    fetchSupportTickets,
    selectAllSupportTickets
} from "../../../../stores/slices/supportTicketSlice";
import { SelectColumnFilter, SimpleTable } from "../../../components/Tables/SimpleTable";
import moment from "moment";

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
    const supportTicketStatus = useSelector((state) => state.supportTickets.status);
    useEffect(() => {
        supportTicketStatus === "idle" && dispatch(fetchSupportTickets());
    }, [supportTicketStatus, dispatch]);
    console.log(data)

    const handleOnClick = (row) => navigate(`/sm/support/${row.original.id}`);

    return <SupportTicketTable data={data} handleOnClick={handleOnClick} />;

}