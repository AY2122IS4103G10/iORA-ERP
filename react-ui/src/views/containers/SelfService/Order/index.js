import { useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProductItem, getProductDetails } from "../../../../stores/slices/productSlice";
import { XCircleIcon } from '@heroicons/react/solid'
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon, XIcon } from "@heroicons/react/outline";

const OrderList = ({
    products,
    amount,
    rfid,
    onRfidChanged,
    addRFIDClicked,
    Remove,
    openModal,
    error
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
                        {products.map((product) => (
                            <li key={product.name} className="flex py-6">
                                <div className="ml-4 flex-1 flex flex-col sm:ml-6">
                                    <div>
                                        <div className="flex justify-between">
                                            <h4 className="text-lg">
                                                <strong className="font-medium text-gray-700 hover:text-gray-800">
                                                    {product.name}
                                                </strong>
                                            </h4>
                                            {console.log(product)}
                                            {'discountedPrice' in product ?
                                                <div>
                                                    <p className="line-through text-gray-500" >${product.price}</p>
                                                    ${product.discountedPrice}
                                                </div>
                                                :
                                                <p className="ml-4 text-sm font-medium text-gray-900">${product.price}</p>
                                            }
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">Colour: {product.colour}</p>
                                        <p className="mt-1 text-sm text-gray-500">Size: {product.size}</p>
                                        {product.promotion !== null && <p className="mt-1 text-sm text-gray-500">Promotion: {product.promotion}</p>}
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
                                <dt className="text-2xl font-bold text-gray-900">Total Amount</dt>
                                <dd className="ml-4 text-2xl font-bold font-medium text-gray-900">${amount}</dd>
                            </div>
                        </dl>
                        <p className="mt-1 text-sm text-gray-500">Please proceed to our friendly staff for assistance if there is an issue with your order.</p>
                    </div>

                    <div className="mt-10">
                        <button
                            type="button"
                            className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                        >
                            {localStorage.getItem("customer") === null ?
                                <>Checkout as Guest</> :
                                <>Checkout as {JSON.parse(localStorage.customer).firstName} {JSON.parse(localStorage.customer).lastName}</>}
                        </button>
                        <button
                            type="button"
                            className="w-full mt-3 bg-red-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                            onClick={() => openModal()}
                        >
                            Cancel
                        </button>
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
                        {error &&
                            <div className="mt-3 bg-red-50 border-l-4 border-red-400 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-800">
                                            Product not found.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        }
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
    const [productItems, setProductItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [amount, setAmount] = useState(0);
    const [rfid, setRfid] = useState("");
    const [error, setError] = useState(false);
    const [open, setOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onRfidChanged = (e) => setRfid(e.target.value);
    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    const addProduct = (rfid) => {
        dispatch(getProductDetails(rfid))
            .unwrap()
            .then((data) => {
                products.push(data);
                setProducts(products);
                'discountedPrice' in data ? setAmount(amount + data.discountedPrice) : setAmount(amount + data.price);
                setError(false)
            });
    }

    const onCancel = () => {
        localStorage.clear();
        navigate("/ss");
    }

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
    }

    function Remove(props) {
        const product = props.product;

        const removeProduct = (product) => {
            const index = products.indexOf(product);
            products.splice(index, 1);
            setProducts(products);
            'discountedPrice' in product ? setAmount(amount - product.discountedPrice) : setAmount(amount - product.price);
        }

        return (
            <div className="">
                <button type="button"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    onClick={() => removeProduct(product)}>
                    <span>Remove</span>
                </button>
            </div>
        )
    }

    return (
        <>
            <ConfirmCancel
                open={open}
                closeModal={closeModal}
                onCancel={onCancel}
            />
            <OrderList
                products={products}
                amount={amount}
                rfid={rfid}
                onRfidChanged={onRfidChanged}
                addRFIDClicked={addRFIDClicked}
                Remove={Remove}
                openModal={openModal}
                error={error}
            />
        </>
    )
}