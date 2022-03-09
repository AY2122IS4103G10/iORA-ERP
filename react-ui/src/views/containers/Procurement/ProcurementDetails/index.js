import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useToasts } from "react-toast-notifications";
import { PencilIcon } from "@heroicons/react/solid";
import { PrinterIcon, TrashIcon, XIcon } from "@heroicons/react/outline";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import { useEffect, useMemo, useState } from "react";
import ConfirmDelete from "../../../components/Modals/ConfirmDelete/index.js";
import { deleteExistingProcurement } from "../../../../stores/slices/procurementSlice";
import {
  EditableCell,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";
import { api, procurementApi } from "../../../../environments/Api";
import { useRef } from "react";
import { ProcurementInvoice } from "../ProcurementInvoice";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import Confirmation from "../../../components/Modals/Confirmation";

const Header = ({
  pathname,
  procurementId,
  status,
  openModal,
  onAcceptClicked,
  onCancelOrderClicked,
  onShippedClicked,
  onFulfilClicked,
  openInvoice,
  setAction,
  openConfirm,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{`Order #${procurementId}`}</h1>
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
        <button
          type="button"
          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
          onClick={openInvoice}
        >
          <span>View Invoice</span>
        </button>
        {/* <button
          type="button"
          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
          onClick={handlePrint}
        >
          <PrinterIcon
            className="-ml-1 mr-2 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <span>Print</span>
        </button> */}
        {status === "PENDING" ? (
          pathname.includes("/sm/procurements") ? (
            <>
              <Link to={`/sm/procurements/edit/${procurementId}`}>
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
                  disabled={status !== "PENDING"}
                >
                  <PencilIcon
                    className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Edit</span>
                </button>
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
                onClick={openModal}
                disabled={status !== "PENDING"}
              >
                <TrashIcon
                  className="-ml-1 mr-2 h-5 w-5 text-white"
                  aria-hidden="true"
                />
                <span>Delete</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
                onClick={() => {
                  setAction({ name: "Accept", action: onAcceptClicked });
                  openConfirm();
                }}
                disabled={status !== "PENDING"}
              >
                <span>Accept order</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
                onClick={() => {
                  setAction({
                    name: "Cancel",
                    action: onCancelOrderClicked,
                  });
                  openConfirm();
                }}
                disabled={status !== "PENDING"}
              >
                <span>Cancel order</span>
              </button>
            </>
          )
        ) : status === "ACCEPTED" && pathname.includes("mf") ? (
          // <button
          //   type="button"
          //   className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
          //   onClick={() => {
          //     setAction({
          //       name: "Fulfil",
          //       action: onFulfilClicked,
          //     });
          //     openConfirm();
          //   }}
          //   disabled={status !== "ACCEPTED"}
          // >
          //   <QrcodeIcon
          //     className="-ml-1 mr-2 h-5 w-5 text-white"
          //     aria-hidden="true"
          //   />
          //   <span>Scan</span>
          // </button>
          <div></div>
        ) : status === "READY" && pathname.includes("mf") ? (
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
            onClick={onShippedClicked}
            disabled
          >
            <span>Ship order</span>
          </button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

const ItemsSummary = ({
  data,
  status,
  setData,
  pathname,
  onVerifyReceivedClicked,
}) => {
  const [skipPageReset, setSkipPageReset] = useState(false);
  const columns = useMemo(() => {
    const updateMyData = (rowIndex, columnId, value) => {
      setSkipPageReset(true);
      setData((old) =>
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
        Header: "Requested",
        accessor: "requestedQty",
      },
      {
        Header: "Fulfilled",
        accessor: "fulfilledQty",
        disableSortBy: true,
        Cell: (row) =>
          status === "PENDING" ||
          status === "CANCELLED" ||
          status === "ACCEPTED"
            ? "-"
            : row.row.original.fulfilledProductItems.length,
      },
      {
        Header: "Shipped",
        accessor: "",
        Cell: (row) => {
          return status === "SHIPPED" ||
            status === "VERIFIED" ||
            status === "COMPLETED"
            ? row.row.original.fulfilledProductItems.length
            : "-";
        },
      },
      {
        Header: "Received",
        accessor: "actualQty",
        Cell: (row) => {
          return status === "SHIPPED" && pathname.includes("wh") ? (
            <EditableCell
              value={0}
              row={row.row}
              column={row.column}
              updateMyData={updateMyData}
            />
          ) : (
            "-"
          );
        },
      },
    ];
  }, [setData, status, pathname]);
  return (
    <div className="pt-8">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Summary</h3>
        <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
          {status === "SHIPPED" && pathname.includes("wh") ? (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              onClick={onVerifyReceivedClicked}
            >
              Verify items
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      {Boolean(data.length) && (
        <div className="mt-4">
          <SimpleTable
            columns={columns}
            data={data}
            skipPageReset={skipPageReset}
          />
        </div>
      )}
    </div>
  );
};

export const ScanItemsSection = ({ search, onSearchChanged, onScanClicked }) => {
  return (
    <div className="pt-8">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Scan Items
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-700">
          <p>
            Scan barcode or enter product SKU. Scan once to "pick", a second time
            to "pack".
          </p>
        </div>
        <form className="mt-5 sm:flex sm:items-center" onSubmit={onScanClicked}>
          <div className="w-full sm:max-w-xs">
            <label htmlFor="sku" className="sr-only">
              SKU
            </label>
            <input
              type="text"
              name="sku"
              id="sku"
              className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="XXXXXXXXXX-X"
              value={search}
              onChange={onSearchChanged}
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Scan
          </button>
        </form>
      </div>
    </div>
  );
};
const ProcurementDetailsBody = ({
  pathname,
  status,
  lineItems,
  manufacturing,
  headquarters,
  warehouse,
  setLineItems,
  search,
  onSearchChanged,
  onScanClicked,
  onFulfilClicked,
  onVerifyReceivedClicked,
}) => (
  <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
    <div className="space-y-6 lg:col-start-1 lg:col-span-2">
      {/* Site Information*/}
      <section aria-labelledby="order-information-title">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2
              id="warehouse-information-title"
              className="text-lg leading-6 font-medium text-gray-900"
            >
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
                <dt className="text-sm font-medium text-gray-500">
                  Created by
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {headquarters.name}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">From</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {manufacturing ? manufacturing.name : "-"}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">To</dt>
                <dd className="mt-1 text-sm text-gray-900">{warehouse.name}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      {status === "ACCEPTED" && (
        <section aria-labelledby="scan-items">
          <ScanItemsSection
            search={search}
            onSearchChanged={onSearchChanged}
            onScanClicked={onScanClicked}
          />
        </section>
      )}
      <section aria-labelledby="order-summary">
        <ItemsSummary
          data={lineItems}
          status={status}
          setData={setLineItems}
          pathname={pathname}
          onFulfilClicked={onFulfilClicked}
          onVerifyReceivedClicked={onVerifyReceivedClicked}
        />
      </section>
    </div>
  </div>
);

export const InvoiceModal = ({
  open,
  closeModal,
  orderId,
  orderStatus,
  data,
  qrValue,
  company,
  headquarters,
  manufacturing,
  warehouse,
  handlePrint,
}) => {
  return (
    [company, headquarters, manufacturing, warehouse].every(Boolean) && (
      <SimpleModal open={open} closeModal={closeModal}>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:min-w-full sm:p-6 md:min-w-full lg:min-w-fit">
          <div className="sm:block absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="mr-10 inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
              onClick={handlePrint}
            >
              <PrinterIcon
                className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span>Print</span>
            </button>
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              onClick={closeModal}
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <ProcurementInvoice
            orderId={orderId}
            orderStatus={orderStatus}
            company={company}
            headquarters={headquarters}
            manufacturing={manufacturing}
            warehouse={warehouse}
            data={data}
            qrValue={qrValue}
          />
        </div>
      </SimpleModal>
    )
  );
};

export const ProcurementDetails = () => {
  const { addToast } = useToasts();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({ content: () => componentRef.current });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { procurementId } = useParams();
  const [headquarters, setHeadquarters] = useState(null);
  const [manufacturing, setManufacturing] = useState(null);
  const [warehouse, setWarehouse] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [status, setStatus] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("sam/procurementOrder", procurementId).then((response) => {
      const {
        headquarters,
        manufacturing,
        warehouse,
        lineItems,
        statusHistory,
      } = response.data;
      api
        .get("sam/viewSite", headquarters)
        .then((response) => setHeadquarters(response.data));
      api
        .get("sam/viewSite", manufacturing)
        .then((response) => setManufacturing(response.data));
      api
        .get("sam/viewSite", warehouse)
        .then((response) => setWarehouse(response.data));
      setLineItems(
        lineItems.map((item) => ({
          ...item,
          product: {
            sku: item.product.sku,
            productFields: item.product.productFields,
          },
        }))
      );
      setStatus({
        status: statusHistory[statusHistory.length - 1].status,
        timeStamp: statusHistory[statusHistory.length - 1].timeStamp,
      });
      setQrValue(procurementId);
    });
  }, [procurementId]);

  const onDeleteProcurementClicked = () => {
    dispatch(
      deleteExistingProcurement({
        orderId: procurementId,
        siteId: headquarters.id,
      })
    )
      .unwrap()
      .then(() => {
        addToast("Successfully deleted procurement order", {
          appearance: "success",
          autoDismiss: true,
        });
        closeModal();
        navigate("/sm/procurements");
      })
      .catch((err) =>
        addToast(`Error: ${err.message}`, {
          appearance: "error",
          autoDismiss: true,
        })
      );
  };

  const onAcceptClicked = () => {
    procurementApi
      .acceptOrder(procurementId, manufacturing.id)
      .then((response) => {
        const { statusHistory } = response.data;
        setStatus({
          status: statusHistory[statusHistory.length - 1].status,
          timeStamp: statusHistory[statusHistory.length - 1].timeStamp,
        });
      })
      .then(() => {
        addToast("Successfully accepted procurement order", {
          appearance: "success",
          autoDismiss: true,
        });
        closeConfirmModal();
        openInvoice();
      })
      .catch((err) =>
        addToast(`Error: ${err.message}`, {
          appearance: "error",
          autoDismiss: true,
        })
      );
  };

  const onCancelOrderClicked = () => {
    procurementApi
      .cancelOrder(procurementId, manufacturing.id)
      .then((response) => {
        const { statusHistory } = response.data;
        setStatus({
          status: statusHistory[statusHistory.length - 1].status,
          timeStamp: statusHistory[statusHistory.length - 1].timeStamp,
        });
      })
      .then(() => {
        addToast("Successfully cancelled procurement order", {
          appearance: "success",
          autoDismiss: true,
        });
        closeConfirmModal();
      })
      .catch((err) =>
        addToast(`Error: ${err.message}`, {
          appearance: "error",
          autoDismiss: true,
        })
      );
  };

  const onScanClicked = () => {};

  const onFulfilClicked = () => {
    procurementApi
      .fulfillOrder(manufacturing.id, {
        id: procurementId,
        lineItems,
      })
      .then((response) => {
        const { lineItems, statusHistory } = response.data;
        setLineItems(lineItems);
        setStatus({
          status: statusHistory[statusHistory.length - 1].status,
          timeStamp: statusHistory[statusHistory.length - 1].timeStamp,
        });
      })
      .then(() => {
        addToast("Successfully fulfilled procurement order", {
          appearance: "success",
          autoDismiss: true,
        });
        closeConfirmModal();
      })
      .catch((err) =>
        addToast(`Error: ${err.message}`, {
          appearance: "error",
          autoDismiss: true,
        })
      );
  };

  const onShippedClicked = () => {
    procurementApi
      .shipOrder(manufacturing.id, {
        id: procurementId,
        lineItems,
      })
      .then((response) => {
        const { lineItems, statusHistory } = response.data;
        // setHeadquarters(headquarters);
        // setManufacturing(manufacturing);
        // setWarehouse(warehouse);
        setLineItems(lineItems);
        // lineItems.map((item) => ({
        //   ...item,
        //   actualQuantity: fulfilledProductItems.length,
        // }))
        setStatus({
          status: statusHistory[statusHistory.length - 1].status,
          timeStamp: statusHistory[statusHistory.length - 1].timeStamp,
        });
      })
      .catch((error) =>
        console.error("Failed to ship procurement: ", error.message)
      );
  };

  const onSearchChanged = (e) => setSearch(e.target.value);

  const openModal = () => setOpenDelete(true);
  const closeModal = () => setOpenDelete(false);

  const openInvoice = () => setOpen(true);
  const closeInvoice = () => setOpen(false);

  const openConfirmModal = () => setOpenConfirm(true);
  const closeConfirmModal = () => setOpenConfirm(false);

  return (
    [procurementId, headquarters, manufacturing, warehouse].every(Boolean) && (
      <>
        <div className="py-8 xl:py-10">
          <NavigatePrev
            page="Procurement Orders"
            path={
              pathname.includes("mf")
                ? "/mf/procurements"
                : pathname.includes("wh")
                ? "/wh/procurements"
                : "/sm/procurements"
            }
          />
          <Header
            pathname={pathname}
            procurementId={procurementId}
            status={status.status}
            openModal={openModal}
            onAcceptClicked={onAcceptClicked}
            onCancelOrderClicked={onCancelOrderClicked}
            onShippedClicked={onShippedClicked}
            onFulfilClicked={onFulfilClicked}
            handlePrint={handlePrint}
            openInvoice={openInvoice}
            setAction={setAction}
            openConfirm={openConfirmModal}
          />
          <ProcurementDetailsBody
            procurementId={procurementId}
            status={status.status}
            manufacturing={manufacturing}
            headquarters={headquarters}
            warehouse={warehouse}
            lineItems={lineItems}
            setLineItems={setLineItems}
            pathname={pathname}
            onFulfilClicked={onFulfilClicked}
            search={search}
            onSearchChanged={onSearchChanged}
            onScanClicked={onScanClicked}
          />
        </div>
        <ConfirmDelete
          item={`Order #${procurementId}`}
          open={openDelete}
          closeModal={closeModal}
          onConfirm={onDeleteProcurementClicked}
        />
        <div className="hidden">
          <ProcurementInvoice
            ref={componentRef}
            orderId={procurementId}
            orderStatus={status}
            company={headquarters.company}
            headquarters={headquarters}
            manufacturing={manufacturing}
            warehouse={warehouse}
            data={lineItems}
            qrValue={qrValue}
          />
        </div>
        <InvoiceModal
          open={open}
          closeModal={closeInvoice}
          orderId={procurementId}
          orderStatus={status}
          company={headquarters.company}
          headquarters={headquarters}
          manufacturing={manufacturing}
          warehouse={warehouse}
          data={lineItems}
          qrValue={qrValue}
          handlePrint={handlePrint}
        />
        {Boolean(action) && (
          <Confirmation
            title={`${action.name} "Order #${procurementId}"`}
            body={`Are you sure you want to ${action.name.toLowerCase()} "Order #${procurementId}"? This action cannot be undone.`}
            open={openConfirm}
            closeModal={closeConfirmModal}
            onConfirm={action.action}
          />
        )}
      </>
    )
  );
};
