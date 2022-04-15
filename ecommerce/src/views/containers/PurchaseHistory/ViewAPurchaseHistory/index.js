import { ChevronDownIcon, XIcon } from "@heroicons/react/solid";
import { ExclamationIcon } from "@heroicons/react/outline";
import { Dialog, Menu, Transition } from "@headlessui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { productApi } from "../../../../environments/Api";
import {
  cancelOrder,
  completeOrder,
  selectUser,
  selectUserOrderById,
} from "../../../../stores/slices/userSlice";
import { classNames } from "../../../../utilities/Util";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import { Fragment } from "react";

export const fetchModelBySku = async (sku) => {
  const { data } = await productApi.getModelBySku(sku);
  return data;
};

export const fetchAllModelsBySkus = async (items) => {
  return Promise.all(items.map((item) => fetchModelBySku(item.product.sku)));
};

const calculateSubTotal = (lineItems) => {
  let subTotal = 0;
  subTotal = lineItems.map((item) => item.subTotal).reduce((a, b) => a + b, 0);
  return subTotal;
};

export const PurchaseHistoryDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const user = useSelector(selectUser);
  const order = useSelector((state) =>
    selectUserOrderById(state, parseInt(orderId))
  );
  const status = Boolean(order?.statusHistory)
    ? order?.statusHistory[order?.statusHistory.length - 1]
    : null;
  const [lineItems, setLineItems] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null);

  const onCancelOrderClicked = async () => {
    setLoading(true);
    try {
      await dispatch(
        cancelOrder({ orderId: order?.id, customerId: order?.customerId })
      ).unwrap();
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

  const onCompleteOrderClicked = async () => {
    setLoading(true);
    try {
      await dispatch(completeOrder(order?.id)).unwrap();
      addToast(`Success: Order ${orderId} has been completed.`, {
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

  const openConfirmModal = () => setOpenConfirm(true);
  const closeConfirmModal = () => setOpenConfirm(false);

  useEffect(() => {
    const orderLineItems = order?.lineItems || [];
    const status = Boolean(order?.statusHistory)
      ? order?.statusHistory[order?.statusHistory.length - 1]
      : null;
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
              ...data[index],
              step: !Boolean(status)
                ? null
                : status.status === "PENDING" || status.status === "CANCELLED"
                ? 0
                : (
                    order?.pickupSite
                      ? [
                          "PICKING",
                          "PICKED",
                          "PACKING",
                          "PACKED",
                          "READY_FOR_DELIVERY",
                          "DELIVERING",
                          "DELIVERING_MULTIPLE",
                        ].some((s) => status.status === s)
                      : ["PICKING", "PICKED", "PACKING", "PACKED"].some(
                          (s) => status.status === s
                        )
                  )
                ? 1
                : status.status === "DELIVERED" || status.status === "COLLECTED"
                ? 4
                : 2,
            },
            promo: promo !== undefined ? promo.promotion.fieldValue : null,
          };
        })
      )
    );
  }, [order, addToast, navigate, orderId]);

  return (
    <>
      {order ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-16 lg:px-8">
            <NavigatePrev page="Orders" path="/orders" />
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  Order Details
                </h1>
                {status.status === "CANCELLED" && (
                  <span className="ml-4 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Cancelled
                  </span>
                )}
              </div>
              <div className="flex items-center justify-end space-x-3">
                {status.status === "PENDING" && (
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    onClick={() => {
                      setAction({
                        name: "cancel",
                        description:
                          "You will be refunded the full amount in store credit which can be used for future purchases with us.",
                        action: onCancelOrderClicked,
                      });
                      openConfirmModal();
                    }}
                  >
                    <span>Cancel order</span>
                  </button>
                )}
                {Boolean(order.parcelDelivery?.length) && (
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500">
                        Tracking
                        <ChevronDownIcon
                          className="-mr-1 ml-2 h-5 w-5"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="z-10 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {order.parcelDelivery.map((delivery) => {
                            return (
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href={delivery.trackingURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-sm"
                                    )}
                                  >
                                    {delivery.trackingID}
                                  </a>
                                )}
                              </Menu.Item>
                            );
                          })}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>
              {status.status === "READY_FOR_DELIVERY" && (
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  onClick={() => {
                    setAction({
                      name: "complete",
                      description:
                        "Please ensure that you have received all items in this order. If there any discrepancies, do contact our staff by submitting a support ticket.",
                      action: onCompleteOrderClicked,
                    });
                    openConfirmModal();
                  }}
                >
                  <span>Complete order</span>
                </button>
              )}
            </div>

            <div className="text-sm border-b border-gray-200 mt-2 pb-5 sm:flex sm:justify-between">
              <dl className="flex">
                <dt className="text-gray-500">Order number&nbsp;</dt>
                <dd className="font-medium text-gray-900">{order?.id}</dd>
                <dt>
                  <span className="sr-only">Date</span>
                  <span className="text-gray-400 mx-2" aria-hidden="true">
                    &middot;
                  </span>
                </dt>
                <dd className="font-medium text-gray-900">
                  {moment.unix(order?.dateTime / 1000).format("MMMM Do, YYYY")}
                </dd>
                <dd></dd>
              </dl>
              {Boolean(order?.statusHistory) && (
                <div className="mt-4 sm:mt-0">
                  <Link
                    to={`/checkout/success/${orderId}`}
                    className="font-medium text-gray-600 hover:text-gray-500"
                  >
                    View invoice<span aria-hidden="true"> &rarr;</span>
                  </Link>
                </div>
              )}
            </div>

            <section aria-labelledby="products-heading" className="mt-8">
              <h2 id="products-heading" className="sr-only">
                Products purchased
              </h2>

              <div className="space-y-24">
                {Boolean(lineItems.length) &&
                  lineItems.map(({ product }) => {
                    return (
                      <div
                        key={product.sku}
                        className="grid grid-cols-1 text-sm sm:grid-rows-1 sm:grid-cols-12 sm:gap-x-6 md:gap-x-8 lg:gap-x-8"
                      >
                        <div className="sm:col-span-4 md:col-span-5 md:row-end-2 md:row-span-2">
                          <div className="aspect-w-1 aspect-h-1 bg-gray-50 rounded-lg overflow-hidden">
                            <img
                              src={product.imageLinks[0]}
                              alt={product.name}
                              className="object-center object-cover"
                            />
                          </div>
                        </div>
                        <div className="mt-6 sm:col-span-7 sm:mt-0 md:row-end-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            <Link to={`/products/view/${product.modelCode}`}>
                              {product.name}
                            </Link>
                            {order.refundedLIs.find(
                              (item) => item.product.sku === product.sku
                            ) && (
                              <span className="ml-2 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                Refunded
                              </span>
                            )}
                            {order.exchangedLIs.find(
                              (item) => item.product.sku === product.sku
                            ) && (
                              <span className="ml-2 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                Exchanged
                              </span>
                            )}
                          </h3>
                          <p className="font-medium text-gray-900 mt-1">
                            {product.listPrice !== product.discountPrice ? (
                              <>
                                <span className="line-through text-sm mr-2 text-gray-500">
                                  ${product.listPrice}
                                </span>
                                <span>${product.discountPrice}</span>
                              </>
                            ) : (
                              <span>${product.listPrice}</span>
                            )}
                          </p>
                          <p className="text-gray-500 mt-3">
                            {product.description}
                          </p>
                          <span className="mt-2 text-sm text-gray-600">
                            Colour:{" "}
                            {
                              product.productFields.find(
                                (field) => field.fieldName === "COLOUR"
                              ).fieldValue
                            }
                          </span>
                          <span className="mt-2 text-sm text-gray-600">
                            {" | "}Size:{" "}
                            {
                              product.productFields.find(
                                (field) => field.fieldName === "SIZE"
                              ).fieldValue
                            }
                          </span>
                        </div>
                        {Boolean(order?.statusHistory) && (
                          <div className="sm:col-span-12 md:col-span-7">
                            <dl className="grid grid-cols-1 gap-y-8 border-b py-8 border-gray-200 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
                              <div>
                                <dt className="font-medium text-gray-900">
                                  Delivery address
                                </dt>
                                <dd className="mt-3 text-gray-500">
                                  <address className="not-italic">
                                    <span className="block">
                                      {user.firstName} {user.lastName}
                                    </span>
                                    <span className="block">
                                      {order.deliveryAddress.street1},{" "}
                                      {order.deliveryAddress.street2}
                                    </span>
                                    <span className="block">
                                      {order.deliveryAddress.city},{" "}
                                      {order.deliveryAddress.zip}
                                    </span>
                                  </address>
                                </dd>
                              </div>
                              <div>
                                <dt className="font-medium text-gray-900">
                                  Contact
                                </dt>
                                <dd className="mt-3 text-gray-500 space-y-3">
                                  <span className="block">{user.email}</span>
                                  <span className="block">
                                    {user.contactNumber}
                                  </span>
                                </dd>
                              </div>
                            </dl>
                            <p className="font-medium text-gray-900 mt-6 md:mt-10">
                              {(
                                status.status.charAt(0) +
                                status.status.slice(1).toLowerCase()
                              ).replaceAll("_", " ")}{" "}
                              on{" "}
                              {moment
                                .unix(status.timeStamp / 1000)
                                .format("MMMM Do, YYYY")}
                            </p>
                            <div className="mt-6">
                              <div className="bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-2 bg-gray-600 rounded-full"
                                  style={{
                                    width: `calc((${product.step} * 2 + 1) / 8 * 100%)`,
                                  }}
                                />
                              </div>
                              <div className="hidden sm:grid grid-cols-4 font-medium text-gray-600 mt-6">
                                <div className="text-gray-600">
                                  Order placed
                                </div>
                                <div
                                  className={classNames(
                                    product.step > 0 ? "text-gray-600" : "",
                                    "text-center"
                                  )}
                                >
                                  Processing
                                </div>
                                <div
                                  className={classNames(
                                    product.step > 1 ? "text-gray-600" : "",
                                    "text-center"
                                  )}
                                >
                                  {order.delivery
                                    ? "Shipped"
                                    : "Ready for Collection"}
                                </div>
                                <div
                                  className={classNames(
                                    product.step > 2 ? "text-gray-600" : "",
                                    "text-right"
                                  )}
                                >
                                  {order.delivery ? "Delivered" : "Collected"}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </section>

            {/* Billing */}
            <section aria-labelledby="summary-heading" className="mt-24">
              <h2 id="summary-heading" className="sr-only">
                Billing Summary
              </h2>

              <div className="bg-gray-50 rounded-lg py-6 px-6 lg:px-0 lg:py-8 lg:grid lg:grid-cols-12 lg:gap-x-8">
                <dl className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:pl-8 lg:col-span-5">
                  <div>
                    <dt className="font-medium text-gray-900">
                      Billing address
                    </dt>
                    <dd className="mt-3 text-gray-500">
                      <address className="not-italic">
                        <span className="block">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="block">
                          {user.address.street1}, {user.address.street2}
                        </span>
                        <span className="block">
                          {user.address.city}, {user.address.zip}
                        </span>
                      </address>
                    </dd>
                  </div>
                  {/* <div>
                <dt className="font-medium text-gray-900">
                  Payment information
                </dt>
                <dd className="mt-3 flex">
                  <div>
                    <svg
                      aria-hidden="true"
                      width={36}
                      height={24}
                      viewBox="0 0 36 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-auto"
                    >
                      <rect width={36} height={24} rx={4} fill="#224DBA" />
                      <path
                        d="M10.925 15.673H8.874l-1.538-6c-.073-.276-.228-.52-.456-.635A6.575 6.575 0 005 8.403v-.231h3.304c.456 0 .798.347.855.75l.798 4.328 2.05-5.078h1.994l-3.076 7.5zm4.216 0h-1.937L14.8 8.172h1.937l-1.595 7.5zm4.101-5.422c.057-.404.399-.635.798-.635a3.54 3.54 0 011.88.346l.342-1.615A4.808 4.808 0 0020.496 8c-1.88 0-3.248 1.039-3.248 2.481 0 1.097.969 1.673 1.653 2.02.74.346 1.025.577.968.923 0 .519-.57.75-1.139.75a4.795 4.795 0 01-1.994-.462l-.342 1.616a5.48 5.48 0 002.108.404c2.108.057 3.418-.981 3.418-2.539 0-1.962-2.678-2.077-2.678-2.942zm9.457 5.422L27.16 8.172h-1.652a.858.858 0 00-.798.577l-2.848 6.924h1.994l.398-1.096h2.45l.228 1.096h1.766zm-2.905-5.482l.57 2.827h-1.596l1.026-2.827z"
                        fill="#fff"
                      />
                    </svg>
                    <p className="sr-only">Visa</p>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-900">Ending with 4242</p>
                    <p className="text-gray-600">Expires 02 / 24</p>
                  </div>
                </dd>
              </div> */}
                </dl>

                <dl className="mt-8 divide-y divide-gray-200 text-sm lg:mt-0 lg:pr-8 lg:col-span-7">
                  <div className="pb-4 flex items-center justify-between">
                    <dt className="text-gray-600">Subtotal</dt>
                    <dd className="font-medium text-gray-900">
                      ${calculateSubTotal(lineItems)}
                    </dd>
                  </div>
                  {order.voucher !== null ? (
                    <div className="py-4 flex items-center justify-between">
                      <dt className="text-gray-600">Voucher</dt>
                      <dd className="font-medium text-gray-900">
                        -${order.voucher.amount}
                      </dd>
                    </div>
                  ) : null}
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-gray-600">Shipping</dt>
                    <dd className="font-medium text-gray-900">
                      ${order.delivery ? "2.5" : "0"}
                    </dd>
                  </div>
                  {/* <div className="py-4 flex items-center justify-between">
                <dt className="text-gray-600">Discounts</dt>
                <dd className="font-medium text-gray-900">
                  {order?.promotions?.map((promo) => (
                    <div
                      key={promo.id}
                      className="flex items-center justify-between"
                    >
                      <dt className="text-gray-600">
                        {promo.promotion.fieldValue}
                      </dt>
                      <dd>-${Math.abs(promo.subTotal)}</dd>
                    </div>
                  ))}
                </dd>
              </div> */}
                  <div className="pt-4 flex items-center justify-between">
                    <dt className="font-medium text-gray-900">Order total</dt>
                    <dd className="font-medium text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div className="flex my-12 items-center justify-center">
          <TailSpin color="#111827" height={20} width={20} />
        </div>
      )}
      {Boolean(action) && (
        <SimpleModal open={openConfirm} closeModal={closeConfirmModal}>
          <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                className="bg-white rounded-md text-gray-400 hover:text-gray-500"
                onClick={closeConfirmModal}
              >
                <span className="sr-only">Close</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationIcon
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <Dialog.Title
                  as="h3"
                  className="text-lg leading-6 font-medium text-gray-900"
                >
                  Confirm {action.name.toLowerCase()} Order #{orderId}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Confirm {action.name.toLowerCase()} Order #{orderId}?{" "}
                    {action.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={action.action}
              >
                <span>Confirm</span>
                {loading && (
                  <div className="flex ml-2 items-center justify-center">
                    <TailSpin color="#FFFFFF" height={20} width={20} />
                  </div>
                )}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={closeConfirmModal}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </SimpleModal>
      )}
    </>
  );
};
