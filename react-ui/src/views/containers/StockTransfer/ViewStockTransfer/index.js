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
    completeStockTransfer,
    deliverStockTransfer
} from "../../../../stores/slices/stocktransferSlice";
import { selectUserSite } from "../../../../stores/slices/userSlice";
import Confirmation from "../../../components/Modals/Confirmation";
import { EditableCell } from "../../../components/Tables/SimpleTable";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import { XIcon } from "@heroicons/react/solid";
import { SimpleTable } from "../../../components/Tables/SimpleTable";
import { useToasts } from "react-toast-notifications";

export const VerifyItemsModal = ({ open, closeModal, lineItems, status, userSiteId,
    fromSiteId, toSiteId, setLineItems, handleReadyOrder, handleCompleteOrder }) => {
    // console.log("VERIFY")

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
                        <LineItems
                            lineItems={lineItems}
                            status={status}
                            userSiteId={userSiteId}
                            fromSiteId={fromSiteId}
                            toSiteId={toSiteId}
                            setLineItems={setLineItems}
                            editable={true}
                        />
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
                            onClick={userSiteId === fromSiteId && status === "CONFIRMED" ? handleReadyOrder : handleCompleteOrder}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </SimpleModal>
    );
}

export const StockTransferHeader = ({ order, userSiteId, openDeleteModal, openRejectModal, handleConfirmOrder, openVerifyItemsModal, handleDeliveringOrder }) => {
    let status = order.statusHistory[order.statusHistory.length - 1].status
    let orderMadeBy = order.statusHistory[0].actionBy.id
    // console.log("Header:")
    // console.log(status); 
    // console.log(orderMadeBy);
    // console.log("=================")

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <div className="mt-8 flex items-center space-x-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{`Stock Transfer Order #${order.id}`}</h1>
                </div>
                <div className="mt-6 absolute right-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
                    {status === "PENDING" && userSiteId === orderMadeBy ?
                        <Link to={`/sm/stocktransfer/edit/${order.id}`}>
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
                    {((userSiteId === order.fromSite.id && userSiteId !== orderMadeBy) || (userSiteId === order.toSite.id && order.fromSite.id === orderMadeBy)) && status === "PENDING" ?
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

                    {userSiteId === order.fromSite.id && status === "CONFIRMED" ?
                        (<button
                            type="button"
                            className="inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            onClick={openVerifyItemsModal}
                        >
                            {/* Enter qty sent */}
                            <span>Ready for Delivery</span>
                        </button>) : ""}

                    {userSiteId === order.fromSite.id && status === "READY" ?
                        (<button
                            type="button"
                            className="inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            onClick={handleDeliveringOrder}
                        >
                            {/* Enter qty sent */}
                            <span>Delivering</span>
                        </button>) : ""}

                    {userSiteId === order.toSite.id && (status === "DELIVERING") ?
                        (<button
                            type="button"
                            className="inline-flex items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none"
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

export const LineItems = ({ lineItems, status, userSiteId, fromSiteId, toSiteId, setLineItems, editable }) => {
    const [skipPageReset, setSkipPageReset] = useState(false);

    const columns = useMemo(() => {
        const updateMyData = ({ rowIndex, columnId, value }) => {
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
                    return (status === "CONFIRMED" && userSiteId === fromSiteId && editable) ? (
                        <EditableCell value={row.row.original.sentQty} row={row.row} column={row.column} updateMyData={updateMyData} />
                    ) : (`${row.row.original.sentQty === null ? "-" : row.row.original.sentQty}`);
                }
            },
            {
                Header: "Received Qty",
                accessor: "actualQty",
                disableSortBy: true,
                Cell: (row) => {
                    return (status === "READY" || status === "DELIVERING") && userSiteId === toSiteId && editable ? (
                        <EditableCell value={row.row.original.actualQty} row={row.row} column={row.column} updateMyData={updateMyData} />
                        ) : (`${row.row.original.actualQty === null ? "-" : row.row.original.actualQty}`);
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
                <SimpleTable columns={columns} data={lineItems} />
            </div>
        </div>
    );
}


export const StockTransferBody = ({ order, lineItems, userSiteId }) => {
    let status = order.statusHistory[order.statusHistory.length - 1].status;
    let orderMadeBy = order.statusHistory[0].actionBy.name;

    return (
        <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
            <div className="space-y-6 lg:col-start-1 lg:col-span-2">
                <section aria-labelledby="stocktransfer-view">
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 grid grid-cols-2">
                            <h2 id="applicant-information-title" className="text-lg leading-6 font-medium text-gray-900">
                                Order Information
                            </h2>
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
                                    <dd className="mt-1 text-sm text-gray-900">{order.fromSite.name}</dd>
                                    <dd className="mt-1 text-sm text-gray-900">{order.fromSite.phoneNumber} </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">To</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{order.toSite.name}</dd>
                                    <dd className="mt-1 text-sm text-gray-900">{order.toSite.phoneNumber}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                    {lineItems !== undefined && lineItems !== undefined && Object.keys(lineItems).length !== 0 ?
                        <LineItems
                            lineItems={lineItems}
                            status={status}
                            userSiteId={userSiteId}
                            fromSiteId={order.fromSite.id}
                            toSiteId={order.toSite.id}
                            editable={false} />
                        : <p>loading</p>}
                </section>
            </div>
        </div>
    );
}



export const ViewStockTransfer = (subsys) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    let userSiteId = useSelector(selectUserSite);
    var order = useSelector(selectStockTransferOrder);
    const [lineItems, setLineItems] = useState({});
    const [openDelete, setOpenDelete] = useState(false);
    const [openReject, setOpenReject] = useState(false);
    const [openVerifyItems, setOpenVerifyItems] = useState(false);
    const {addToast} = useToasts();
    const [reload, setReload] = useState(0);

    console.log("rerendering");

    useEffect(() => {
        dispatch(getStockTransfer(id))
    }, [dispatch, userSiteId])

    useEffect(() => {
        setLineItems(order.lineItems)
    }, [order])

    const openDeleteModal = () => setOpenDelete(true);
    const closeDeleteModal = () => setOpenDelete(false);

    const openRejectModal = () => setOpenReject(true);
    const closeRejectModal = () => setOpenReject(false);


    const openVerifyItemsModal = (e) => {
        e.preventDefault();
        const orderStatus = order.statusHistory[order.statusHistory.length - 1].status
        let temp = order.lineItems;
        if (orderStatus === "CONFIRMED") {
            temp = order.lineItems.map((item) => ({
                ...item,
                sentQty: item.requestedQty
            }))
        }
        if (orderStatus === "DELIVERING" || orderStatus === "READY") {
            temp = order.lineItems.map((item) => ({
                ...item,
                actualQty: item.sentQty
            }))
        }
        setLineItems(temp)
        setOpenVerifyItems(true);
    }

    const closeVerifyItemsModal = () => setOpenVerifyItems(false);


    const handleConfirmOrder = (e) => {
        e.preventDefault();
        dispatch(confirmStockTransfer({ orderId: id, siteId: userSiteId }))
            .unwrap()
            .then(() => {
                addToast(`Confirmed Stock Transfer Order`, {
                    appearance: "success",
                    autoDismiss: true,
                });
                closeDeleteModal();
                dispatch(getStockTransfer(id))
            })
            .catch((error) => {
                addToast(`Confirm Stock Transfer Order failed. ${error.message}`, {
                    appearance: "error",
                    autoDismiss: true,
                });
            })

    }



    const handleReadyOrder = (e) => {
        e.preventDefault();
        let temp = { ...order }
        temp.lineItems = lineItems;
        order = temp;
        dispatch(readyStockTransfer({ order: order, siteId: userSiteId }))
            .unwrap()
            .then(() => {
                addToast(`Stock Transfer Order Ready for Delivery`, {
                    appearance: "success",
                    autoDismiss: true,
                });
                // navigate(`/${subsys.subsys}/stocktransfer/${id}`)
                // setReload(reload + 1);
                dispatch(getStockTransfer(id))

            })
            .catch((err) => {
                addToast(`${err.message}`, {
                    appearance: "error",
                    autoDismiss: true,
                });
            });

        closeVerifyItemsModal();
    }

    const handleDeliveringOrder = (e) => {
        e.preventDefault();
        dispatch(deliverStockTransfer({ order: order, siteId: userSiteId }))
            .unwrap()
            .then(() => {
                addToast(`Stock Transfer Order is being delivered`, {
                    appearance: "success",
                    autoDismiss: true,
                });
                // navigate(`/${subsys.subsys}/stocktransfer/${id}`)
                // setReload(reload + 1);
                dispatch(getStockTransfer(id))
            })
            .catch((err) => {
                addToast(`${err.message}`, {
                    appearance: "error",
                    autoDismiss: true,
                });
            });
    }

    const handleCompleteOrder = (e) => {
        e.preventDefault();
        let temp = { ...order }
        temp.lineItems = lineItems;
        order = temp;
        dispatch(completeStockTransfer({ order: order, siteId: userSiteId }))
            .unwrap()
            .then((response) => {
                addToast(`Stock Transfer Order is completed`, {
                    appearance: "success",
                    autoDismiss: true,
                });
                dispatch(getStockTransfer(id))
            })
            .catch((err) => {
                addToast(`${err.message}`, {
                    appearance: "error",
                    autoDismiss: true,
                });
            });

        setOpenVerifyItems(false);
    }

    const handleConfirmCancel = (e) => {
        e.preventDefault();
        dispatch(cancelStockTransfer({ orderId: id, siteId: userSiteId }))
            .unwrap()
            .then(() => {
                addToast(`Stock Transfer Order is successfully cancelled`, {
                    appearance: "success",
                    autoDismiss: true,
                });
                closeDeleteModal();
                dispatch(getStockTransfer(id))
            })
            .catch((error) => {
                addToast(`${error.message}`, {
                    appearance: "error",
                    autoDismiss: true,
                });
            })        
    }

    const handleRejectOrder = (e) => {
        e.preventDefault();
        dispatch(rejectStockTransfer({ orderId: id, siteId: userSiteId }))
            .unwrap()
            .then(() => {
                addToast(`Stock Transfer Order is successfully rejected`, {
                    appearance: "success",
                    autoDismiss: true,
                });
                closeDeleteModal();
                dispatch(getStockTransfer(id))
            })
            .catch((error) => {
                addToast(`${error.message}`, {
                    appearance: "error",
                    autoDismiss: true,
                });
            })
    }



    return (
        Object.keys(order).length !== 0 ? (
            <>
                <StockTransferHeader
                    order={order}
                    userSiteId={userSiteId}
                    openDeleteModal={openDeleteModal}
                    openRejectModal={openRejectModal}
                    handleConfirmOrder={handleConfirmOrder}
                    openVerifyItemsModal={openVerifyItemsModal}
                    handleDeliveringOrder={handleDeliveringOrder}
                />
                <StockTransferBody
                    order={order}
                    lineItems={lineItems}
                    userSiteId={userSiteId}
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
                    status={order.statusHistory[order.statusHistory.length - 1].status}
                    userSiteId={userSiteId}
                    fromSiteId={order.fromSite.id}
                    toSiteId={order.toSite.id}
                    open={openVerifyItems}
                    closeModal={closeVerifyItemsModal}
                    handleReadyOrder={handleReadyOrder}
                    handleCompleteOrder={handleCompleteOrder}
                    lineItems={lineItems}
                    setLineItems={setLineItems}
                />
            </>
        ) : <p>loading</p>
    )
}