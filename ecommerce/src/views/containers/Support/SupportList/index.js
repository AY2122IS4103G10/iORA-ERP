import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    fetchSupportTickets,
    selectAllSupportTickets
} from "../../../../stores/slices/supportTicketSlice";
import { SelectColumnFilter, SimpleTable } from "../../../components/Tables/SimpleTable";
import moment from "moment";

const SupportTicketTable = ({ data, handleOnClick }) => {
    const columns = useMemo(
        () => [
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

export const SupportList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const data = useSelector(selectAllSupportTickets);
    const supportTicketStatus = useSelector((state) => state.supportTickets.status);
    useEffect(() => {
        supportTicketStatus === "idle" && dispatch(fetchSupportTickets());
    }, [supportTicketStatus, dispatch]);
    const handleOnClick = (row) => navigate(`${row.original.id}`);

    return (
        <div className="pt-6 pb-16 sm:pb-24 mt-8 max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="text-3xl text-center font-bold text-gray-900">Support Centre</h1>
            <h2 className="text-center pt-5 pb-5">Need help? Search for your issue among existing support discussions. If your issue has not been resolved before, please create a new ticket.</h2>
            <SupportTicketTable data={data.filter((value) => value.status === "RESOLVED")} handleOnClick={handleOnClick}/>
            <h1 className="text-3xl text-center font-bold text-gray-900 pt-5 pb-5">Your Support Tickets</h1>
            <SupportTicketTable data={data.filter((value) => value.customer.id === JSON.parse(localStorage.getItem("user")).id)} handleOnClick={handleOnClick}/>
        </div>
    )
}