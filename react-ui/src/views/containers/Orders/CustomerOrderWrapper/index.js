import { Dialog } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import { useMemo } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useToasts } from "react-toast-notifications";
import { api, onlineOrderApi, orderApi } from "../../../../environments/Api";
import { selectUserSite } from "../../../../stores/slices/userSlice";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import Confirmation from "../../../components/Modals/Confirmation";
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
  delivery,
  statusHistory,
  subsys,
  disableTabs,
  tabs,
  orderId,
  openInvoice,
  disableInvoice,
  openConfirm,
  setAction,
  onCancelOrderClicked,
}) => {
  const status =
    statusHistory &&
    Boolean(statusHistory.length) &&
    statusHistory[statusHistory?.length - 1]?.status;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
      <NavigatePrev page="Orders" path={`/${subsys}/orders/search`} />
      <div className="relative pb-5 border-b border-gray-200 sm:pb-0">
        <div className="md:flex md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{`Order #${orderId}`}</h1>
          <div className="mt-3 flex md:mt-0 md:absolute md:top-3 md:right-0">
            {status && (status === "PENDING" || status === "PICKING") && (
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                onClick={() => {
                  setAction({ name: "Cancel", action: onCancelOrderClicked });
                  openConfirm();
                }}
              >
                <span>Cancel Order</span>
              </button>
            )}
            {status === "READY_FOR_DELIVERY" && delivery && (
              <a
                href="https://app.staging.shippit.com/merchant/manage_new_orders/ready_for_despatch"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                <button type="button" className="font-medium text-grat-900">
                  <span>Dispatch order</span>
                </button>
              </a>
            )}
            {!disableInvoice && (
              <button
                type="button"
                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
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
        accessor: `${status === "READY_FOR_DELIVERY" ? "packedQty" : "qty"}`,
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
  const handlePrint = useReactToPrint({ content: () => componentRef.current });
  const [lineItems, setLineItems] = useState([]);
  const [parcelDelivery, setParcelDelivery] = useState([])
  const [promotions, setPromotions] = useState([]);
  const [refundedLIs, setRefundedLIs] = useState([]);
  const [exchangedLIs, setExchangedLIs] = useState([]);
  const [voucher, setVoucher] = useState(null);
  const [status, setStatus] = useState("");
  const [statusHistory, setStatusHistory] = useState([]);
  const [delivery, setDelivery] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [dateTime, setDateTime] = useState(-1);
  const [customer, setCustomer] = useState(-1);
  const [totalAmount, setTotalAmount] = useState(-1);
  const [payments, setPayments] = useState([]);
  const [site, setSite] = useState(false);
  const [pickupSite, setPickupSite] = useState(null);
  const [country, setCountry] = useState(null);
  const [qrValue, setQrValue] = useState("");
  const [qrDelivery, setQrDelivery] = useState("");
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
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
          pickupSite,
          site,
          country,
          statusHistory,
          promotions,
          refundedLIs,
          exchangedLIs,
          voucher,
          parcelDelivery
        } = data;

        fetchAllModelsBySkus(lineItems).then((data) => {
          setLineItems(
            lineItems.map((item, index) => ({
              ...item,
              index: index + 1,
              product: {
                ...item.product,
                modelCode: data[index].modelCode,
                name: data[index].name,
              },
            }))
          );
        });
        setPromotions(promotions);
        setRefundedLIs(refundedLIs);
        setExchangedLIs(exchangedLIs);
        setVoucher(voucher);
        Boolean(statusHistory) &&
          setStatus(statusHistory[statusHistory.length - 1]);
        setStatusHistory(statusHistory);
        setDelivery(delivery);
        setDeliveryAddress(deliveryAddress);
        setDateTime(dateTime);
        fetchCustomer(customerId).then((data) => setCustomer(data));
        setTotalAmount(totalAmount);
        setPayments(payments);
        setPickupSite(pickupSite);
        setSite(site);
        setCountry(country);
        setParcelDelivery(parcelDelivery)
        setQrValue(
          `http://localhost:3000/${subsys}/orders/${orderId}/pick-pack`
        );
        setQrDelivery(
          `http://localhost:3000/${subsys}/orders/${orderId}/delivery`
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

  const onCancelOrderClicked = async () => {
    setLoading(true);
    try {
      const { data } = await onlineOrderApi.cancelOrder(orderId, currSiteId);
      console.log(data);
      addToast(`Success: Cancelled Order ${orderId}`, {
        appearance: "success",
        autoDismiss: true,
      });
      closeConfirmModal();
    } catch (err) {
      addToast(`Error:  ${err.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const openInvoice = () => setOpen(true);
  const closeInvoice = () => setOpen(false);

  const openConfirmModal = () => setOpenConfirm(true);
  const closeConfirmModal = () => setOpenConfirm(false);

  const openInfoModal = () => setOpenInfo(true);
  const closeInfoModal = () => setOpenInfo(false);

  const tabs = delivery
    ? [
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
      ]
    : [
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
        status !== "" &&
        site?.id !== pickupSite?.id &&
        statusHistory[statusHistory.length - 1].status !==
          "READY_FOR_COLLECTION" &&
        statusHistory[statusHistory.length - 1].status !== "COLLECTED"
          ? {
              name: "Delivery",
              href: `/${subsys}/orders/${orderId}/delivery`,
              current: false,
            }
          : {
              name: "Collection",
              href: `/${subsys}/orders/${orderId}/collect`,
              current: false,
            },
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
          disableInvoice={status === ""}
          openInvoice={openInvoice}
          statusHistory={statusHistory}
          setAction={setAction}
          openConfirm={openConfirmModal}
          onCancelOrderClicked={onCancelOrderClicked}
          delivery={delivery}
        />
        <Outlet
          context={{
            addToast,
            subsys,
            orderId,
            dateTime,
            customer,
            delivery,
            deliveryAddress,
            totalAmount,
            payments,
            site,
            pickupSite,
            country,
            status,
            setStatus,
            lineItems,
            setLineItems,
            statusHistory,
            setStatusHistory,
            currSiteId,
            promotions,
            refundedLIs,
            exchangedLIs,
            voucher,
            openInvoice,
            openInfoModal,
            parcelDelivery
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
            qrValue={
              status.status !== "READY_FOR_DELIVERY" ? qrValue : qrDelivery
            }
            qrHelper={
              status.status !== "READY_FOR_DELIVERY"
                ? "Scan to start picking."
                : "Scan to start delivery."
            }
            site={site}
            pickupSite={pickupSite}
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
              status.status !== "READY_FOR_DELIVERY" ? qrValue : qrDelivery
            }
            qrHelper={
              status.status !== "READY_FOR_DELIVERY"
                ? "Scan to start picking."
                : "Scan to start delivery."
            }
            site={site}
            pickupSite={pickupSite}
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
      <SimpleModal open={openInfo} closeModal={closeInfoModal}>
        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CheckIcon
                className="h-6 w-6 text-green-600"
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <Dialog.Title
                as="h3"
                className="text-lg leading-6 font-medium text-gray-900"
              >
                Delivery order created
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Delivery order for Order #{orderId} has been successfully
                  created. You can dispatch the parcels to the customer on
                  Shippit.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <a
              href="https://app.staging.shippit.com/merchant/manage_new_orders/ready_for_despatch"
              target="_blank"
              rel="noopener noreferrer"
              className="sm:col-span-1 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:col-start-2 sm:text-sm"
            >
              <button type="button">Dispatch now</button>
            </a>
            <button
              type="button"
              className="m:col-span-1 mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              onClick={closeInfoModal}
            >
              Close
            </button>
          </div>
        </div>
      </SimpleModal>
    </>
  );
};
