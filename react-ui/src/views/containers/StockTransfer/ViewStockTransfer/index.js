import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { PencilIcon } from "@heroicons/react/solid";
import { Dialog } from "@headlessui/react";

import { 
    getStockTransfer, 
    selectStockTransferOrder, 
    cancelStockTransfer, 
    rejectStockTransfer, 
    confirmStockTransfer, 
    readyStockTransfer, 
    completeStockTransfer } from "../../../../stores/slices/stocktransferSlice";
import { selectUserSite } from "../../../../stores/slices/userSlice";
import Confirmation from "../../../components/Modals/Confirmation";
import { EditableCell } from "../../../components/Tables/SimpleTable";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import { XIcon } from "@heroicons/react/solid";
import { SimpleTable } from "../../../components/Tables/SimpleTable";

export const VerifyItemsModal = ({ open, closeModal, lineItems, status, userSiteId, 
    fromSiteId, toSiteId, setLineItems,handleReadyOrder, handleCompleteOrder }) => {

        console.log("Verify");
        console.log(lineItems);
    return (
        <SimpleModal open={open} closeModal={closeModal}>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:min-w-full sm:p-6 md:min-w-full lg:min-w-max">
                <div>
                    <div className="mt-3 sm:mt-5">
                        <Dialog.Title
                            as="h3"
                            className="text-center text-lg leading-6 font-medium text-gray-900"
                        >
                            Verify Quantity
                        </Dialog.Title>
                        <LineItems lineItems={lineItems} status={status} userSiteId={userSiteId} fromSiteId={fromSiteId} toSiteId={toSiteId} setLineItems={setLineItems} />
                    </div>
                </div>
                <div className="pt-5">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                            onClick={userSiteId === fromSiteId && status === "CONFIRMED" ? handleReadyOrder : handleCompleteOrder }
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </SimpleModal>
    );
}




export const StockTransferHeader = ({ orderId, status, userSiteId, fromSiteId, toSiteId, orderMadeBy,
    openDeleteModal, openRejectModal, handleConfirmOrder, openVerifyItemsModal }) => {


    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <div className="mt-8 flex items-center space-x-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{`Stock Transfer Order #${orderId}`}</h1>
                </div>
                <div className="mt-6 absolute right-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
                    {status === "PENDING" && userSiteId === orderMadeBy ?
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
                        <>
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                onClick={handleConfirmOrder}
                            >
                                <span>Confirm </span>
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
                                onClick={openRejectModal}
                                disabled={status !== "PENDING"}
                            >
                                <XIcon
                                    className="-ml-1 mr-2 h-5 w-5 text-white"
                                    aria-hidden="true"
                                />
                                <span>Reject</span>
                            </button>
                        </>
                        : ""}

                    {userSiteId === fromSiteId && status === "CONFIRMED" ?
                        (<button
                            type="button"
                            className="inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            onClick={openVerifyItemsModal}
                        >
                            {/* Enter qty sent */}                                                                                                                                                                                                                                                                                                                                                                                 
                            <span>Ready for Delivery</span>
                        </button>) : ""}

                    {userSiteId === fromSiteId && (status === "READY" || status === "DELIVERING") ?
                        (<button
                            type="button"
                            className="inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            onClick={openVerifyItemsModal}
                        >
                            {/* Enter actual qty received */}
                            <span>Complete Order</span>
                        </button>) : ""}

                </div>
            </div>

        </div>
    )
}

export const LineItems = (lineItems, status, userSiteId, fromSiteId, toSiteId, setLineItems) => {
    const [skipPageReset, setSkipPageReset] = useState(false);

    const columns = useMemo(() => {
        const updateMyData = (rowIndex, columnId, value) => {
            setSkipPageReset(true);
            setLineItems((old) =>
                old.map((row, index) => {
                    if (index === rowIndex) {
                        return {
                            ...old[rowIndex],
                            [columnId]: value,
                        };
                    }
                    return row;
                })
            );
        };
        return [
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
                Header: "Sent Qty",
                accessor: "sentQty",
                disableSortBy: true,
                Cell: (row) => {
                    return status === "CONFIRMED" && userSiteId === fromSiteId ? (
                        <EditableCell value={0} row={row.row} column={row.column} updateMyData={updateMyData} />
                    ) : (
                        <span>{row.row.sentQty}</span>
                        );
                }
            },
            {
                Header: "Received Qty",
                accessor: "actualQty",
                disableSortBy: true,
                Cell: (row) => {
                    return (status === "READY" || status === "DELIVERING") && userSiteId === toSiteId ? (
                        <EditableCell value={0} row={row.row} column={row.column} updateMyData={updateMyData} />
                    ) : ("-");
                }
            },
        ]
    }, []);

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
                    <LineItems lineItems={lineItems} status={status} />
                </section>
            </div>
        </div>
    );
}



