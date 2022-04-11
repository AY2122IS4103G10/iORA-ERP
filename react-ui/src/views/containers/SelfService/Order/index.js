import { Combobox, Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon, XIcon } from "@heroicons/react/outline";
import {
  CheckIcon,
  MinusSmIcon,
  PlusSmIcon,
  SelectorIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import ProgressBar from "@ramonak/react-progress-bar";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { api, orderApi, posApi } from "../../../../environments/Api";
import {
  removeSSCustomer,
  selectSSCustomer,
} from "../../../../stores/slices/customerSlice";
import {
  fetchMembershipTiers,
  selectAllMembershipTiers,
} from "../../../../stores/slices/membershipTierSlice";
import ManageCheckout from "../ManageCheckout";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const OrderList = ({
  customer,
  customerVouchers,
  filteredVouchers,
  currTier,
  nextTier,
  lineItems,
  promotions,
  productDetails,
  amount,
  rfid,
  voucher,
  voucherCode,
  setQuery,
  onRfidChanged,
  addRfidClicked,
  onVoucherChanged,
  addVoucherClicked,
  addMemVoucherClicked,
  removeVoucherClicked,
  handleZeroDollarCheckout,
  Modify,
  openModal,
  openCheckoutModal,
  isLoading,
  error,
  voucherError,
  memPts,
  setMemPts,
  useMemPts,
  toggleUseMemPts,
}) => (
  <main>
    <div className="max-w-2xl mx-auto py-16 px-4 sm:pt-24 sm:px-6 lg:px-0">
      <h1 className="text-3xl font-extrabold text-center tracking-tight text-gray-900 sm:text-4xl">
        Please leave items in Scanner Box until checkout is complete
      </h1>

      <form className="mt-12">
        <section aria-labelledby="cart-heading">
          <h2 id="cart-heading" className="sr-only">
            Items in your shopping cart
          </h2>

          <ul className="border-t border-b border-gray-200 divide-y divide-gray-200">
            <li key="header" className="flex py-2">
              <div className="ml-4 flex-1 flex flex-col sm:ml-6">
                <div className="flex justify-between items-center">
                  <div className="text-lg w-6/12">
                    <h3>
                      <strong>Item name</strong>
                    </h3>
                  </div>
                  <div className="text-lg w-2/12">
                    <h3>
                      <strong>Price</strong>
                    </h3>
                  </div>
                  <div className="text-lg w-2/12">
                    <h3>
                      <strong>Quantity</strong>
                    </h3>
                  </div>
                  <div className="text-lg w-2/12">
                    <h3>
                      <strong>Subtotal</strong>
                    </h3>
                  </div>
                </div>
              </div>
            </li>
            {lineItems.map((lineItem) => (
              <li key={lineItem.product.sku} className="flex py-6">
                <div className="ml-4 flex-1 flex flex-col sm:ml-6">
                  <div className="flex justify-between items-center">
                    <div className="text-lg w-6/12">
                      <h4>
                        <strong className="font-medium text-gray-700 hover:text-gray-800">
                          {productDetails.get(lineItem.product.sku)?.name}
                        </strong>
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        Colour:{" "}
                        {productDetails.get(lineItem.product.sku)?.colour}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Size: {productDetails.get(lineItem.product.sku)?.size}
                      </p>
                    </div>
                    <div className="text-lg w-2/12">
                      <p className="line-through text-gray-500">
                        {productDetails[lineItem.product.sku]?.listPrice &&
                          `${Number.parseFloat(
                            productDetails.get(lineItem.product.sku)?.listPrice
                          ).toFixed(2)}`}
                      </p>
                      <p>
                        $
                        {Number.parseFloat(
                          productDetails.get(lineItem.product.sku)
                            ?.discountedPrice
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-lg w-1/12">
                      <p>{lineItem.qty}</p>
                    </div>
                    <div className="w-1/12">
                      <Modify product={lineItem.product} />
                    </div>
                    <div className="text-lg w-2/12">
                      <p>${Number.parseFloat(lineItem.subTotal).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {promotions.length > 0 && (
            <ul className="border-t border-b border-gray-200 divide-y divide-gray-200">
              <li key="header" className="flex py-2">
                <div className="ml-4 flex-1 flex flex-col sm:ml-6">
                  <div className="flex justify-between items-center">
                    <div className="text-lg">
                      <h3>
                        <strong>Promotions</strong>
                      </h3>
                    </div>
                  </div>
                </div>
              </li>
              {promotions.map((lineItem, index) => (
                <li key={index} className="flex py-6">
                  <div className="ml-4 flex-1 flex flex-col sm:ml-6">
                    <div className="flex justify-between items-center">
                      <div className="text-lg w-6/12">
                        <h4>
                          <strong className="font-medium text-gray-700 hover:text-gray-800">
                            {lineItem.promotion.fieldValue}
                          </strong>
                        </h4>
                      </div>
                      <div className="text-lg w-2/12">
                        <p>
                          -${Number.parseFloat(-lineItem.subTotal).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-lg w-2/12">
                        <p>{lineItem.qty}</p>
                      </div>
                      <div className="text-lg w-2/12">
                        <p>
                          -${Number.parseFloat(-lineItem.subTotal).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {voucher && (
            <ul className="border-t border-b border-gray-200 divide-y divide-gray-200">
              <li key="header" className="flex py-2">
                <div className="ml-4 flex-1 flex flex-col sm:ml-6">
                  <div className="flex justify-between items-center">
                    <div className="text-lg">
                      <h3>
                        <strong>Voucher</strong>
                      </h3>
                    </div>
                  </div>
                </div>
              </li>
              <li className="flex py-6">
                <div className="ml-4 flex-1 flex flex-col sm:ml-6">
                  <div className="flex justify-between items-center">
                    <div className="text-lg w-6/12">
                      <h4>
                        <strong className="font-medium text-gray-700 hover:text-gray-800">
                          {voucher?.voucherCode}
                        </strong>
                      </h4>
                    </div>
                    <div className="text-lg w-2/12">
                      <p>-${Number.parseFloat(voucher?.amount).toFixed(2)}</p>
                    </div>
                    <div className="text-lg w-2/12">
                      <p>1</p>
                    </div>
                    <div className="text-lg w-2/12">
                      <p>-${Number.parseFloat(voucher?.amount).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          )}
        </section>
        <section aria-labelledby="summary-heading" className="mt-5">
          <h2 id="summary-heading" className="sr-only">
            Order summary
          </h2>

          <div>
            <dl className="space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-2xl font-bold text-gray-900">
                  Total Amount
                </dt>
                <dd className="ml-4 text-2xl font-bold font-medium text-gray-900">
                  ${amount}
                </dd>
              </div>
            </dl>
            <p className="mt-1 text-sm text-gray-500">
              Please proceed to our friendly staff for assistance if there is an
              issue with your order.
            </p>
          </div>
        </section>
        <div className="grid grid-cols-4 gap-2">
          <label
            htmlFor="rfid"
            className="block mt-6 text-sm font-medium text-gray-700 col-span-4"
          >
            SKU Code or RFID
          </label>
          <input
            type="text"
            name="rfid"
            id="rfid"
            autoComplete="rfid"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block col-span-3 sm:text-sm border-gray-300 rounded-md"
            placeholder="AA0009876-1 or 10-0001234-0XXXXX-0000XXXXX"
            value={rfid}
            onChange={onRfidChanged}
            required
            aria-describedby="rfid"
          />
          <button
            type="submit"
            className="col-span-1 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={addRfidClicked}
          >
            Add product
          </button>
          {error && (
            <div className="col-span-4 mt-3 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon
                    className="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">Product not found.</p>
                </div>
              </div>
            </div>
          )}
          <label
            htmlFor="voucher"
            className="block mt-3 text-sm font-medium text-gray-700 col-span-4"
          >
            Voucher
          </label>
          {customerVouchers ? (
            <Combobox
              as="div"
              value={voucherCode}
              onChange={onVoucherChanged}
              className="col-span-3"
            >
              <div className="relative">
                <Combobox.Input
                  className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  onChange={(event) => setQuery(event.target.value)}
                  displayValue={(voucher) => voucher.voucherCode || voucher}
                  placeholder="Choose One"
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                  <SelectorIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>

                {filteredVouchers.length > 0 && (
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredVouchers.map((voucher, index) => (
                      <Combobox.Option
                        key={index}
                        value={voucher.voucherCode}
                        className={({ active }) =>
                          classNames(
                            "relative cursor-default select-none py-2 pl-3 pr-9",
                            active
                              ? "bg-indigo-600 text-white"
                              : "text-gray-900"
                          )
                        }
                      >
                        {({ active, selected }) => (
                          <>
                            <span
                              className={classNames(
                                "block truncate",
                                selected && "font-semibold"
                              )}
                            >
                              {`${voucher.campaign}: $${
                                voucher.amount
                              } voucher (expiring ${moment(
                                voucher.expiry
                              ).format("DD/MM/yyyy")})`}
                            </span>

                            {selected && (
                              <span
                                className={classNames(
                                  "absolute inset-y-0 right-0 flex items-center pr-4",
                                  active ? "text-white" : "text-indigo-600"
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
            </Combobox>
          ) : (
            <input
              type="text"
              name="voucher"
              id="voucher"
              autoComplete="voucher"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block col-span-3 sm:text-sm border-gray-300 rounded-md"
              placeholder="XXXXXXXXXX"
              value={voucherCode}
              onChange={onVoucherChanged}
              aria-describedby="voucher"
            />
          )}
          {voucher ? (
            <button
              type="submit"
              className="col-span-1 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={removeVoucherClicked}
            >
              Remove voucher
            </button>
          ) : (
            <button
              type="submit"
              className="col-span-1 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={addVoucherClicked}
            >
              Add voucher
            </button>
          )}
          {customer.membershipPoints ? (
            <>
              {useMemPts ? (
                <>
                  <div className="col-span-2 grid grid-rows-1">
                    <label for="memPts" className="form-label text-sm mt-2">
                      Use {memPts}/{Math.min(customer.membershipPoints, amount)} points
                    </label>
                    <input
                      type="range"
                      className="accent-indigo-600 bg-transparent focus:outline-none focus:ring-0 focus:shadow-none"
                      min={0}
                      max={Math.min(customer.membershipPoints, amount)}
                      value={memPts}
                      onChange={(e) => setMemPts(e.target.value)}
                      id="memPts"
                    />
                  </div>
                  <button
                    type="submit"
                    className="justify-center mt-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={addMemVoucherClicked}
                  >
                    Get ${memPts} off
                  </button>
                </>
              ) : (
                <p className="block font-medium text-gray-700 mt-4 col-span-3">
                  No vouchers? Use your points instead!
                </p>
              )}
              <button
                className={`${
                  useMemPts
                    ? "border-red-600 text-white bg-red-600 hover:bg-red-500 focus:ring-red-500"
                    : "border-gray-500 text-black bg-white hover:bg-gray-50 focus:ring-gray-500"
                } col-span-1 justify-center mt-2 py-2 px-4 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2`}
                onClick={toggleUseMemPts}
              >
                {useMemPts ? "Cancel" : "Use points now!"}
              </button>
            </>
          ) : null}
          {voucherError && (
            <div className="mt-3 bg-red-50 border-l-4 border-red-400 p-4 col-span-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon
                    className="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">Voucher not found.</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Order summary */}
        <section aria-labelledby="summary-heading" className="mt-6">
          <div className="grid grid-cols-2 gap-x-12">
            {currTier && nextTier && (
              <>
                <div className="col-span-2 my-3">
                  <p className="block text-md text-gray-700 my-4">
                    Upgrade from a {currTier.name} member to a {nextTier.name}{" "}
                    member simply by spending ${nextTier.minSpend}!
                  </p>
                  <ProgressBar
                    animateOnRender
                    initCompletedOnAnimation={`${customer.currSpend + 75}`}
                    bgColor="#4f46e5"
                    completed={`${customer.currSpend + 150}`}
                    maxCompleted={nextTier.minSpend + 150}
                    customLabel={`$${
                      nextTier.minSpend - customer.currSpend
                    } more to ${nextTier.name}`}
                  />
                </div>
              </>
            )}
            <label
              htmlFor="rfid"
              className="block text-lg font-medium mb-2 text-gray-700 col-span-2"
            >
              Thank you for shopping with us
              {customer ? `, ${customer?.firstName} ${customer?.lastName}` : ""}
              ! How would you like to checkout?
            </label>
            <button
              type="button"
              className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
              onClick={
                amount > 0
                  ? () => openCheckoutModal(false)
                  : handleZeroDollarCheckout
              }
              disabled={lineItems.length === 0}
            >
              Keyboard Input
            </button>
            <button
              type="button"
              className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
              onClick={
                amount > 0
                  ? () => openCheckoutModal(true)
                  : handleZeroDollarCheckout
              }
              disabled={lineItems.length === 0}
            >
              Card Reader
            </button>
            {isLoading ? (
              <div className="flex mt-5 items-center justify-center">
                <TailSpin color="#00BFFF" height={20} width={20} />
              </div>
            ) : (
              <button
                type="button"
                className="col-span-2 mt-3 bg-red-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                onClick={() => openModal()}
              >
                Cancel
              </button>
            )}
          </div>
        </section>
      </form>

      {/* <div className="mt-6 text-sm text-center text-gray-500">
                <p>
                    or{' '}
                    <a href="#" className="text-indigo-600 font-medium hover:text-indigo-500">
                        Apply for Member<span aria-hidden="true"> &rarr;</span>
                    </a>
                </p>
            </div> */}
    </div>
  </main>
);

function ConfirmCancel({ open, closeModal, onCancel }) {
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  onClick={closeModal}
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
                    Cancel Order
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to cancel this order?
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onCancel}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  No
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export function Order() {
  const [rfid, setRfid] = useState("");
  const [lineItems, setLineItems] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [productDetails, setProductDetails] = useState(new Map());
  const [amount, setAmount] = useState(0);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucher, setVoucher] = useState(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [memPts, setMemPts] = useState(0);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [order, setOrder] = useState({});
  const siteId = localStorage?.getItem("siteId");
  const customer = useSelector((state) => selectSSCustomer(state));
  const [customerVouchers, setCustomerVouchers] = useState([]);

  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [voucherError, setVoucherError] = useState("");
  const [openCheckout, setOpenCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useReader, setUseReader] = useState(true);
  const [query, setQuery] = useState("");
  const [useMemPts, setUseMemPts] = useState(false);
  const filteredVouchers =
    query === ""
      ? customerVouchers
      : customerVouchers.filter((voucher) =>
          voucher.voucherCode.includes(query)
        );
  const membershipTiers = useSelector((state) =>
    selectAllMembershipTiers(state)
  );
  const nextTier =
    customer &&
    (membershipTiers.find((tier) => tier.minSpend > customer.currSpend) || {
      name: "DIAMOND",
      minSpend: customer.currSpend,
    });
  const currTier =
    customer &&
    membershipTiers
      .filter((tier) => tier.minSpend <= customer.currSpend)
      .slice(-1)[0];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const renderSummary =
    new URLSearchParams(useLocation()?.search).get("redirect_status") ===
    "succeeded";

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const openCheckoutModal = (reader) => {
    setUseReader(reader);
    setOpenCheckout(true);
    setCheckoutItems(lineItems.concat(promotions));
    setOrder({
      totalAmount: Math.max(amount - voucherDiscount, 0),
      lineItems: lineItems,
      promotions: promotions,
      payments: [],
      refundedLIs: [],
      exchangedLIs: [],
      voucher,
      site: {
        id: siteId,
      },
      customerId: customer?.id,
    });
  };

  const handleZeroDollarCheckout = async () => {
    const { data } = await orderApi.createOrder(
      {
        totalAmount: 0.0,
        lineItems: lineItems,
        promotions: promotions,
        payments: [
          {
            amount: 0,
            paymentType: "CASH",
            ccTransactionId: "",
          },
        ],
        refundedLIs: [],
        exchangedLIs: [],
        voucher,
        site: {
          id: siteId,
        },
        customerId: customer?.id,
      },
      ""
    );
    navigate(
      `/ss/order/${data.id}?redirect_status=succeeded&payment_intent_client_secret=`
    );
  };

  const closeCheckoutModal = () => {
    setOpenCheckout(false);
    setCheckoutItems([]);
  };

  const addRfidClicked = (e) => {
    e.preventDefault();
    addProduct(rfid);
  };

  const onRfidChanged = (e) => {
    if (
      e.target.value.length - rfid.length > 10 &&
      e.target.value.includes("-")
    ) {
      addProduct(e.target.value);
    }
    setRfid(e.target.value);
  };

  const addProduct = async (rfid) => {
    try {
      const response = await posApi.addProductToLineItems(rfid, lineItems);
      setLineItems(response.data);
      setError("");
      if (!productDetails.has(rfid)) {
        const detail = await api.get("store/productDetails", rfid);
        setProductDetails(productDetails.set(rfid, detail.data));
      }
      setAmount(response.data.map((x) => x.subTotal).reduce((x, y) => x + y));
      setRfid("");
    } catch (err) {
      setError(err.response.data);
      setRfid("");
    }
  };

  const removeProduct = async (rfid) => {
    const response = await posApi.removeProductFromLineItems(rfid, lineItems);
    setLineItems(response.data);
    setAmount(
      response.data.length === 0
        ? 0
        : response.data.map((x) => x.subTotal).reduce((x, y) => x + y)
    );
  };

  const onCancel = () => {
    dispatch(removeSSCustomer());
    clear();
    navigate("/ss");
  };

  useEffect(() => {
    async function calculate() {
      const response = await posApi.calculatePromotions(lineItems);
      setPromotions(response.data[1]);
      setAmount(
        response.data
          .map((y) => y.map((x) => x.subTotal).reduce((x, y) => x + y, 0))
          .reduce((x, y) => x + y, 0)
      );
    }
    calculate();
  }, [setPromotions, lineItems]);

  const addVoucherClicked = (e) => {
    e.preventDefault();
    fetchVoucher(voucherCode);
  };

  const addMemVoucherClicked = (e) => {
    e.preventDefault();
    setVoucherCode("");
    setQuery("");
    setVoucherDiscount(memPts);
    setUseMemPts(false);
    setVoucher({
      campaign: "membership points",
      amount: memPts,
    });
  };

  const removeVoucherClicked = (e) => {
    e.preventDefault();
    setVoucher(null);
    setVoucherDiscount(0);
    setVoucherCode("");
    setQuery("");
  };

  const onVoucherChanged = (e) => {
    if (!e?.target?.value) {
      setVoucherCode(e);
      fetchVoucher(e);
      return;
    }
    if (e.target.value.length - voucherCode.length > 9) {
      fetchVoucher(e.target.value);
    }
    setVoucherCode(e.target.value);
  };

  const fetchVoucher = async (code) => {
    setVoucherCode("");
    setQuery("");
    try {
      const { data } = await posApi.getVoucherByCode(code);
      setVoucher(data);
      setVoucherDiscount(data?.amount);
      setVoucherError("");
    } catch (err) {
      setVoucher(null);
      setVoucherDiscount(0);
      setVoucherError("No such voucher found");
    }
  };

  const Modify = (props) => {
    const { product } = props;

    return (
      <div className="text-md w-1/12">
        <p>
          <button
            type="button"
            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            onClick={() => addProduct(product.sku)}
          >
            <PlusSmIcon className="h-3 w-3" aria-hidden="true" />
          </button>
        </p>
        <p>
          <button
            type="button"
            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={() => removeProduct(product.sku)}
          >
            <MinusSmIcon className="h-3 w-3" aria-hidden="true" />
          </button>
        </p>
      </div>
    );
  };

  const clear = () => {
    setRfid("");
    setLineItems([]);
    setPromotions([]);
    setAmount(0);
  };

  useEffect(() => {
    dispatch(fetchMembershipTiers());
  }, [dispatch]);

  useEffect(() => {
    customer?.id &&
      posApi
        .getVoucherCodes(customer.id)
        .then(({ data }) => setCustomerVouchers(data));
  }, [customer]);

  const toggleUseMemPts = (e) => {
    e.preventDefault();
    setUseMemPts(!useMemPts);
  };

  return (
    <>
      {!renderSummary && (
        <ConfirmCancel
          open={open}
          closeModal={closeModal}
          onCancel={onCancel}
        />
      )}
      <ManageCheckout
        useReader={useReader}
        open={openCheckout}
        openModal={openCheckoutModal}
        closeModal={closeCheckoutModal}
        onCancel={closeCheckoutModal}
        setIsLoading={setIsLoading}
        checkoutItems={checkoutItems}
        order={order}
        amount={Math.max(amount - voucherDiscount, 0)}
        voucherAmt={voucherDiscount}
      />
      {!renderSummary && (
        <OrderList
          customer={customer}
          customerVouchers={customerVouchers}
          filteredVouchers={filteredVouchers}
          currTier={currTier}
          nextTier={nextTier}
          memPts={memPts}
          rfid={rfid}
          voucher={voucher}
          voucherCode={voucherCode}
          lineItems={lineItems}
          productDetails={productDetails}
          promotions={promotions}
          amount={Math.max(amount - voucherDiscount, 0)}
          onRfidChanged={onRfidChanged}
          addRfidClicked={addRfidClicked}
          onVoucherChanged={onVoucherChanged}
          addVoucherClicked={addVoucherClicked}
          addMemVoucherClicked={addMemVoucherClicked}
          removeVoucherClicked={removeVoucherClicked}
          setQuery={setQuery}
          setMemPts={setMemPts}
          useMemPts={useMemPts}
          toggleUseMemPts={toggleUseMemPts}
          Modify={Modify}
          openModal={openModal}
          openCheckoutModal={openCheckoutModal}
          handleZeroDollarCheckout={handleZeroDollarCheckout}
          isLoading={isLoading}
          error={error}
          voucherError={voucherError}
        />
      )}
    </>
  );
}
