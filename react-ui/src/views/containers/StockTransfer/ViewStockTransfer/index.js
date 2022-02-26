import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { PencilIcon } from "@heroicons/react/solid";

import { getStockTransfer, selectStockTransferOrder, cancelStockTransfer } from "../../../../stores/slices/stocktransferSlice";
import { selectUserSite } from "../../../../stores/slices/userSlice";
import ConfirmCancel from "../../../components/Modals/ConfirmCancel";
import { SortDownIcon, SortUpIcon, SortIcon } from "../../../components/Tables/Icons";
import { SimpleTable } from "../../../components/Tables/SimpleTable";



export const StockTransferHeader = ({ orderId, status, userSiteId, fromSiteId, toSiteId, orderMadeBy, openDeleteModal }) => {


    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <div className="mt-8 flex items-center space-x-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{`Stock Transfer Order #${orderId}`}</h1>
                </div>
                <div className="mt-6 absolute right-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
                    {status !== "CANCELLED" && userSiteId === orderMadeBy ?
                        <Link to={`/sm/stocktransfer/edit/${orderId}`}>
                            <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none"
                            >
                                <span>Edit order</span>
                                <PencilIcon
                                    className="ml-2 h-5 w-5 text-white"
                                    aria-hidden="true"
                                />
                            </button>
                        </Link> 
                        : ""}

                    {userSiteId === orderMadeBy && status === "PENDING" ?
                        <button
                            type="button"
                            className="inline-flex items-center px-3 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            onClick={openDeleteModal}
                        >
                            <span>Cancel order</span>
                        </button> : ""}

                    {/* Accept order if status is pending:
                        1) By FROM site if order created by SM
                        2) By TO site if order created by FROM store itself */}
                    {((userSiteId === fromSiteId && userSiteId !== orderMadeBy) || (userSiteId === toSiteId && fromSiteId === orderMadeBy)) && status === "PENDING" ?
                        <button
                            type="button"
                            className="inline-flex items-center px-3 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                            <span>Confirm </span>
                        </button> : ""}

                </div>
            </div>

        </div>
    )
}

export const LineItems = (lineItems) => {

    const columns = useMemo(
        () => ([
            // {
            //     id: "expander", 
            //     Header: ({getToggleAllRowsExpandedProps, isAllRowsExpanded}) => (
            //         <span {...getToggleAllRowsExpandedProps()}>
            //             {isAllRowsExpanded ?  
            //                 <SortUpIcon className="w-4 h-4 text-gray-400" /> 
            //                 : <SortDownIcon className="w-4 h-4 text-gray-400" /> }
            //         </span>
            //     ), 
            //     Cell : ({row}) => 
            //     row.canExpand ? (
            //         <span
            //             {...row.getToggleAllRowsExpandedProps({
            //                 style: {
            //                     paddingLeft: "2rem"
            //                 }
            //             })}>

            //         </span>
            //     ) : null
            // }, 
            {
                Header: "SKU",
                accessor: (row) => row.product.sku,
            },
            {
                Header: "Color",
                accessor: (row) =>
                    row.product.productFields.find(
                        (field) => field.fieldName === "COLOUR"
                    ).fieldValue,
            },
            {
                Header: "Size",
                accessor: (row) =>
                    row.product.productFields.find((field) => field.fieldName === "SIZE")
                        .fieldValue,
            },
            {
                Header: "Requested Qty",
                accessor: "requestedQty"
            },
            {
                Header: "Actual Qty",
                accessor: "actualQty"
            },
        ]), []);

    return (
        <div className="mt-8 p-2">
            <div className="md:flex md:items-center md:justify-between align-middle">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Summary</h3>
                <div className="flex space-x-3 md:mt-0 md:ml-4">
                    <button>
                    </button>
                </div>
            </div>
            <div className="mt-4">
                <SimpleTable
                    columns={columns}
                    data={lineItems.lineItems}
                />
            </div>
        </div>
    );
}


export const StockTransferBody = ({ lineItems, status, fromSite, fromSiteCode, fromSitePhone, toSite, toSiteCode, toSitePhone, orderMadeBy }) => {





    return (
        <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
            <div className="space-y-6 lg:col-start-1 lg:col-span-2">
                <section aria-labelledby="stocktransfer-view">
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 grid grid-cols-2">
                            <h2 id="applicant-information-title" className="text-lg leading-6 font-medium text-gray-900">
                                Order Information
                            </h2>
                            <div className="flex justify-end">
                                {/* <dt className="text-sm font-medium text-black-500">Status:  {status}</dt> */}

                                {/* <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {status}
                            </span> */}
                            </div>
                        </div>

                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <dl className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{status}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Created By</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{orderMadeBy}</dd>
                                </div>

                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">From</dt>
                                    <dd className="mt-1 text-sm text-gray-900">Site Code: {fromSiteCode}</dd>
                                    <dd className="mt-1 text-sm text-gray-900">Name: {fromSite}</dd>
                                    <dd className="mt-1 text-sm text-gray-900">Phone: {fromSitePhone} </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">To</dt>
                                    <dd className="mt-1 text-sm text-gray-900">Site Code: {toSiteCode}</dd>
                                    <dd className="mt-1 text-sm text-gray-900">Name: {toSite}</dd>
                                    <dd className="mt-1 text-sm text-gray-900">Phone: {toSitePhone}</dd>
                                </div>


                            </dl>
                        </div>
                    </div>
                    <LineItems lineItems={lineItems} />
                </section>
            </div>
        </div>
    );
}



export const ViewStockTransfer = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const userSiteId = useSelector(selectUserSite);
    const userStatus = useSelector((state) => state.user.status);
    const order = useSelector(selectStockTransferOrder);

    const [openDelete, setOpenDelete] = useState(false);
    const openDeleteModal = () => setOpenDelete(true);
    const closeDeleteModal = () => setOpenDelete(false);

    const handleConfirmCancel = () => {
        dispatch(cancelStockTransfer({ orderId: id, siteId: userSiteId }))
            .unwrap()
            .then(() => {
                alert("Successfully cancelled stock transfer order");
                closeDeleteModal();
                navigate('/sm/stocktransfer');
            })
            .catch((error) => {
                alert(error.message);
            })
    }


    useEffect(() => {
        dispatch(getStockTransfer(id))
    }, [userStatus])


    return (
        Boolean(Object.keys(order) != 0) && (
            <>
                <StockTransferHeader
                    orderId={id}
                    userSiteId={userSiteId}
                    fromSiteId={order.fromSite.id}
                    toSiteId={order.toSite.id}
                    status={order.statusHistory[order.statusHistory.length - 1].status}
                    orderMadeBy={order.statusHistory[0].actionBy.id}
                    openDeleteModal={openDeleteModal}
                />
                <StockTransferBody
                    lineItems={order.lineItems}
                    status={
                        order.statusHistory[order.statusHistory.length - 1].status
                    }
                    fromSite={order.fromSite.name}
                    fromSiteCode={order.fromSite.siteCode}
                    fromSitePhone={order.fromSite.phoneNumber}
                    toSite={order.toSite.name}
                    toSiteCode={order.toSite.siteCode}
                    toSitePhone={order.toSite.phoneNumber}
                    orderMadeBy={order.statusHistory[0].actionBy.name}
                />
                <ConfirmCancel
                    item={`Stock Transfer Order #${id}`}
                    open={openDelete}
                    closeModal={closeDeleteModal}
                    onConfirm={handleConfirmCancel}
                />
            </>
        )
    );
}