export const ViewStockTransfer = (subsys) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { pathname } = useLocation();
    let userSiteId = useSelector(selectUserSite);
     //get user site id
     if (userSiteId === 0) {
        if (pathname.includes("sm")) {
            userSiteId = 1
        } else if (pathname.includes("wh")) {
            userSiteId = 2
        }
    }
    console.log(userSiteId);

    const userStatus = useSelector((state) => state.user.status);
    var order = useSelector(selectStockTransferOrder);
    const [lineItems, setLineItems] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);
    const [openReject, setOpenReject] = useState(false);
    const [openVerifyItems, setOpenVerifyItems] = useState(false);


    useEffect(() => {
        dispatch(getStockTransfer(id))
            .unwrap()
            .then((response) => {
                order = response.data;
                if (order !== undefined && order !== null) {
                    setLineItems(order.lineItems);
                }
            })
            .catch((err) => alert(err.message))
    }, [userStatus, userSiteId, openVerifyItems, openDelete])


   
    const openDeleteModal = () => setOpenDelete(true);
    const closeDeleteModal = () => setOpenDelete(false);

    const openRejectModal = () => setOpenReject(true);
    const closeRejectModal = () => setOpenReject(false);

    
    const openVerifyItemsModal = () => {
        const orderStatus = order.statusHistory[order.statusHistory.length - 1].status
        let temp = order.lineItems;
        if (orderStatus === "CONFIRMED") {
            temp = order.lineItems.map((item) => ({
                ...item, 
                sentQty: item.requestedQty
            }))
            console.log(orderStatus === "CONFIRMED" && userSiteId === order.fromSite.id);
            
        }
        if (orderStatus === "DELIVERING" || orderStatus ==="READY") {
            temp = order.lineItems.map((item) => ({
                ...item, 
                actualQty: item.sentQty
            }))
        }

        setLineItems(temp)
        setOpenVerifyItems(true);
    }
    const closeVerifyItemsModal = () => setOpenVerifyItems(false);
    
    const handleReadyOrder = (e) => {
        e.preventDefault();
        let temp = {...order}
        temp.lineItems = lineItems;
        order = temp;
        dispatch(readyStockTransfer({order: order, siteId: userSiteId}))
            .unwrap()
            .then(() => alert("Order is ready for delivery"))
            .catch((err) => alert(err.message));

        navigate(pathname);
        closeVerifyItemsModal();
    }

    const handleCompleteOrder = (e) => {
        e.preventDefault();
        let temp = {...order}
        temp.lineItems = lineItems;
        order = temp;
        dispatch(completeStockTransfer({order: order, siteId: userSiteId}))
            .unwrap()
            .then(() => alert("Order is completed"))
            .catch((err) => alert(err.message));

        setOpenVerifyItems(false);
        navigate(pathname);
    }


  
    const handleConfirmCancel = (e) => {
        e.preventDefault();
        dispatch(cancelStockTransfer({ orderId: id, siteId: userSiteId }))
            .unwrap()
            .then(() => {
                alert("Successfully cancelled stock transfer order");
                closeDeleteModal();
                navigate(`/${subsys.subsys}/stocktransfer`);
            })
            .catch((error) => {
                alert(error.message);
            })
    }

    const handleRejectOrder = (e) => {
        e.preventDefault();
        dispatch(rejectStockTransfer({ orderId: id, siteId: userSiteId }))
            .unwrap()
            .then(() => {
                alert("Successfully rejected stock transfer order");
                closeDeleteModal();
                navigate(`/${subsys.subsys}/stocktransfer`);
            })
            .catch((error) => {
                alert(error.message);
            })
    }

    const handleConfirmOrder = (e) => {
        e.preventDefault();
        dispatch(confirmStockTransfer({ orderId: id, siteId: userSiteId }))
            .unwrap()
            .then(() => {
                alert("Successfully confirmed stock transfer order");
                closeDeleteModal();
                navigate(pathname);
            })
            .catch((error) => {
                alert(error.message);
            })
    }


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
                    openRejectModal={openRejectModal}
                    handleConfirmOrder={handleConfirmOrder}
                    openVerifyItemsModal={openVerifyItemsModal}
                />
                <StockTransferBody
                    lineItems={order.lineItems}
                    status={
                        order.statusHistory[order.statusHistory.length - 1].status
                    }
                    fromSite={order.fromSite?.name}
                    fromSiteCode={order.fromSite.siteCode}
                    fromSitePhone={order.fromSite.phoneNumber}
                    toSite={order.toSite.name}
                    toSiteCode={order.toSite.siteCode}
                    toSitePhone={order.toSite.phoneNumber}
                    orderMadeBy={order.statusHistory[0].actionBy.name}
                />
                <Confirmation
                    title={`Cancel Stock Transfer Order #${id}`}
                    body="Are you sure you want to cancel stock transfer order? This action cannot be undone."
                    open={openDelete}
                    closeModal={closeDeleteModal}
                    onConfirm={handleConfirmCancel}
                />
                <Confirmation
                    title={`Reject Stock Transfer Order #${id}`}
                    body="Are you sure you want to reject stock transfer order? This action cannot be undone."
                    open={openReject}
                    closeModal={closeRejectModal}
                    onConfirm={handleRejectOrder}
                />
                <VerifyItemsModal
                    open={openVerifyItems}
                    closeModal={closeVerifyItemsModal}
                    handleReadyOrder={handleReadyOrder}
                    handleCompleteOrder={handleCompleteOrder}
                    lineItems={lineItems}
                    setLineItems={setLineItems}
                    status={order.statusHistory[order.statusHistory.length - 1].status}
                    userSiteId={userSiteId}
                    fromSiteId={order.fromSite.id}
                    toSiteId={order.toSite.id}
                />
            </>
        )
    );
}