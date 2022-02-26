import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getProductItem, getAProduct, selectProductItem, selectAProduct, addNewProduct, getProductDetails } from "../../../../stores/slices/productSlice";

const OrderList = ({
    products,
    amount,
    rfid,
    onRfidChanged,
    addRFIDClicked
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

                    <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
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
                                            {product.discountedPrice === null ?
                                                <p className="ml-4 text-sm font-medium text-gray-900">${product.price}</p>
                                                :
                                                <div>
                                                    <p className="ml-4 text-sm font-medium text-gray-900 text-decoration-line: line-through;" class="line-through" >${product.price}</p>
                                                    ${product.discountedPrice}
                                                </div>
                                            }
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">{product.colour}</p>
                                        <p className="mt-1 text-sm text-gray-500">{product.size}</p>
                                        {product.promotion !== null && <p className="mt-1 text-sm text-gray-500">{product.promotion}</p>}
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
                        <dl className="space-y-4">
                            <div className="flex items-center justify-between">
                                <dt className="text-base font-medium text-gray-900">Total Amount</dt>
                                <dd className="ml-4 text-base font-medium text-gray-900">${amount}</dd>
                            </div>
                        </dl>
                        <p className="mt-1 text-sm text-gray-500">Some instructional text here.</p>
                    </div>

                    <div className="mt-10">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                        >
                            Checkout
                        </button>
                        <Link to={`/ss`}>
                            <button
                                type="button"
                                className="w-full mt-3 bg-red-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                        </Link>
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

            <form>
                <div>
                    <label htmlFor="rfid" className="block mt-20 text-sm font-medium text-gray-700">
                        RFID
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="rfid"
                            id="rfid"
                            autoComplete="rfid"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="10-0001234-0XXXXX-0000XXXXX"
                            value={rfid}
                            onChange={onRfidChanged}
                            required
                            aria-describedby="rfid"
                        />
                        <button
                            type="submit"
                            className="inline-flex justify-end mt-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={addRFIDClicked}
                        >
                            Add product
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </main>
);

export function Order() {
    const [productItems, setProductItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [amount, setAmount] = useState(0);
    const [rfid, setRfid] = useState("");

    const dispatch = useDispatch();

    const onRfidChanged = (e) => setRfid(e.target.value);

    const addProduct = (rfid) => {
        dispatch(getProductDetails(rfid))
            .unwrap()
            .then((data) => {
                products.push(data);
                setProducts([...products]);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    // const removeProduct = (product) => {
    //     const index = products.indexOf(product)
    //     products.splice(index, 1)
    //     setProducts(products)
    // }

    const addRFIDClicked = (evt) => {
        evt.preventDefault();
        dispatch(getProductItem(rfid))
            .unwrap()
            .then((data) => {
                productItems.push(data);
                setProductItems(productItems);
                addProduct(rfid);
            })
            .catch((err) => {
                console.error(err);
            });
        console.log(productItems)
        console.log(products)
        setRfid("");
    }

    return (
        <OrderList
            products={products}
            amount={amount}
            rfid={rfid}
            onRfidChanged={onRfidChanged}
            addRFIDClicked={addRFIDClicked} />
    )
}