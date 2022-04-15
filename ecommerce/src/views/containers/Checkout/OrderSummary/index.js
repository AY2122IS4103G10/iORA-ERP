// import { Fragment } from "react"
// import { Popover, Transition } from '@headlessui/react'
// import { ChevronUpIcon } from '@heroicons/react/solid'

export const OrderSummary = ({ cart, subTotal, afterDiscount, promotions, selectedDeliveryMethod, voucherItem }) => {
    return (
        <>
            <h1 className="sr-only">Order information</h1>
            <section
                aria-labelledby="summary-heading"
                className="bg-gray-50 mt-7 pt-10 pb-10 sm:px-6 lg:px-10 lg:pb-16 lg:row-start-1 lg:col-start-2"
            >
                <div className="max-w-lg mx-auto lg:max-w-none">
                    <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
                        Order summary
                    </h2>

                    <ul className="text-sm font-medium text-gray-900 divide-y divide-gray-200">
                        {cart.map((item, id) => (
                            <li key={id} className="flex items-start py-6 space-x-4">
                                <div className="flex-auto space-y-1">
                                    <h3>{item.model.name} x {item.qty}</h3>
                                    <p className="text-gray-500">
                                        Colour: {item.product?.productFields.find((field) => field.fieldName === "COLOUR").fieldValue}
                                    </p>
                                    <p className="text-gray-500">
                                        Size: {item.product?.productFields.find((field) => field.fieldName === "SIZE").fieldValue}
                                    </p>
                                </div>
                                <p className="flex-none text-base font-medium">${parseInt(item.model.discountPrice) * item.qty}</p>
                            </li>
                        ))}
                    </ul>

                    <dl className="text-sm font-medium text-gray-900 space-y-6 border-t border-gray-200 py-6 lg:block">
                        <p>
                            Discounts/Promotions
                        </p>
                        {promotions.map((promo) => (
                            <div key={promo.id} className="flex items-center justify-between">
                                <dt className="text-gray-600">{promo.promotion.fieldValue}</dt>
                                <dd>-${Math.abs(promo.subTotal)}</dd>
                            </div>
                        )
                        )}
                    </dl>

                    <dl className="text-sm font-medium text-gray-900 space-y-6 border-t border-gray-200 pt-6 lg:block">
                        <div className="flex items-center justify-between">
                            <dt className="text-gray-600">Subtotal</dt>
                            <dd>${subTotal}</dd>
                        </div>

                       {voucherItem !== null ?
                        <div className="flex items-center justify-between">
                            <dt className="text-gray-600">Voucher</dt>
                            <dd>-${voucherItem?.amount}</dd>
                        </div> : null}

                        <div className="flex items-center justify-between">
                            <dt className="text-gray-600">Discounts/Promotions</dt>
                            <dd>-${subTotal - afterDiscount}</dd>
                        </div>

                        <div className="flex items-center justify-between">
                            <dt className="text-gray-600">Shipping</dt>
                            <dd>{selectedDeliveryMethod.id === 1 ? "$2.50" : "$0.00"}  </dd>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                            <dt className="text-base">Total</dt>
                            <dd className="text-base">${afterDiscount + (selectedDeliveryMethod.id === 1 ? 2.50 : 0.00) - (voucherItem !== null ? voucherItem.amount : 0)}</dd>
                        </div>
                    </dl>
                  
                    {/* <Popover className="fixed bottom-0 inset-x-0 flex flex-col-reverse text-sm font-medium text-gray-900 lg:hidden">
                        <div className="relative z-10 bg-white border-t border-gray-200 px-4 sm:px-6">
                            <div className="max-w-lg mx-auto">
                                <Popover.Button className="w-full flex items-center py-6 font-medium">
                                    <span className="text-base mr-auto">Total</span>
                                    <span className="text-base mr-2">$361.80</span>
                                    <ChevronUpIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
                                </Popover.Button>
                            </div>
                        </div>

                        <Transition.Root as={Fragment}>
                            <div>
                                <Transition.Child
                                    as={Fragment}
                                    enter="transition-opacity ease-linear duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="transition-opacity ease-linear duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Popover.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
                                </Transition.Child>

                                <Transition.Child
                                    as={Fragment}
                                    enter="transition ease-in-out duration-300 transform"
                                    enterFrom="translate-y-full"
                                    enterTo="translate-y-0"
                                    leave="transition ease-in-out duration-300 transform"
                                    leaveFrom="translate-y-0"
                                    leaveTo="translate-y-full"
                                >
                                    <Popover.Panel className="relative bg-white px-4 py-6 sm:px-6">
                                        <dl className="max-w-lg mx-auto space-y-6">
                                            <div className="flex items-center justify-between">
                                                <dt className="text-gray-600">Subtotal</dt>
                                                <dd>subTotal</dd>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <dt className="text-gray-600">Shipping</dt>
                                                <dd>$15.00</dd>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <dt className="text-gray-600">Taxes</dt>
                                                <dd>$26.80</dd>
                                            </div>
                                        </dl>
                                    </Popover.Panel>
                                </Transition.Child>
                            </div>
                        </Transition.Root>
                    </Popover> */}
                </div>
            </section>
        </>
    )
}
