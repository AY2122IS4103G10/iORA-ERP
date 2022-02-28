import {Link} from "react-router-dom";
import {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {getProductItem, getProductDetails} from "../../../../stores/slices/productSlice";
import {XCircleIcon} from "@heroicons/react/solid";

const OrderList = ({products, amount, rfid, onRfidChanged, addRFIDClicked, Remove, error}) => (
  <main>
    <div className="max-w-4xl mx-auto py-2 px-4 sm:py-2 sm:px-4 lg:px-0">
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

            <ul role="list" className="border-t border-b border-gray-200">
              {products.map((product) => (
                <li key={product.name} className="flex py-6">
                  <div className="ml-4 flex-1 flex flex-col sm:ml-6">
                    <div>
                      <div className="flex justify-between">
                        <h4 className="text-lg">
                          <a className="font-medium text-gray-700 hover:text-gray-800">
                            {product.name}
                          </a>
                        </h4>
                        {"discountedPrice" in product ? (
                          <div>
                            <p className="line-through text-gray-500">${product.price}</p>$
                            {product.discountedPrice}
                          </div>
                        ) : (
                          <p className="ml-4 text-sm font-medium text-gray-900">${product.price}</p>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Colour: {product.colour}</p>
                      <p className="mt-1 text-sm text-gray-500">Size: {product.size}</p>
                      {product.promotion !== null && (
                        <p className="mt-1 text-sm text-gray-500">Promotion: {product.promotion}</p>
                      )}
                    </div>
                    <Remove product={product} />
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
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dd className="ml-4 text-2xl font-bold font-medium text-red-800">
                    Total Amount: ${amount}
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
            className="w-2/12 mt-3 bg-zinc-800 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-zinc-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
            {localStorage.getItem("customer") === null ? (
              <>Payment</>
            ) : (
              <>
                Checkout as {JSON.parse(localStorage.customer).firstName}{" "}
                {JSON.parse(localStorage.customer).lastName}
              </>
            )}
          </button>
          <button
            type="button"
            className="w-2/12 mt-3 bg-zinc-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-zinc-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
            onClick={() => {
              if (window.confirm("Are you sure to clear ALL items?")) {
                localStorage.clear();
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
  const [modalState, setModalState] = useState(false);
  const openModal = () => setModalState(true);
  const closeModal = () => setModalState(false);
  const [productItems, setProductItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [amount, setAmount] = useState(0);
  const [rfid, setRfid] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const onRfidChanged = (e) => setRfid(e.target.value);

  const addProduct = (rfid) => {
    dispatch(getProductDetails(rfid))
      .unwrap()
      .then((data) => {
        products.push(data);
        setProducts(products);
        "discountedPrice" in data
          ? setAmount(amount + data.discountedPrice)
          : setAmount(amount + data.price);
        setError(false);
      });
  };

  const addRFIDClicked = (evt) => {
    evt.preventDefault();
    dispatch(getProductItem(rfid))
      .unwrap()
      .then((data) => {
        productItems.push(data);
        setProductItems(productItems);
        addProduct(rfid);
      })
      .catch((err) => setError(true));
    setRfid("");
  };

  function Remove(props) {
    const product = props.product;

    const removeProduct = (product) => {
      const index = products.indexOf(product);
      products.splice(index, 1);
      setProducts(products);
      "discountedPrice" in product
        ? setAmount(amount - product.discountedPrice)
        : setAmount(amount - product.price);
    };

    return (
      <div className="">
        <button
          type="button"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          onClick={() => removeProduct(product)}>
          <span>Remove</span>
        </button>
      </div>
    );
  }
  return (
    <OrderList
      products={products}
      amount={amount}
      rfid={rfid}
      onRfidChanged={onRfidChanged}
      addRFIDClicked={addRFIDClicked}
      Remove={Remove}
      error={error}
    />
  );
};
