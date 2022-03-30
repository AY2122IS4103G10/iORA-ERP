import { useState, useEffect } from "react"
import { useSelector } from "react-redux";
import { listingApi, purchasesApi } from "../../../../environments/Api"

import moment from "moment";
import { useParams } from "react-router-dom";
import { fetchPurchase, selectPurchase } from "../../../../stores/slices/purchasesSlice";
import { useDispatch } from "react-redux";


function calculateSubTotal(lineItems) {
    let subTotal = 0;
    subTotal = lineItems.map((item) => item.subTotal).reduce((a, b) => a + b);
    return subTotal;
}


export const CheckoutSuccessful = () => {
    const dispatch = useDispatch();

    const { id } = useParams();
    const [models, setModels] = useState(null);
    const confirmedOrder = useSelector(selectPurchase);

    useEffect(() => {
        if (confirmedOrder === null || confirmedOrder === undefined) {
            dispatch(fetchPurchase(id));
        }
        if (confirmedOrder !== null) {
            let skuList = confirmedOrder.lineItems.map((item) => item.product.sku);
            listingApi.getModelsBySKUList(skuList)
                .then((response) => {
                    setModels(response.data);
                })
        }
    }, [confirmedOrder])

    console.log(confirmedOrder);

    return (
        <main className="bg-white px-4 pt-16 pb-24 sm:px-6 sm:pt-18 lg:px-8">
           { confirmedOrder !== null ? 
           <div className="max-w-3xl mx-auto">
                <div className="max-w-2xl">
                    <h1 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Thank you!</h1>
                    <p className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Your order has been placed!</p>
                    <p className="mt-2 text-base text-gray-800">
                        Your order {' '}
                        <span className="text-lg text-black font-bold">#{confirmedOrder?.id}</span>
                        {' '} has placed and will be with you soon.</p>

                    <dl className="mt-12 text-sm font-medium">
                        <dt className="text-gray-900">Tracking number</dt>
                        <dd className="text-gray-600 mt-2">#######</dd>
                    </dl>
                </div>

                <section aria-labelledby="order-heading" className="mt-10 border-t border-gray-200">
                    <h2 id="order-heading" className="sr-only">
                        Your order
                    </h2>

                    <h3 className="sr-only">Items</h3>
                    {confirmedOrder?.lineItems.map((item, id) => (
                        <div key={id} className="py-10 border-b border-gray-200 flex space-x-6">
                            {models !== null ?
                                <>
                                    <img
                                        src={models[id].imageLinks[0]}
                                        className="flex-none w-20 h-20 object-center object-cover bg-gray-100 rounded-lg sm:w-40 sm:h-40"
                                    />

                                    <div className="flex-auto flex flex-col">
                                        <div>

                                            <h4 className="font-medium text-gray-900">
                                                <a href={item.product.sku}>{models[id].name}</a>
                                            </h4>
                                            <p className="mt-2 text-sm text-gray-600">{models[id].description}</p>
                                            <span className="mt-2 text-sm text-gray-600">
                                                Colour: {item.product.productFields.find((field) => field.fieldName === "COLOUR").fieldValue}
                                            </span>
                                            <span className="mt-2 text-sm text-gray-600">
                                                {' | '}Size:  {item.product.productFields.find((field) => field.fieldName === "SIZE").fieldValue}
                                            </span>
                                        </div>
                                        <div className="mt-6 flex-1 flex items-end">
                                            <dl className="flex text-sm divide-x divide-gray-200 space-x-4 sm:space-x-6">
                                                <div className="flex">
                                                    <dt className="font-medium text-gray-900">Quantity</dt>
                                                    <dd className="ml-2 text-gray-700">{item.qty}</dd>
                                                </div>
                                                <div className="pl-4 flex sm:pl-6">
                                                    <dt className="font-medium text-gray-900">Price</dt>
                                                    <dd className="ml-2 text-gray-700">{models !== null ? models[id].listPrice : "-"}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </>
                                : null}
                        </div>

                    ))}

                    <div className="sm:ml-40 sm:pl-6">
                        <h3 className="sr-only">Your information</h3>

                        <h4 className="sr-only">Addresses</h4>
                        <dl className="grid grid-cols-2 gap-x-6 text-sm py-10">
                            <div>
                                <dt className="font-medium text-gray-900">Shipping address</dt>
                                <dd className="mt-2 text-gray-700">
                                    <address className="not-italic">
                                        <span className="block">Name</span>
                                        <span className="block">{confirmedOrder?.deliveryAddress?.street1}</span>
                                        <span className="block">{confirmedOrder?.country}, {confirmedOrder.deliveryAddress.zip}</span>
                                    </address>
                                </dd>
                            </div>
                            <div>
                                <dt className="font-medium text-gray-900">Billing address</dt>
                                <dd className="mt-2 text-gray-700">
                                    <address className="not-italic">
                                        <span className="block">Name</span>
                                        <span className="block">{confirmedOrder?.deliveryAddress?.street1}</span>
                                        <span className="block">{confirmedOrder?.country}, {confirmedOrder.deliveryAddress.zip}</span>
                                    </address>
                                </dd>
                            </div>
                        </dl>

                        <h4 className="sr-only">Payment</h4>
                        <dl className="grid grid-cols-2 gap-x-6 border-t border-gray-200 text-sm py-10">
                            <div>
                                <dt className="font-medium text-gray-900">Payment method</dt>
                                {confirmedOrder.payments.map((payment) => (
                                    <dd key={payment.id} className="mt-2 text-gray-700">
                                        <p>{payment.paymentType}</p>
                                        <p>
                                            {moment(payment.dateTime).format("DD/MM, H:mm")}
                                        </p>
                                    </dd>))}
                            </div>
                            <div>
                                <dt className="font-medium text-gray-900">Delivery method</dt>
                                <dd className="mt-2 text-gray-700">
                                    <p>{confirmedOrder.delivery === true ? "Doorstep Delivery" : "Store Pickup"}</p>
                                    <p>
                                        {confirmedOrder.delivery === true ? "Takes up to 7 working days" : confirmedOrder.pickupSite?.name}
                                    </p>
                                </dd>
                            </div>
                        </dl>

                        <h3 className="sr-only">Summary</h3>

                        <dl className="space-y-6 border-t border-gray-200 text-sm pt-10">
                            <div className="flex justify-between">
                                <dt className="font-medium text-gray-900">Subtotal</dt>
                                <dd className="text-gray-700">${calculateSubTotal(confirmedOrder.lineItems)}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="flex font-medium text-gray-900">
                                    Discount
                                    {/* <span className="rounded-full bg-gray-200 text-xs text-gray-600 py-0.5 px-2 ml-2">STUDENT50</span> */}
                                </dt>
                                <dd className="text-gray-700">{confirmedOrder.promotions === null ? "-$0" : "yes"}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="font-medium text-gray-900">Shipping</dt>
                                <dd className="text-gray-700">{confirmedOrder.delivery === true ? "$2.50" : "$0"}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-base font-bold text-gray-900">Total</dt>
                                <dd className="text-base text-gray-900 font-bold">${confirmedOrder.totalAmount}</dd>
                            </div>
                        </dl>
                    </div>
                </section>
            </div>
            : <p>loading</p>}
        </main>)
}