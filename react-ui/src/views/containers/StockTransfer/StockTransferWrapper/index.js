import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
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
  deliverStockTransfer,
} from "../../../../stores/slices/stocktransferSlice";
import {
  selectUserSite,
  updateCurrSite,
} from "../../../../stores/slices/userSlice";
import Confirmation from "../../../components/Modals/Confirmation";
import { EditableCell } from "../../../components/Tables/SimpleTable";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import { XIcon } from "@heroicons/react/solid";
import { SimpleTable } from "../../../components/Tables/SimpleTable";
import { useToasts } from "react-toast-notifications";
import { Outlet } from "react-router-dom";
import { PrinterIcon } from "@heroicons/react/outline";
import { Tabs } from "../../../components/Tabs";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import { InvoiceModal } from "../../Procurement/ProcurementWrapper";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { ProcurementInvoice } from "../../Procurement/ProcurementInvoice";
import { BasicTable } from "../../../components/Tables/BasicTable";

export const VerifyItemsModal = ({
  open,
  closeModal,
  lineItems,
  status,
  userSiteId,
  fromSiteId,
  toSiteId,
  setLineItems,
  handleReadyOrder,
  handleCompleteOrder,
}) => {
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
              onClick={
                userSiteId === fromSiteId && status === "CONFIRMED"
                  ? handleReadyOrder
                  : handleCompleteOrder
              }
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </SimpleModal>
  );
};

export const StockTransferHeader = ({
  subsys,
  tabs,
  id,
  order,
  userSiteId,
  openDeleteModal,
  openRejectModal,
  handleConfirmOrder,
  openVerifyItemsModal,
  handleDeliveringOrder,
  openInvoiceModal,
}) => {
  let status = order.statusHistory[order.statusHistory.length - 1].status;
  let orderMadeBy = order.statusHistory[0].actionBy.id;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
      <NavigatePrev
        page="Stock Transfer Orders"
        path={`/${subsys}/stockTransfer`}
      />
      <div className="relative pb-5 border-b border-gray-200 sm:pb-0">
        <div className="md:flex md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{`Stock Transfer Order #${id}`}</h1>
          <div className="mt-3 flex md:mt-0 md:absolute md:top-3 md:right-0">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              onClick={openInvoiceModal}
            >
              <span>View Invoice</span>
            </button>
            <button
              type="button"
              className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              // onClick={handlePrint}
            >
              <PrinterIcon
                className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span>Print</span>
            </button>
            {status === "PENDING" && userSiteId === orderMadeBy ? (
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
            ) : (
              ""
            )}

            {userSiteId === orderMadeBy && status === "PENDING" ? (
              <button
                type="button"
                className="inline-flex items-center px-3 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                onClick={openDeleteModal}
              >
                <span>Cancel order</span>
              </button>
            ) : (
              ""
            )}

            {/* Accept order if status is pending */}
            {userSiteId === order.fromSite.id &&
            (status === "PENDINGALL" || status === "PENDINGONE") ? (
              <>
                <button
                  type="button"
                  className="ml-3 inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  onClick={handleConfirmOrder}
                >
                  <span>Confirm </span>
                </button>
                <button
                  type="button"
                  className="ml-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
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
            ) : (
              ""
            )}

            {userSiteId === order.fromSite.id && status === "CONFIRMED" ? (
              <button
                type="button"
                className="inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                onClick={openVerifyItemsModal}
              >
                {/* Enter qty sent */}
                <span>Ready for Delivery</span>
              </button>
            ) : (
              ""
            )}

            {userSiteId === order.fromSite.id && status === "READY" ? (
              <button
                type="button"
                className="inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                onClick={handleDeliveringOrder}
              >
                {/* Enter qty sent */}
                <span>Delivering</span>
              </button>
            ) : (
              ""
            )}

            {userSiteId === order.toSite.id && status === "DELIVERING" ? (
              <button
                type="button"
                className="inline-flex items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none"
                onClick={openVerifyItemsModal}
              >
                {/* Enter actual qty received */}
                <span>Complete Order</span>
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="sm:hidden">
            <label htmlFor="current-tab" className="sr-only">
              Select a tab
            </label>
            <select
              id="current-tab"
              name="current-tab"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md"
              defaultValue={tabs.find((tab) => tab.current).name}
            >
              {tabs.map((tab) => (
                <option key={tab.name}>{tab.name}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <Tabs tabs={tabs} />
          </div>
        </div>
      </div>
      <div className="mt-6 absolute right-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3"></div>
    </div>
  );
};

export const LineItems = ({
  lineItems,
  status,
  userSiteId,
  fromSiteId,
  toSiteId,
  setLineItems,
  editable,
}) => {
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
        Header: "Req",
        accessor: "requestedQty",
      },
      {
        Header: "Sent",
        accessor: "packedQty",
        disableSortBy: true,
        Cell: (e) => {
          return status === "CONFIRMED" &&
            userSiteId === fromSiteId &&
            editable ? (
            <EditableCell
              value={e.value}
              row={e.row}
              column={e.column}
              updateMyData={updateMyData}
            />
          ) : (
            `${e.value === null ? "-" : e.value}`
          );
        },
      },
      {
        Header: "Received",
        accessor: "receivedQty",
        disableSortBy: true,
        Cell: (e) => {
          return (status === "READY" || status === "DELIVERING") &&
            userSiteId === toSiteId &&
            editable ? (
            <EditableCell
              value={e.value}
              row={e.row}
              column={e.column}
              updateMyData={updateMyData}
            />
          ) : (
            `${e.value === null ? "-" : e.value}`
          );
        },
      },
    ];
  }, [editable, fromSiteId, setLineItems, status, toSiteId, userSiteId]);

  return (
    <div className="mt-8 p-2">
      <div className="md:flex md:items-center md:justify-between align-middle">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Summary</h3>
        <div className="flex space-x-3 md:mt-0 md:ml-4">
          <button></button>
        </div>
      </div>
      <div className="mt-4">
        <SimpleTable
          columns={columns}
          data={lineItems}
          skipPageReset={skipPageReset}
        />
      </div>
    </div>
  );
};

