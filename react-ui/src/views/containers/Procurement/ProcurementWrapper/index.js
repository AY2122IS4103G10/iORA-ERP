import {
  PencilIcon,
  PrinterIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useMemo } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useToasts } from "react-toast-notifications";
import { api, procurementApi } from "../../../../environments/Api";
import { selectUserSite } from "../../../../stores/slices/userSlice";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import Confirmation from "../../../components/Modals/Confirmation";
import ConfirmDelete from "../../../components/Modals/ConfirmDelete";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import { BasicTable } from "../../../components/Tables/BasicTable";
import { Tabs } from "../../../components/Tabs";
import { fetchAllModelsBySkus } from "../../StockTransfer/StockTransferForm";
import { ProcurementInvoice } from "../ProcurementInvoice";

const Header = ({
  subsys,
  currSiteId,
  tabs,
  navigate,
  procurementId,
  headquartersId,
  manufacturingId,
  warehouseId,
  status,
  openModal,
  onAcceptClicked,
  onCancelOrderClicked,
  openInvoice,
  setAction,
  openConfirm,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
      <NavigatePrev
        page="Procurement Orders"
        path={`/${subsys}/procurements`}
      />
      <div className="relative pb-5 border-b border-gray-200 sm:pb-0">
        <div className="md:flex md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{`Order #${procurementId}`}</h1>
          <div className="mt-3 flex md:mt-0 md:absolute md:top-3 md:right-0">
            {status !== "PENDING" && (
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                onClick={openInvoice}
              >
                <span>View Invoice</span>
              </button>
            )}
            <button
              type="button"
              className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              onClick={() => window.print()}
            >
              <PrinterIcon
                className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span>Print</span>
            </button>
            {status === "PENDING" ? (
              headquartersId === currSiteId ? (
                <div>
                  <button
                    type="button"
                    className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    disabled={status !== "PENDING"}
                    onClick={() =>
                      navigate(`/sm/procurements/edit/${procurementId}`)
                    }
                  >
                    <PencilIcon
                      className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    className="ml-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
                    onClick={openModal}
                    disabled={status !== "PENDING"}
                  >
                    <TrashIcon
                      className="-ml-1 mr-2 h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                    <span>Delete</span>
                  </button>
                </div>
              ) : manufacturingId === currSiteId ? (
                <div>
                  <button
                    type="button"
                    className="ml-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
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
                    className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
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
                </div>
              ) : (
                <div></div>
              )
            ) : (
              <div></div>
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
    </div>
  );
};

export const InvoiceModal = ({
  open,
  closeModal,
  company,
  createdBy,
  fromSite,
  toSite,
  handlePrint,
  children,
}) => {
  return (
    [company, createdBy, fromSite, toSite].every(Boolean) && (
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
          {children}
        </div>
      </SimpleModal>
    )
  );
};

const InvoiceSummary = ({ data, status }) => {
  const columns = useMemo(() => {
    return [
      {
        Header: "SKU",
        accessor: "product.sku",
      },
      {
        Header: "Name",
        accessor: "product.name",
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
        Header: `${status === "READY_FOR_SHIPPING" ? "Ful" : "Req"}`,
        accessor: `${
          status === "READY_FOR_SHIPPING" ? "packedQty" : "requestedQty"
        }`,
      },
    ];
  }, [status]);
  return (
    <div className="py-8 border-gray-200">
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

export const fetchSite = async (site) => {
  const { data } = await api.get("sam/viewSite", site);
  return data;
};

export const ProcurementWrapper = ({ subsys }) => {
  const { addToast } = useToasts();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({ content: () => componentRef.current });
  const navigate = useNavigate();
  const { procurementId } = useParams();
  const [headquarters, setHeadquarters] = useState(null);
  const [manufacturing, setManufacturing] = useState(null);
  const [warehouse, setWarehouse] = useState(null);
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState([]);
  const [status, setStatus] = useState("");
  const [statusHistory, setStatusHistory] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [qrDelivery, setQrDelivery] = useState("");
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const currSiteId = useSelector(selectUserSite);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProcurementOrder = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("sam/procurementOrder", procurementId);
        const {
          headquarters,
          manufacturing,
          warehouse,
          lineItems,
          notes,
          statusHistory,
        } = data;
        fetchSite(headquarters).then((data) => setHeadquarters(data));
        fetchSite(manufacturing).then((data) => setManufacturing(data));
        fetchSite(warehouse).then((data) => setWarehouse(data));
        fetchAllModelsBySkus(lineItems).then((data) => {
          setLineItems(
            lineItems.map((item, index) => ({
              ...item,
              product: {
                ...item.product,
                modelCode: data[index].modelCode,
                name: data[index].name,
              },
            }))
          );
        });
        setNotes(notes);
        setStatus({
          status: statusHistory[statusHistory.length - 1].status,
          timeStamp: statusHistory[statusHistory.length - 1].timeStamp,
        });
        setStatusHistory(statusHistory);
        setQrValue(
          `http://localhost:3000/${subsys}/procurements/${procurementId}/pick-pack`
        );
        setQrDelivery(
          `http://localhost:3000/${subsys}/procurements/${procurementId}/delivery`
        );
      } catch (err) {
        addToast(`Error: ${err.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProcurementOrder();
  }, [subsys, procurementId, addToast]);

  const onDeleteProcurementClicked = async () => {
    try {
      const { data } = await procurementApi.deleteOrder(
        procurementId,
        currSiteId
      );
      const { statusHistory } = data;
      setStatus({
        status: statusHistory[statusHistory.length - 1].status,
        timeStamp: statusHistory[statusHistory.length - 1].timeStamp,
      });
      setStatusHistory(statusHistory);
      addToast("Successfully deleted procurement order", {
        appearance: "success",
        autoDismiss: true,
      });
      closeModal();
    } catch (err) {
      addToast(`Error: ${err.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const onAcceptClicked = async () => {
    try {
      const { data } = await procurementApi.acceptOrder(
        procurementId,
        currSiteId
      );
      const { statusHistory } = data;
      setStatus({
        status: statusHistory[statusHistory.length - 1].status,
        timeStamp: statusHistory[statusHistory.length - 1].timeStamp,
      });
      setStatusHistory(statusHistory);
      addToast(
        "Successfully accepted procurement order. Please print the order invoice.",
        {
          appearance: "success",
          autoDismiss: true,
        }
      );
      closeConfirmModal();
      openInvoice();
    } catch (err) {
      addToast(`Error: ${err.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const onCancelOrderClicked = async () => {
    try {
      const { data } = await procurementApi.cancelOrder(
        procurementId,
        currSiteId
      );
      const { statusHistory } = data;
      setStatus({
        status: statusHistory[statusHistory.length - 1].status,
        timeStamp: statusHistory[statusHistory.length - 1].timeStamp,
      });
      setStatusHistory(statusHistory);
      addToast("Successfully cancelled procurement order", {
        appearance: "success",
        autoDismiss: true,
      });
      closeConfirmModal();
    } catch (err) {
      addToast(`Error: ${err.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const openModal = () => setOpenDelete(true);
  const closeModal = () => setOpenDelete(false);

  const openInvoice = () => setOpen(true);
  const closeInvoice = () => setOpen(false);

  const openConfirmModal = () => setOpenConfirm(true);
  const closeConfirmModal = () => setOpenConfirm(false);

  const tabs = [
    {
      name: "Details",
      href: `/${subsys}/procurements/${procurementId}`,
      current: true,
    },
    {
      name: "Pick / Pack",
      href: `/${subsys}/procurements/${procurementId}/pick-pack`,
      current: false,
    },
    {
      name: "Delivery",
      href: `/${subsys}/procurements/${procurementId}/delivery`,
      current: false,
    },
  ];
  return loading ? (
    <div className="flex mt-5 items-center justify-center">
      <TailSpin color="#00BFFF" height={20} width={20} />
    </div>
  ) : (
    [procurementId, headquarters, manufacturing, warehouse].every(Boolean) && (
      <>
        <div className="py-8 xl:py-10">
          <Header
            subsys={subsys}
            currSiteId={currSiteId}
            navigate={navigate}
            tabs={tabs}
            procurementId={procurementId}
            headquartersId={headquarters.id}
            manufacturingId={manufacturing.id}
            warehouseId={warehouse.id}
            status={status.status}
            openModal={openModal}
            onAcceptClicked={onAcceptClicked}
            onCancelOrderClicked={onCancelOrderClicked}
            handlePrint={handlePrint}
            openInvoice={openInvoice}
            setAction={setAction}
            openConfirm={openConfirmModal}
          />
          <Outlet
            context={{
              subsys,
              procurementId,
              status,
              setStatus,
              statusHistory,
              setStatusHistory,
              manufacturing,
              headquarters,
              warehouse,
              notes,
              lineItems,
              setLineItems,
              componentRef,
              handlePrint,
              addToast,
              openInvoice,
              currSiteId,
              loading,
              setLoading,
            }}
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
            title={`${
              status.status === "READY_FOR_SHIPPING" ? "Delivery" : ""
            } Invoice`}
            orderId={procurementId}
            orderStatus={status}
            company={headquarters.company}
            createdBy={headquarters}
            fromSite={manufacturing}
            toSite={warehouse}
            data={lineItems}
            qrValue={qrValue}
            qrHelper={
              status.status !== "READY_FOR_SHIPPING"
                ? "Scan to start picking."
                : "Scan to start delivery."
            }
          >
            <InvoiceSummary data={lineItems} status={status.status} />
          </ProcurementInvoice>
        </div>
        <InvoiceModal
          open={open}
          closeModal={closeInvoice}
          company={headquarters.company}
          createdBy={headquarters}
          fromSite={manufacturing}
          toSite={warehouse}
          handlePrint={handlePrint}
        >
          <ProcurementInvoice
            title={`${
              status.status === "READY_FOR_SHIPPING" ? "Delivery" : ""
            } Invoice`}
            orderId={procurementId}
            orderStatus={status}
            company={headquarters.company}
            createdBy={headquarters}
            fromSite={manufacturing}
            toSite={warehouse}
            qrValue={
              status.status !== "READY_FOR_SHIPPING" ? qrValue : qrDelivery
            }
            qrHelper={
              status.status !== "READY_FOR_SHIPPING"
                ? "Scan to start picking."
                : "Scan to start delivery."
            }
          >
            <InvoiceSummary data={lineItems} status={status.status} />
          </ProcurementInvoice>
        </InvoiceModal>
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
