import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon, XIcon } from "@heroicons/react/outline";
import { MinusSmIcon, PlusSmIcon, XCircleIcon } from "@heroicons/react/solid";
import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api, posApi } from "../../../../environments/Api";
import ManageCheckout from "../ManageCheckout";

const OrderList = ({
  lineItems,
  promotions,
  productDetails,
  amount,
  rfid,
  onRfidChanged,
  addRfidClicked,
  Modify,
  openModal,
  openCheckoutModal,
  isLoading,
  error,
}) => (
  <main>
    <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-0">
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
        <div>
          <label
            htmlFor="rfid"
            className="block mt-5 text-sm font-medium text-gray-700"
          >
            SKU Code or RFID
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="rfid"
              id="rfid"
              autoComplete="rfid"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="AA0009876-1 or 10-0001234-0XXXXX-0000XXXXX"
              value={rfid}
              onChange={onRfidChanged}
              required
              aria-describedby="rfid"
            />
            {error && (
              <div className="mt-3 bg-red-50 border-l-4 border-red-400 p-4">
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
            <button
              type="submit"
              className="inline-flex justify-end mt-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={addRfidClicked}
            >
              Add product
            </button>
          </div>
        </div>
        {/* Order summary */}
        <section aria-labelledby="summary-heading" className="mt-10">
          <div className="mt-10">
            <button
              type="button"
              className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
              onClick={openCheckoutModal}
              disabled={lineItems.length === 0}
            >
              {localStorage.getItem("customer") === null ? (
                <>Checkout as Guest</>
              ) : (
                <>
                  Checkout as {JSON.parse(localStorage.customer).firstName}{" "}
                  {JSON.parse(localStorage.customer).lastName}
                </>
              )}
            </button>
            {isLoading ? (
              <div className="spinner" id="spinner" />
            ) : (
              <button
                type="button"
                className="w-full mt-3 bg-red-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
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
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [openCheckout, setOpenCheckout] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState({});

  const navigate = useNavigate();
  const renderSummary =
    new URLSearchParams(useLocation()?.search).get("redirect_status") ===
    "succeeded";

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const openCheckoutModal = () => {
    setOpenCheckout(true);
    const concat = lineItems.concat(promotions);
    setCheckoutItems(concat);
    setOrder({
      totalAmount: 0.0,
      lineItems: concat,
      payments: [],
      paid: false,
      refundedLIs: [],
      exchangedLIs: [],
      customerId:
        localStorage.getItem("customer") === null
          ? JSON.parse(localStorage.getItem("customer"))?.id
          : null,
    });
  };

  const closeCheckoutModal = () => {
    setOpenCheckout(false);
    setCheckoutItems([]);
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
    localStorage.removeItem("customer");
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

  const addRfidClicked = (e) => {
    e.preventDefault();
    addProduct(rfid);
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
        open={openCheckout}
        openModal={openCheckoutModal}
        closeModal={closeCheckoutModal}
        onCancel={closeCheckoutModal}
        setIsLoading={setIsLoading}
        checkoutItems={checkoutItems}
        order={order}
      />
      {!renderSummary && (
        <OrderList
          rfid={rfid}
          lineItems={lineItems}
          productDetails={productDetails}
          promotions={promotions}
          amount={amount}
          onRfidChanged={onRfidChanged}
          addRfidClicked={addRfidClicked}
          Modify={Modify}
          openModal={openModal}
          openCheckoutModal={openCheckoutModal}
          isLoading={isLoading}
          error={error}
        />
      )}
    </>
  );
}