const InvoiceSummary = ({ data }) => {
  const columns = useMemo(() => {
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
        Header: "Requested",
        accessor: "requestedQty",
      },
    ];
  }, []);
  return (
    <div className="py-8 border-b border-gray-200">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Summary</h3>
      </div>
      {Boolean(data.length) && (
        <div className="mt-4">
          <BasicTable columns={columns} data={data} />
        </div>
      )}
    </div>
  );
};

export const StockTransferWrapper = ({ subsys }) => {
  const { id } = useParams();
  const { addToast } = useToasts();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({ content: () => componentRef.current });
  const dispatch = useDispatch();
  let userSiteId = useSelector(selectUserSite);
  var order = useSelector(selectStockTransferOrder);
  const [lineItems, setLineItems] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [openVerifyItems, setOpenVerifyItems] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [openInvoice, setOpenInvoice] = useState(false);
  console.log(lineItems);
  useEffect(() => {
    dispatch(updateCurrSite());
    dispatch(getStockTransfer(id));
  }, [dispatch, userSiteId, id]);

  useEffect(() => {
    setLineItems(order.lineItems);
    setQrValue(
      `http://localhost:3000/${subsys}/stocktransfer/${order.id}/pick-pack`
    );
  }, [subsys, order]);

  const openDeleteModal = () => setOpenDelete(true);
  const closeDeleteModal = () => setOpenDelete(false);

  const openRejectModal = () => setOpenReject(true);
  const closeRejectModal = () => setOpenReject(false);

  const openInvoiceModal = () => setOpenInvoice(true);
  const closeInvoiceModal = () => setOpenInvoice(false);

  const openVerifyItemsModal = (e) => {
    e.preventDefault();
    const orderStatus =
      order.statusHistory[order.statusHistory.length - 1].status;
    let temp = order.lineItems;
    if (orderStatus === "CONFIRMED") {
      temp = order.lineItems.map((item) => ({
        ...item,
        sentQty: item.requestedQty,
      }));
    }
    if (orderStatus === "DELIVERING" || orderStatus === "READY") {
      temp = order.lineItems.map((item) => ({
        ...item,
        actualQty: item.sentQty,
      }));
    }
    setLineItems(temp);
    setOpenVerifyItems(true);
  };

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
        dispatch(getStockTransfer(id));
      })
      .catch((error) => {
        addToast(`Confirm Stock Transfer Order failed. ${error.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  const handleReadyOrder = (e) => {
    e.preventDefault();
    let temp = { ...order };
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
        dispatch(getStockTransfer(id));
      })
      .catch((err) => {
        addToast(`${err.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      });

    closeVerifyItemsModal();
  };

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
        dispatch(getStockTransfer(id));
      })
      .catch((err) => {
        addToast(`${err.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    let temp = { ...order };
    temp.lineItems = lineItems;
    order = temp;
    dispatch(completeStockTransfer({ order: order, siteId: userSiteId }))
      .unwrap()
      .then(() => {
        addToast(`Stock Transfer Order is completed`, {
          appearance: "success",
          autoDismiss: true,
        });
        dispatch(getStockTransfer(id));
      })
      .catch((err) => {
        addToast(`${err.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      });

    setOpenVerifyItems(false);
  };

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
        dispatch(getStockTransfer(id));
      })
      .catch((error) => {
        addToast(`${error.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

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
        dispatch(getStockTransfer(id));
      })
      .catch((error) => {
        addToast(`${error.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  const tabs = [
    {
      name: "Details",
      href: `/${subsys}/stocktransfer/${id}`,
      current: true,
    },
    {
      name: "Pick / Pack",
      href: `/${subsys}/stocktransfer/${id}/pick-pack`,
      current: false,
    },
    { name: "Delivery", href: "#", current: false },
  ];

  return Object.keys(order).length !== 0 && Boolean(lineItems) ? (
    <>
      <div className="py-8 xl:py-10">
        <StockTransferHeader
          subsys={subsys}
          tabs={tabs}
          id={id}
          order={order}
          userSiteId={userSiteId}
          openDeleteModal={openDeleteModal}
          openRejectModal={openRejectModal}
          handleConfirmOrder={handleConfirmOrder}
          openVerifyItemsModal={openVerifyItemsModal}
          handleDeliveringOrder={handleDeliveringOrder}
          openInvoiceModal={openInvoiceModal}
        />
        <Outlet
          context={{ subsys, order, lineItems, setLineItems, userSiteId }}
        />
      </div>
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
      <div className="hidden">
        <ProcurementInvoice
          ref={componentRef}
          orderId={order.id}
          orderStatus={
            order.statusHistory[order.statusHistory.length - 1].status
          }
          company={order.statusHistory[0].actionBy.company}
          createdBy={order.statusHistory[0].actionBy}
          fromSite={order.fromSite}
          toSite={order.toSite}
          qrValue={qrValue}
        >
          <InvoiceSummary
            data={lineItems}
            status={order.statusHistory[order.statusHistory.length - 1].status}
          />
        </ProcurementInvoice>
      </div>
      <InvoiceModal
        open={openInvoice}
        closeModal={closeInvoiceModal}
        company={order.statusHistory[0].actionBy.company}
        createdBy={order.statusHistory[0].actionBy}
        fromSite={order.fromSite}
        toSite={order.toSite}
        handlePrint={handlePrint}
      >
        <ProcurementInvoice
          orderId={order.id}
          orderStatus={
            order.statusHistory[order.statusHistory.length - 1].status
          }
          company={order.statusHistory[0].actionBy.company}
          createdBy={order.statusHistory[0].actionBy}
          fromSite={order.fromSite}
          toSite={order.toSite}
          qrValue={qrValue}
        >
          <InvoiceSummary
            data={lineItems}
            status={order.statusHistory[order.statusHistory.length - 1].status}
          />
        </ProcurementInvoice>
      </InvoiceModal>
    </>
  ) : (
    <p>loading</p>
  );
};
