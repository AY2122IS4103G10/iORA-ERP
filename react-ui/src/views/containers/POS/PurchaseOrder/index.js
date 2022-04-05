import { Dialog, Menu, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import {
  ExclamationIcon,
  MinusSmIcon,
  PlusSmIcon,
} from "@heroicons/react/solid";
import { Fragment, useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { api, posApi } from "../../../../environments/Api";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import { CheckoutForm } from "../CheckoutForm";

const OrderList = ({
  rfid,
  lineItems,
  productDetails,
  promotions,
  amount,
  onRfidChanged,
  addRfidClicked,
  Modify,
  openModal,
  openSureModal,
  searchProducts,
}) => {
  const [focusInput, setFocusInput] = useState(false);
  const [focusDropdown, setFocusDropdown] = useState(false);
  return (
    <main>
      <div className="max-w-6xl mx-auto py-2 px-4 sm:py-2 sm:px-6">
        <form>
          <div>
            <label
              htmlFor="rfid"
              className="block mt-8 text-sm font-medium text-gray-700"
            >
              SKU Code or RFID
            </label>
            <div className="mt-1 flex space-x-2">
              <Menu as="div" className="relative inline-block text-left py-1">
                <Transition
                  show={Boolean(rfid) && (focusInput || focusDropdown)}
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    className="origin-top-left absolute left-0 m-2 mt-9 w-56 max-h-96 overflow-y-scroll rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-20 focus:outline-none z-10"
                    onFocus={() => setFocusDropdown(true)}
                    onBlur={() => setFocusDropdown(false)}
                  >
                    <div className="py-1">
                      {searchProducts.map((prod, index) => (
                        <Menu.Item key={index}>
                          <button
                            className="w-full items-start text-left"
                            value={prod.name}
                            onClick={(e) => addRfidClicked(e, prod.name)}
                          >
                            <h4 className="text-sm my-1 px-3 font-medium">
                              {prod.name}
                            </h4>
                            <p className="text-xs my-1 px-3">
                              {prod.fields[1]} {prod.fields[0]}
                            </p>
                          </button>
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
              <input
                type="text"
                name="rfid"
                id="rfid"
                autoComplete="rfid"
                className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-10/12 sm:text-sm border-gray-300 rounded-md"
                placeholder="10-0001234-0XXXXX-0000XXXXX or AA0009876-1"
                value={rfid}
                onChange={onRfidChanged}
                required
                aria-describedby="rfid"
                onFocus={() => setFocusInput(true)}
                onBlur={() => setFocusInput(false)}
              />
              <button
                type="submit"
                className="w-2/12 flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-sm rounded-md text-white bg-cyan-600 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                onClick={addRfidClicked}
              >
                Add product
              </button>
            </div>
          </div>
        </form>

        <form className="mt-12">
          <div className="bg-white shadow sm:rounded-lg p-9 drop-shadow-lg">
            <h1 className="text-3xl py-3 font-bold text-left tracking-tight text-gray-900 sm:text-2xl">
              Order Items
            </h1>
            <section aria-labelledby="cart-heading">
              <h2 id="cart-heading" className="sr-only">
                Items Scanned
              </h2>

              <ul className="border-t border-b border-gray-200">
                {lineItems.map((lineItem) => (
                  <li key={lineItem.product.sku} className="flex py-6">
                    <div className="ml-4 flex-1 flex flex-col sm:ml-6">
                      <div>
                        <div className="flex justify-between">
                          <h4 className="text-lg w-7/12">
                            <strong className="font-medium text-gray-700 hover:text-gray-800">
                              {productDetails.get(lineItem.product.sku)?.name}
                            </strong>
                            <p className="mt-1 flex text-sm text-gray-500">
                              {productDetails.get(lineItem.product.sku)?.colour}
                              &nbsp; -- &nbsp;
                              {productDetails.get(lineItem.product.sku)
                                ?.size !== null
                                ? productDetails.get(lineItem.product.sku)?.size
                                : null}{" "}
                              &nbsp;
                            </p>
                          </h4>
                          <div className="text-lg w-1/12">
                            <p className="mt-1 flex font-medium text-sm text-gray-500">
                              QTY
                            </p>
                            <p className="mt-1 flex font-medium text-sm text-gray-900">
                              {lineItem.qty}
                            </p>
                          </div>
                          <Modify product={lineItem.product} />
                          <h4 className="text-lg w-1/12">
                            <p className="mt-1 flex font-medium text-sm text-gray-500">
                              PRICE
                            </p>
                            {productDetails[lineItem.product.sku]
                              ?.listPrice && (
                              <p className="line-through text-gray-500">
                                $
                                {Number.parseFloat(
                                  productDetails.get(lineItem.product.sku)
                                    ?.listPrice
                                ).toFixed(2)}
                              </p>
                            )}
                            <p className="mt-1 flex font-medium text-sm text-gray-900">
                              $
                              {Number.parseFloat(
                                productDetails.get(lineItem.product.sku)
                                  ?.discountedPrice
                              ).toFixed(2)}
                            </p>
                          </h4>
                          <h4 className="text-lg w-1/12">
                            <p className="mt-1 flex font-medium text-sm text-gray-500">
                              SUBTOTAL
                            </p>
                            <p className="mt-1 flex font-medium text-sm text-gray-900">
                              ${Number.parseFloat(lineItem.subTotal).toFixed(2)}
                            </p>
                          </h4>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {promotions.length > 0 && (
                <p className="mt-1 mb-1 flex font-medium text-sm text-gray-500">
                  Promotions
                </p>
              )}
              <ul className="border-b border-gray-200">
                {promotions.map((lineItem, index) => (
                  <li key={index} className="flex py-6">
                    <div className="ml-4 flex-1 flex flex-col sm:ml-6">
                      <div>
                        <div className="flex justify-between">
                          <h4 className="text-lg w-7/12">
                            <strong className="font-medium text-gray-700 hover:text-gray-800">
                              {lineItem.promotion.fieldValue}
                            </strong>
                          </h4>
                          <div className="text-lg w-1/12">
                            <p className="mt-1 flex font-medium text-sm text-gray-500">
                              QTY
                            </p>
                            <p className="mt-1 flex font-medium text-sm text-gray-900">
                              {lineItem.qty}
                            </p>
                          </div>
                          <p className="text-lg w-1/12"></p>
                          <h4 className="text-lg w-1/12">
                            <p className="mt-1 flex font-medium text-sm text-gray-500">
                              PRICE
                            </p>
                            <p className="mt-1 flex font-medium text-sm text-gray-900">
                              -$
                              {Number.parseFloat(-lineItem.subTotal).toFixed(2)}
                            </p>
                          </h4>
                          <h4 className="text-lg w-1/12">
                            <p className="mt-1 flex font-medium text-sm text-gray-500">
                              SUBTOTAL
                            </p>
                            <p className="mt-1 flex font-medium text-sm text-gray-900">
                              -$
                              {Number.parseFloat(-lineItem.subTotal).toFixed(2)}
                            </p>
                          </h4>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Order summary */}
            <section aria-labelledby="summary-heading" className="mt-10">
              <h2 id="summary-heading" className="sr-only">
                Order summary
              </h2>

              <div>
                <dl className="space-y-8 flex flex-row-reverse">
                  <div className="flex items-right justify-between">
                    <dd className="ml-4 text-xl font-medium text-red-800">
                      Total Amount: &emsp;$
                      {Number.parseFloat(amount).toFixed(2)}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>
          </div>
        </form>

        {/* Buttons */}
        <section>
          <div className="mt-10 flex flex-row-reverse space-x-4 space-x-reverse">
            <button
              type="button"
              disabled={amount === 0}
              onClick={openModal}
              className="mt-3 bg-cyan-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyan-50 focus:ring-cyan-500"
            >
              Payment
            </button>
            <button
              type="button"
              className="mt-3 bg-red-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-500"
              onClick={openSureModal}
            >
              Clear All
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export const PosPurchaseOrder = () => {
  const [modalState, setModalState] = useState(false);
  const [sureModalState, setSureModalState] = useState(false);
  const [rfid, setRfid] = useState("");
  const [searchProducts, setSearchProducts] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [productDetails, setProductDetails] = useState(new Map());
  const [amount, setAmount] = useState(0);
  const [order, setOrder] = useState({});
  const siteId = localStorage?.getItem("siteId");
  const { addToast } = useToasts();

  const openModal = () => {
    setModalState(true);
    setOrder({
      totalAmount: amount,
      lineItems: lineItems,
      promotions: promotions,
      payments: [],
      paid: false,
      refundedLIs: [],
      exchangedLIs: [],
      site: {
        id: siteId,
      },
    });
  };
  const closeModal = () => setModalState(false);
  const openSureModal = () => setSureModalState(true);
  const closeSureModal = () => setSureModalState(false);
  const onRfidChanged = (e) => {
    e.preventDefault();
    if (
      e.target.value.length - rfid.length > 10 &&
      e.target.value.includes("-")
    ) {
      addProduct(e.target.value);
    } else {
      setRfid(e.target.value);
      e.target.value && findSku(e.target.value);
    }
  };

  const findSku = async (sku) => {
    const { data } = await posApi.searchSku(sku);
    setSearchProducts(
      data.map((prod, index) => {
        return {
          id: index,
          name: prod.sku,
          fields: prod.productFields
            .map((x) => x.fieldValue)
            .sort((x, y) => x.length - y.length),
        };
      })
    );
  };

  const addProduct = async (rfid) => {
    try {
      const response = await posApi.addProductToLineItems(rfid, lineItems);
      setLineItems(response.data);
      if (!productDetails.has(rfid)) {
        const detail = await api.get("store/productDetails", rfid);
        setProductDetails(productDetails.set(rfid, detail.data));
      }
      setAmount(response.data.map((x) => x.subTotal).reduce((x, y) => x + y));
      setRfid("");
    } catch (err) {
      addToast(`Error: ${err.response.data}`, {
        appearance: "error",
        autoDismiss: true,
      });
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

  const addRfidClicked = (e, _rfid = null) => {
    e.preventDefault();
    _rfid ? addProduct(_rfid) : addProduct(rfid);
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
            <PlusSmIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </p>
        <p>
          <button
            type="button"
            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={() => removeProduct(product.sku)}
          >
            <MinusSmIcon className="h-5 w-5" aria-hidden="true" />
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
        openSureModal={openSureModal}
        searchProducts={searchProducts}
      />
      <CheckoutForm
        open={modalState}
        closeModal={closeModal}
        clear={clear}
        amount={amount}
        order={order}
        checkoutItems={order?.lineItems}
      />
      <SimpleModal open={sureModalState} closeModal={closeSureModal}>
        <div className="inline-block align-middle bg-white rounded-lg px-4 pt-4 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:p-6">
          <div className="flex justify-between">
            <div className="my-6 flex-shrink-0">
              <ExclamationIcon
                className="h-12 w-12 text-yellow-400"
                aria-hidden="true"
              />
            </div>
            <Dialog.Title
              as="h3"
              className="my-6 text-center text-lg leading-6 font-medium text-gray-900"
            >
              <h3 className="text-md font-medium text-black-800">
                Are you sure you want to clear all items?
              </h3>
            </Dialog.Title>
            <button
              type="button"
              className="relative h-full inline-flex items-center space-x-2 px-2 py-2 text-sm font-medium rounded-full text-gray-700"
              onClick={closeSureModal}
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              onClick={closeSureModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              onClick={() => {
                clear();
                closeSureModal();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </SimpleModal>
    </>
  );
};
