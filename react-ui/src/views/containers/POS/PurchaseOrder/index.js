import {XCircleIcon} from "@heroicons/react/solid";
import {useState} from "react";
import {Fragment} from "react";
import {useEffect} from "react";
import {updateCurrSite} from "../../../../stores/slices/userSlice";
import {useDispatch} from "react-redux";
import {Dialog, Transition} from "@headlessui/react";
import {getProductDetails, getProductItem} from "../../../../stores/slices/productSlice";
import {useToasts} from "react-toast-notifications";
import {produceWithPatches} from "immer";

export const SimpleModal = ({open, closeModal, children}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={closeModal}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"></Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const OrderList = ({
  products,
  amount,
  rfid,
  onRfidChanged,
  addRFIDClicked,
  Remove,
  error,
  clear,
  openModal,
  closeModal,
  qty,
}) => (
  <main>
    <div className="max-w-5xl mx-auto py-2 px-4 sm:py-2 sm:px-4 lg:px-0">
      <form>
        <div>
          <label htmlFor="rfid" className="block mt-8 text-base font-medium text-gray-700">
            RFID
          </label>
          <div className="mt-1 flex space-x-2">
            <input
              type="text"
              name="rfid"
              id="rfid"
              autoComplete="rfid"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-10/12 sm:text-sm border-gray-300 rounded-md"
              placeholder="10-0001234-0XXXXX-0000XXXXX"
              value={rfid}
              onChange={onRfidChanged}
              required
              aria-describedby="rfid"
            />
            <button
              type="submit"
              className="w-2/12 flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-sm rounded-md text-white bg-slate-600 hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={addRFIDClicked}>
              Add product
            </button>
          </div>
          {error && (
            <div className="mt-3 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">Product not found.</p>
                </div>
              </div>
            </div>
          )}
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
              {products.map((product, index) => (
                <li key={product.name} className="flex py-6">
                  <div className="ml-4 flex-1 flex flex-col sm:ml-6">
                    <div>
                      <div className="flex justify-between">
                        <h4 className="text-lg w-9/12">
                          <strong className="font-medium text-gray-700 hover:text-gray-800">
                            {product.name}
                          </strong>
                          <p className="mt-1 flex text-sm text-gray-500">
                            {product.colour}&nbsp; -- &nbsp;
                            {product.size !== null ? product.size : null} &nbsp; -- &nbsp;
                            {product.promotion !== null ? product.promotion : null}
                          </p>
                        </h4>
                        <h4 className="text-lg w-1/12 ">
                          <p className="mt-1 flex font-medium text-sm text-gray-500">QTY</p>
                          <p className="mt-1 flex font-medium text-sm text-gray-500">
                            {qty[index]}
                          </p>
                        </h4>
                        {"discountedPrice" in product ? (
                          <div>
                            <p className="line-through text-gray-500">
                              ${Number.parseFloat(product.price).toFixed(2)}
                            </p>
                            ${Number.parseFloat(product.discountedPrice).toFixed(2)}
                          </div>
                        ) : (
                          <p className="ml-4 text-sm font-medium text-gray-900">
                            ${Number.parseFloat(product.price).toFixed(2)}
                          </p>
                        )}
                        <Remove product={product} />
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
                  <dd className="ml-4 text-xl font-bold font-medium text-red-800">
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
            onClick={openModal}
            className="w-2/12 mt-3 bg-zinc-800 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-zinc-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
            Payment
          </button>
          <button
            type="button"
            className="w-2/12 mt-3 bg-zinc-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-zinc-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
            onClick={() => {
              if (window.confirm("Are you sure to clear ALL items?")) {
                clear();
              }
            }}>
            Clear All Items
          </button>
        </div>
      </section>
    </div>
  </main>
);

export const PosPurchaseOrder = () => {
  const dispatch = useDispatch();
  const [modalState, setModalState] = useState(false);
  const openModal = () => setModalState(true);
  const closeModal = () => setModalState(false);
  const [sku, setSku] = useState([]);
  const [products, setProducts] = useState([]);
  const [rfidList, setRfidList] = useState([]);
  const [qty, setQty] = useState([]);
  const [amount, setAmount] = useState(0);
  const [rfid, setRfid] = useState("");
  const [error, setError] = useState(false);
  const {addToast} = useToasts();

  const onRfidChanged = (e) => setRfid(e.target.value);

  const addProduct = (rfid) => {
    dispatch(getProductDetails(rfid))
      .unwrap()
      .then((data) => {
        console.log(data);
        products.push(data);
        setProducts(products);
        "discountedPrice" in data
          ? setAmount(amount + data.discountedPrice)
          : setAmount(amount + data.price);
      })
      .catch((err) => {
        addToast(`Error: ${err.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  const updateIncrAmount = (rfid, i) => {
    dispatch(getProductDetails(rfid))
      .unwrap()
      .then((data) => {
        let newQty = [...qty];
        newQty[i] = qty[i] + 1;
        setQty(newQty);
        "discountedPrice" in data
          ? setAmount(amount + data.discountedPrice)
          : setAmount(amount + data.price);
      })
      .catch((err) => {
        addToast(`Error: ${err.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  const addRFIDClicked = (evt) => {
    evt.preventDefault();
    dispatch(getProductItem(rfid))
      .unwrap()
      .then((data) => {
        if (rfidList.includes(rfid) === false) {
          rfidList.push(rfid);
          setRfidList(rfidList);
          let currentSKU = data.productSKU;

          if (sku.includes(currentSKU) === true) {
            let i = sku.indexOf(currentSKU);
            updateIncrAmount(rfid, i);
          } else {
            sku.push(currentSKU);
            setSku(sku);
            qty.push(1);
            setQty(qty);
            addProduct(rfid, sku.indexOf(currentSKU));
          }
        } else {
          throw new Error("Error: Duplicate RFID");
        }
      })
      .catch((err) => {
        addToast(`Error: ${err.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
    setRfid("");
  };

  const decrTotalAmount = (rfid) => {
    dispatch(getProductDetails(rfid))
      .unwrap()
      .then((data) => {
        "discountedPrice" in data
          ? setAmount(amount - data.discountedPrice)
          : setAmount(amount - data.price);
      })
      .catch((err) => {
        addToast(`Error: ${err.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  function Remove(props) {
    const product = props.product;

    const removeProduct = (product) => {
      const index = products.indexOf(product);
      let i = qty.reduce((total, num) => total + num, 0);
      let removeRFID = rfidList[i - 1];
      decrTotalAmount(removeRFID);
      rfidList.splice(i - 1, 1);
      setRfidList(rfidList);

      if (qty[index] === 1) {
        sku.splice(index, 1);
        setSku(sku);
        qty.splice(index, 1);
        setQty(qty);
        products.splice(index, 1);
        setProducts(products);
      } else {
        let newQty = [...qty];
        newQty[index] = qty[index] - 1;
        setQty(newQty);
      }
      "discountedPrice" in product
        ? setAmount(amount - product.discountedPrice)
        : setAmount(amount - product.price);
    };

    return (
      <div className="">
        <button
          type="button"
          className="text-sm font-medium text-indigo-600 hover:text-red-500"
          onClick={() => removeProduct(product)}>
          <span>Remove</span>
        </button>
      </div>
    );
  }

  const clear = () => {
    setProducts([]);
    setSku([]);
    setRfidList([]);
    setQty([]);
    setAmount(0);
  };

  return (
    <div>
      <OrderList
        products={products}
        amount={amount}
        rfid={rfid}
        onRfidChanged={onRfidChanged}
        addRFIDClicked={addRFIDClicked}
        Remove={Remove}
        error={error}
        clear={clear}
        openModal={openModal}
        closeModal={closeModal}
        qty={qty}
      />
    </div>
  );
};
