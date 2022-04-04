import { Dialog, Transition } from "@headlessui/react";
import {
  InformationCircleIcon,
  ReceiptRefundIcon,
  ReceiptTaxIcon,
  XIcon,
} from "@heroicons/react/solid";
import moment from "moment";
import { Fragment, useEffect, useMemo, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import {
  addExchangeLineItem,
  addRefundLineItem,
  fetchSiteOrders,
  selectOrderById,
} from "../../../../stores/slices/posSlice";
import { selectUserSite } from "../../../../stores/slices/userSlice";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";
import SimpleSelectMenu from "../../../components/SelectMenus/SimpleSelectMenu";
import { SimpleTable } from "../../../components/Tables/SimpleTable";
import {
  fetchAllModelsBySkus,
  fetchModelBySku,
} from "../../StockTransfer/StockTransferForm";

const Header = ({ order, openRefundModal, openExchangeModal }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
      <div className="flex items-center space-x-3 w-full">
        <div className="grow">
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.id}
          </h1>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            className="inline-flex items-center px-3 py-3 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            onClick={openRefundModal}
          >
            <ReceiptRefundIcon
              className="-ml-0.5 mr-2 h-4 w-4"
              aria-hidden="true"
            />
            Refund Item
          </button>
          <button
            type="button"
            className="inline-flex items-center px-3 py-3 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            onClick={openExchangeModal}
          >
            <ReceiptTaxIcon
              className="-ml-0.5 mr-2 h-4 w-4"
              aria-hidden="true"
            />
            Exchange Item
          </button>
        </div>
      </div>
    </div>
  );
};

const ItemTable = ({ data }) => {
  const columns = useMemo(
    () => [
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
        accessor: "qty",
      },
    ],
    []
  );

  return (
    <div className="pt-8">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Items</h3>
      </div>

      <div className="mt-4">
        <SimpleTable columns={columns} data={data} />
      </div>
    </div>
  );
};

const PromoTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "promotion.fieldValue",
      },
      {
        Header: "Qty",
        accessor: "qty",
      },
      {
        Header: "Discount",
        accessor: "subTotal",
        Cell: (e) => `-$${Number.parseFloat(-e.value).toFixed(2)}`,
      },
    ],
    []
  );

  return (
    <div className="pt-6">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Promotions Applied
        </h3>
      </div>

      <div className="mt-4">
        <SimpleTable columns={columns} data={data} />
      </div>
    </div>
  );
};

const VoucherTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Voucher Code",
        accessor: "voucherCode",
      },
      {
        Header: "Discount",
        accessor: "amount",
        Cell: (e) => `-$${Number.parseFloat(e.value).toFixed(2)}`,
      },
      {
        Header: "Expiry",
        accessor: "expiry",
        Cell: (e) => moment(e.value).format("DD/MM/YY"),
      },
    ],
    []
  );

  return (
    <div className="pt-6">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Vouchers Claimed
        </h3>
      </div>

      <div className="mt-4">
        <SimpleTable columns={columns} data={data} />
      </div>
    </div>
  );
};

const RefundTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Item SKU",
        accessor: "product.sku",
      },
      {
        Header: "Quantity Refunded",
        accessor: "qty",
      },
    ],
    []
  );

  return (
    <div className="pt-6">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Refunded Items
        </h3>
      </div>

      <div className="mt-4">
        <SimpleTable columns={columns} data={data} />
      </div>
    </div>
  );
};

const ExchangeTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Returned Item SKU",
        accessor: "oldItem.sku",
      },
      {
        Header: "Exchanged Item SKU",
        accessor: "newItem.sku",
      },
    ],
    []
  );

  return (
    <div className="pt-6">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Exchanged Items
        </h3>
      </div>

      <div className="mt-4">
        <SimpleTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const order = useSelector((state) =>
    selectOrderById(state, parseInt(orderId))
  );
  const siteId = useSelector(selectUserSite);
  const orderStatus = useSelector((state) => state.pos.status);

  const [lineItems, setLineItems] = useState([]);
  const [openRefund, setOpenRefund] = useState(false);
  const [openExchange, setOpenExchange] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundSku, setRefundSku] = useState({
    id: -1,
    name: "Choose One",
    qty: 0,
  });
  const [refundQty, setRefundQty] = useState(1);
  const [exchangedSku, setExchangedSku] = useState({
    id: -1,
    name: "Choose One",
    qty: 0,
  });
  const [exchangeSku, setExchangeSku] = useState({
    id: -1,
    name: "Choose One",
    qty: 0,
  });
  const [exchangeOptions, setExchangeOptions] = useState([]);

  const mapRefundQty = (e) => {
    const maxQty =
      order.lineItems?.find(
        (lineItem) => lineItem.product.sku === refundSku.name
      )?.qty || 0;
    let q =
      e.target.value < 1
        ? 1
        : e.target.value > maxQty
        ? maxQty
        : e.target.value;
    setRefundQty(q);
  };

  const mapExchangeSku = (e) => {
    setExchangeSku(e);
  };

  useEffect(() => {
    orderStatus === "idle" && dispatch(fetchSiteOrders(siteId));
  }, [orderStatus, dispatch, siteId]);

  useEffect(() => {
    if (!order) {
      addToast(`Error: You cannot view Customer Order ${orderId}`, {
        appearance: "error",
        autoDismiss: true,
      });
      navigate("/str/pos/orderHistory");
    }
    const orderLineItems = order?.lineItems || [];
    fetchAllModelsBySkus(orderLineItems).then((data) =>
      setLineItems(
        orderLineItems.map((item, index) => {
          const promo = order.promotions.find(
            (promo) => promo.product.sku === item.product.sku
          );
          return {
            ...item,
            product: {
              ...item.product,
              modelCode: data[index].modelCode,
              name: data[index].name,
            },
            promo: promo !== undefined ? promo.promotion.fieldValue : null,
          };
        })
      )
    );
  }, [order, addToast, navigate, orderId]);

  useEffect(() => {
    exchangedSku.id !== -1 &&
      fetchModelBySku(exchangedSku.name).then(({ products }) => {
        setExchangeOptions(products);
      });
  }, [exchangedSku]);

  useEffect(() => {
    const refundProduct = order?.lineItems?.find((x) => x.product.sku === refundSku?.name);
    refundSku.id !== -1 && order.lineItems.length > 0 &&
      setRefundAmount(
        refundProduct.subTotal * refundQty / refundProduct.qty
      );
  }, [refundSku, order?.lineItems, refundQty]);

  const openRefundModal = () => setOpenRefund(true);
  const closeRefundModal = () => setOpenRefund(false);
  const openExchangeModal = () => setOpenExchange(true);
  const closeExchangeModal = () => setOpenExchange(false);
  const updateOrder = async (event) => {
    if (event === "refund") {
      const product = order.lineItems
        .map((lineItem) => lineItem.product)
        .find((prod) => prod.sku === refundSku.name);
      dispatch(
        addRefundLineItem({ orderId, product, qty: refundQty, refundAmount })
      );
      closeRefundModal();
    }
    if (event === "exchange") {
      const oldItem = order.lineItems
        .map((lineItem) => lineItem.product)
        .find((prod) => prod.sku === exchangedSku.name);
      const newItem = exchangeOptions.find(
        (prod) => prod.sku === exchangeSku.name
      );
      dispatch(addExchangeLineItem({ orderId, oldItem, newItem }));
      closeExchangeModal();
    }
  };

  return orderStatus === "loading" ? (
    <div className="flex mt-5 items-center justify-center">
      <TailSpin color="#00BFFF" height={20} width={20} />
    </div>
  ) : (
    orderStatus === "succeeded" && (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <NavigatePrev page="Orders" path="/str/pos/orderHistory" />
        <Header
          order={order}
          openRefundModal={openRefundModal}
          openExchangeModal={openExchangeModal}
        />
        <RefundModal
          open={openRefund}
          closeModal={closeRefundModal}
          onConfirm={() => updateOrder("refund")}
          lineItems={order?.lineItems.map((lineItem) => {
            return { index: lineItem.id, name: lineItem.product.sku };
          })}
          refundAmount={refundAmount}
          refundSku={refundSku}
          refundQty={refundQty}
          setRefundAmount={(e) => setRefundAmount(e.target.value)}
          setRefundSku={setRefundSku}
          setRefundQty={mapRefundQty}
        />
        <ExchangeModal
          open={openExchange}
          closeModal={closeExchangeModal}
          onConfirm={() => updateOrder("exchange")}
          lineItems={order?.lineItems.map((lineItem) => {
            return { index: lineItem.id, name: lineItem.product.sku };
          })}
          exchangedSku={exchangedSku}
          exchangeSku={exchangeSku}
          exchangeOptions={exchangeOptions.map((product, index) => {
            return { index, name: product.sku };
          })}
          setExchangedSku={setExchangedSku}
          setExchangeSku={mapExchangeSku}
        />
        <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
          <div className="space-y-6 lg:col-start-1 lg:col-span-2">
            {/* Site Information list*/}
            <section aria-labelledby="applicant-information-title">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h2
                    id="order-information-title"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Order Information
                  </h2>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Customer No.
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {order.customerId}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Transaction Date
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {moment(order.dateTime).format("DD/MM/YYYY, H:mm:ss")}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Total Amount
                      </dt>

                      <dd className="mt-1 text-sm text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </dd>
                    </div>

                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Payment Type
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {order.payments
                          .map((payment) => payment.paymentType)
                          .join(", ")}
                      </dd>
                    </div>
                    {order.voucher && (
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Voucher
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <address className="not-italic">
                            <span className="block">
                              ${order.voucher.amount}
                            </span>
                            <span className="block">
                              {order.voucher.voucherCode}
                            </span>
                          </address>
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </section>
            <section aria-labelledby="line-items">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="md:col-span-2">
                  {Boolean(lineItems?.length) && <ItemTable data={lineItems} />}
                </div>
                {Boolean(order.promotions?.length) && (
                  <PromoTable data={order.promotions} />
                )}
                {order?.voucher && <VoucherTable data={[order?.voucher]} />}
                {Boolean(order.refundedLIs?.length) && (
                  <RefundTable data={order?.refundedLIs} />
                )}
                {Boolean(order.exchangedLIs?.length) && (
                  <ExchangeTable data={order?.exchangedLIs} />
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  );
};

const RefundModal = ({
  open,
  closeModal,
  onConfirm,
  lineItems,
  refundAmount,
  refundSku,
  refundQty,
  setRefundAmount,
  setRefundSku,
  setRefundQty,
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-visible shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500"
                  onClick={closeModal}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <InformationCircleIcon
                    className="h-6 w-6 text-blue-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left grow">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900 mb-3"
                  >
                    Refund Item
                  </Dialog.Title>
                  <SimpleSelectMenu
                    className="m-3 p-3"
                    label="SKU Code"
                    options={lineItems}
                    selected={refundSku}
                    setSelected={setRefundSku}
                  />
                  <p className="block text-sm font-medium text-gray-700 mt-2 mb-1">
                    Refund Quantity
                  </p>
                  <SimpleInputBox
                    type="number"
                    name="qty"
                    id="qty"
                    placeholder={0}
                    value={refundQty}
                    onChange={setRefundQty}
                  />
                  <p className="block text-sm font-medium text-gray-700 mt-2 mb-1">
                    Store Credit to Refund
                  </p>
                  <SimpleInputBox
                    type="number"
                    name="refundAmt"
                    id="refundAmt"
                    placeholder={null}
                    value={refundAmount}
                    onChange={setRefundAmount}
                  />
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onConfirm}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
const ExchangeModal = ({
  open,
  closeModal,
  onConfirm,
  lineItems,
  exchangedSku,
  exchangeSku,
  exchangeOptions,
  setExchangedSku,
  setExchangeSku,
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-visible shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500"
                  onClick={closeModal}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <InformationCircleIcon
                    className="h-6 w-6 text-blue-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left grow">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900 mb-3"
                  >
                    Exchange Item
                  </Dialog.Title>
                  <SimpleSelectMenu
                    className="m-3 p-3"
                    label="Returned Item SKU Code"
                    options={lineItems}
                    selected={exchangedSku}
                    setSelected={setExchangedSku}
                  />
                  <SimpleSelectMenu
                    className="m-3 p-3"
                    label="Exchange Item SKU Code"
                    options={exchangeOptions}
                    selected={exchangeSku}
                    setSelected={setExchangeSku}
                  />
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onConfirm}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
