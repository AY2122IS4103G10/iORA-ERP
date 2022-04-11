import { Combobox, Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import {
  CheckIcon,
  ExclamationIcon,
  MinusSmIcon,
  PlusSmIcon,
  SelectorIcon
} from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { api, posApi } from "../../../../environments/Api";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import { CheckoutForm } from "../CheckoutForm";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

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
  return (
    <main>
      <div className="max-w-6xl mx-auto py-2 px-4 sm:py-2 sm:px-6">
        <form>
          <Combobox as="div" value={rfid} onChange={onRfidChanged}>
            <Combobox.Label className="block mt-8 text-sm font-medium text-gray-700">
              SKU Code or RFID
            </Combobox.Label>
            <div className="flex relative mt-1">
              <Combobox.Input
                className="w-10/12 rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm"
                onChange={onRfidChanged}
              />
              <Combobox.Button className="relative inset-y-0 right-0 flex items-center rounded-r-md -ml-10 px-2 focus:outline-none">
                <SelectorIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>

              {searchProducts.length > 0 && (
                <Combobox.Options className="absolute z-10 mt-10 max-h-96 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {searchProducts.map((prod, index) => (
                    <Combobox.Option
                      key={index}
                      value={prod.name}
                      className={({ active }) =>
                        classNames(
                          "relative cursor-default select-none py-2 pl-3 pr-6",
                          active ? "bg-cyan-600 text-white" : "text-gray-900"
                        )
                      }
                    >
                      {({ active, selected }) => (
                        <>
                          <div className="flex">
                            <span
                              className={classNames(
                                "flex w-2/12 text-sm truncate",
                                selected && "font-semibold"
                              )}
                            >
                              {prod.name}
                            </span>
                            <span
                              className={classNames(
                                "flex w-2/12 truncate text-gray-500",
                                active ? "text-cyan-200" : "text-gray-500"
                              )}
                            >
                              COLOUR: {prod.fields[1]}
                            </span>
                            <span
                              className={classNames(
                                "flex w-2/12 truncate text-gray-500",
                                active ? "text-cyan-200" : "text-gray-500"
                              )}
                            >
                              SIZE: {prod.fields[0]}
                            </span>
                          </div>

                          {selected && (
                            <span
                              className={classNames(
                                "absolute inset-y-0 right-0 flex items-center pr-4",
                                active ? "text-white" : "text-cyan-600"
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
              <button
                type="submit"
                className="w-2/12 flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-sm rounded-md text-white bg-cyan-600 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                onClick={addRfidClicked}
              >
                Add product
              </button>
            </div>
          </Combobox>
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
                          <div className="text-lg w-7/12">
                            <h4 className="font-medium text-gray-700 hover:text-gray-800">
                              {productDetails.get(lineItem.product.sku)?.name}
                            </h4>
                            <p className="flex text-sm text-gray-500">
                              COLOUR:{" "}
                              {productDetails.get(lineItem.product.sku)?.colour}
                            </p>
                            <p className="flex text-sm text-gray-500">
                              SIZE:{" "}
                              {productDetails.get(lineItem.product.sku)
                                ?.size !== null
                                ? productDetails.get(lineItem.product.sku)?.size
                                : null}
                            </p>
                          </div>
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
    const newRfid = e?.target ? e.target.value : e;
    if (e?.target) e.preventDefault();
    if (newRfid.length - rfid.length > 7 && newRfid.includes("-")) {
      addProduct(newRfid);
      if (e?.currentTarget) e.currentTarget.blur();
      return;
    }
    setRfid(newRfid);
    findSku(newRfid);
  };

  const findSku = async (sku) => {
    if (!sku) return setSearchProducts([]);
    const { data } = await posApi.searchSku(sku);
    setSearchProducts(
      data.slice(0, 10).map((prod, index) => {
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
