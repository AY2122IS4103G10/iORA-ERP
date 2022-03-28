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
import { api, orderApi } from "../../../../environments/Api";
import { selectUserSite } from "../../../../stores/slices/userSlice";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import Confirmation from "../../../components/Modals/Confirmation";
import ConfirmDelete from "../../../components/Modals/ConfirmDelete";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import { BasicTable } from "../../../components/Tables/BasicTable";
import { Tabs } from "../../../components/Tabs";
import { OnlineOrderInvoice } from "../../OnlineOrder/OnlineOrderInvoice";
import { InvoiceModal } from "../../Procurement/ProcurementWrapper";
import { fetchAllModelsBySkus } from "../../StockTransfer/StockTransferForm";

const deliveryStatuses = [
  "READY_FOR_DELIVERY",
  "DELIVERING",
  "DELIVERING_MULTIPLE",
  "DELIVERED",
  "COMPLETED",
];

const Header = ({
  subsys,
  disableTabs,
  tabs,
  orderId,
  openInvoice,
  disableInvoice,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
      <NavigatePrev page="Orders" path={`/${subsys}/orders/search`} />
      <div className="relative pb-5 border-b border-gray-200 sm:pb-0">
        <div className="md:flex md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{`Order #${orderId}`}</h1>
          <div className="mt-3 flex md:mt-0 md:absolute md:top-3 md:right-0">
            {disableInvoice && (
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                onClick={openInvoice}
              >
                <span>View Invoice</span>
              </button>
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
          {!disableTabs && (
            <div className="hidden sm:block">
              <Tabs tabs={tabs} />
            </div>
          )}
        </div>
      </div>
    </div>
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
        Header: "Qty",
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

export const CustomerOrderWrapper = ({ subsys }) => {
  const { addToast } = useToasts();
  const { orderId } = useParams();
  const componentRef = useRef();
  const navigate = useNavigate();
  const handlePrint = useReactToPrint({ content: () => componentRef.current });
  const [lineItems, setLineItems] = useState([]);
  const [status, setStatus] = useState("");
  const [statusHistory, setStatusHistory] = useState([]);
  const [delivery, setDelivery] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [dateTime, setDateTime] = useState(-1);
  const [customer, setCustomer] = useState(-1);
  const [totalAmount, setTotalAmount] = useState(-1);
  const [payments, setPayments] = useState([]);
  const [paid, setPaid] = useState(false);
  const [country, setCountry] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [qrDelivery, setQrDelivery] = useState("");
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const currSiteId = useSelector(selectUserSite);

  useEffect(() => {
    const fetchCustomer = async (customer) => {
      const { data } = await api.get("sam/customer/view", customer);
      return data;
    };
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const { data } = await orderApi.get(orderId);
        console.log(data);
        const {
          lineItems,
          delivery,
          deliveryAddress,
          dateTime,
          customerId,
          totalAmount,
          payments,
          paid,
          country,
          statusHistory,
        } = data;
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
        Boolean(statusHistory) &&
          setStatus(statusHistory[statusHistory.length - 1]);
        setStatusHistory(statusHistory);
        setDelivery(delivery);
        setDeliveryAddress(deliveryAddress);
        setDateTime(dateTime);
        fetchCustomer(customerId).then((data) => setCustomer(data));
        setTotalAmount(totalAmount);
        setPayments(payments);
        setPaid(paid);
        setCountry(country);
        setQrValue(
          `http://localhost:3000/${subsys}/orders/${orderId}/pick-pack`
        );
        setQrDelivery(
          `http://localhost:3000/${subsys}/procurements/${orderId}/delivery`
        );
        setLoading(false);
      } catch (error) {
        addToast(`Error: ${error.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    };
    fetchOrder();
  }, [subsys, orderId, addToast]);

  const openModal = () => setOpenDelete(true);
  const closeModal = () => setOpenDelete(false);

  const openInvoice = () => setOpen(true);
  const closeInvoice = () => setOpen(false);

  const openConfirmModal = () => setOpenConfirm(true);
  const closeConfirmModal = () => setOpenConfirm(false);
  const tabs = [
    {
      name: "Details",
      href: `/${subsys}/orders/${orderId}`,
      current: true,
    },
    {
      name: "Pick / Pack",
      href: `/${subsys}/orders/${orderId}/pick-pack`,
      current: false,
    },
    { name: "Delivery", href: "#", current: false },
  ];
  return loading ? (
    <div className="flex mt-5 items-center justify-center">
      <TailSpin color="#00BFFF" height={20} width={20} />
    </div>
  ) : (
    <>
      <div className="py-8 xl:py-10">
        <Header
          subsys={subsys}
          disableTabs={delivery === null || delivery === undefined}
          tabs={tabs}
          orderId={orderId}
          disableInvoice={status === undefined}
          openInvoice={openInvoice}
        />
        <Outlet
          context={{
            subsys,
            orderId,
            dateTime,
            customer,
            delivery,
            deliveryAddress,
            totalAmount,
            payments,
            paid,
            country,
            status,
            setStatus,
            lineItems,
            setLineItems,
            statusHistory,
            setStatusHistory,
            currSiteId,
          }}
        />
      </div>

      {Boolean(statusHistory) && Boolean(statusHistory.length) && (
        <div className="hidden">
          <OnlineOrderInvoice
            ref={componentRef}
            title={`${
              Boolean(statusHistory.length) &&
              deliveryStatuses.some(
                (s) => s === statusHistory[statusHistory.length - 1].status
              )
                ? "Delivery"
                : ""
            } Invoice`}
            orderId={orderId}
            orderStatus={status}
            dateTime={dateTime}
            fromSite={statusHistory[0].actionBy}
            delivery={delivery}
            customer={customer}
            deliveryAddress={deliveryAddress}
            data={lineItems}
            qrValue={qrValue}
          >
            <InvoiceSummary data={lineItems} status={status.status} />
          </OnlineOrderInvoice>
        </div>
      )}
      {Boolean(statusHistory) && Boolean(statusHistory.length) && (
        <InvoiceModal
          open={open}
          closeModal={closeInvoice}
          handlePrint={handlePrint}
        >
          <OnlineOrderInvoice
            title={`${
              Boolean(statusHistory.length) &&
              deliveryStatuses.some(
                (s) => s === statusHistory[statusHistory.length - 1].status
              )
                ? "Delivery"
                : ""
            } Invoice`}
            orderId={orderId}
            orderStatus={status}
            dateTime={dateTime}
            fromSite={statusHistory[0].actionBy}
            delivery={delivery}
            customer={customer}
            deliveryAddress={deliveryAddress}
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
          </OnlineOrderInvoice>
        </InvoiceModal>
      )}

      {Boolean(action) && (
        <Confirmation
          title={`${action.name} "Order #${orderId}"`}
          body={`Are you sure you want to ${action.name.toLowerCase()} "Order #${orderId}"? This action cannot be undone.`}
          open={openConfirm}
          closeModal={closeConfirmModal}
          onConfirm={action.action}
        />
      )}
    </>
  );
};
