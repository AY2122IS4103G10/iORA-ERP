import { useState } from "react";
import { getProductItem } from "../../../../stores/slices/productSlice";

export function Order() {
    const [products, setProducts] = useState([]);
    const [amount, setAmount] = useState(0);

    const addProduct = (product) => {
        products.push(product)
        setProducts(products)
    }

    const removeProduct = (product) => {
        const index = products.indexOf(product)
        products.splice(index, 1)
        setProducts(products)
    }

    return (
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
                                <li key={product.id} className="flex py-6">

                                    <div className="ml-4 flex-1 flex flex-col sm:ml-6">
                                        <div>
                                            <div className="flex justify-between">
                                                <h4 className="text-sm">
                                                    <a href={product.href} className="font-medium text-gray-700 hover:text-gray-800">
                                                        {product.name}
                                                    </a>
                                                </h4>
                                                <p className="ml-4 text-sm font-medium text-gray-900">{product.price}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                                            <p className="mt-1 text-sm text-gray-500">{product.size}</p>
                                        </div>

                                        <div className="mt-4 flex-1 flex items-end justify-between">
                                            <div className="ml-4">
                                                <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                                    <span>Remove</span>
                                                </button>
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
                        </div>

                        <div className="mt-6 text-sm text-center text-gray-500">
                            <p>
                                or{' '}
                                <a href="#" className="text-indigo-600 font-medium hover:text-indigo-500">
                                    Continue Shopping<span aria-hidden="true"> &rarr;</span>
                                </a>
                            </p>
                        </div>
                        <div>
                            <label htmlFor="rfid" className="block text-sm font-medium text-gray-700">
                                RFID
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="rfid"
                                    id="rfid"
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    placeholder="10-0001234-0XXXXX-0000XXXXX"
                                />
                                <button
                                    type="button"
                                    className="inline-flex justify-end mt-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Add product
                                </button>
                            </div>
                        </div>
                    </section>
                </form>
            </div>
        </main>
    )
}