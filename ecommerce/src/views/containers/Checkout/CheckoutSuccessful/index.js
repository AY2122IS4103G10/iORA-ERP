import {PrinterIcon} from "@heroicons/react/outline";
import moment from "moment";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import {useReactToPrint} from "react-to-print";
import {listingApi} from "../../../../environments/Api";
import {fetchPurchase, selectPurchase} from "../../../../stores/slices/purchasesSlice";

function calculateSubTotal(lineItems) {
  let subTotal = 0;
  subTotal = lineItems.map((item) => item.subTotal).reduce((a, b) => a + b);
  return subTotal;
}

function calculateDiscounts(promotions) {
  let totalDiscount = 0;
  totalDiscount = promotions.map((promo) => promo.subTotal).reduce((a, b) => a - b);
  return Math.abs(totalDiscount);
}

export const CheckoutSuccessful = () => {
  const dispatch = useDispatch();
  const {id} = useParams();
  const [models, setModels] = useState(null);
  const confirmedOrder = useSelector(selectPurchase);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    id &&
      dispatch(fetchPurchase(id))
        .unwrap()
        .then((data) => {
          let skuList = data.lineItems.map((item) => item.product.sku);
          console.log(skuList);
          listingApi
            .getModelsBySKUList(skuList)
            .then((response) => {
              setModels(response.data);
            })
            .catch((err) => console.log(err));
        });
    // }
  }, [dispatch, id]);

  console.log(confirmedOrder);

  return (
    <main ref={componentRef} className="bg-white px-4 pt-16 pb-24 sm:px-6 sm:pt-18 lg:px-8">
      {confirmedOrder !== null ? (
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end justify-end mb-4">
            <button
              type="button"
              className="mr-10 inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
              onClick={handlePrint}>
              <PrinterIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
              <span>Print</span>
            </button>
          </div>
          <div className="max-w-2xl">
            <h1 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Thank you!
            </h1>
            <p className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Your order has been placed!
            </p>
            <p className="mt-2 text-base text-gray-800">
              Your order <span className="text-lg text-black font-bold">#{confirmedOrder?.id}</span>{" "}
              has been placed and will be with you soon.
            </p>
          </div>

          <section aria-labelledby="order-heading" className="mt-10 border-t border-gray-200">
            <h2 id="order-heading" className="sr-only">
              Your order
            </h2>

            <h3 className="sr-only">Items</h3>
            {confirmedOrder?.lineItems.map((item, id) => (
              <div key={id} className="py-10 border-b border-gray-200 flex space-x-6">
                {models !== null ? (
                  <>
                    <img
                      src={models[id].imageLinks[0]}
                      className="flex-none w-20 h-20 object-center object-cover bg-gray-100 rounded-lg sm:w-40 sm:h-40"
                    />

                    <div className="flex-auto flex flex-col">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          <Link
                            to={`/products/view/${item.product.sku.substring(
                              0,
                              item.product.sku.indexOf("-")
                            )}`}>
                            {models[id].name}
                          </Link>
                        </h4>
                        <p className="mt-2 text-sm text-gray-600">{models[id].description}</p>
                        <span className="mt-2 text-sm text-gray-600">
                          Colour:{" "}
                          {
                            item.product.productFields.find((field) => field.fieldName === "COLOUR")
                              .fieldValue
                          }
                        </span>
                        <span className="mt-2 text-sm text-gray-600">
                          {" | "}Size:{" "}
                          {
                            item.product.productFields.find((field) => field.fieldName === "SIZE")
                              .fieldValue
                          }
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
                            <dd className="ml-2 text-gray-700">
                              {models !== null ? models[id].listPrice : "-"}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </>
                ) : null}
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
                      <span className="block">
                        {confirmedOrder?.country}, {confirmedOrder.deliveryAddress.zip}
                      </span>
                    </address>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-900">Delivery method</dt>
                  <dd className="mt-2 text-gray-700">
                    <p>{confirmedOrder.delivery === true ? "Doorstep Delivery" : "Store Pickup"}</p>
                    <p>
                      {confirmedOrder.delivery === true
                        ? "Takes up to 7 working days"
                        : confirmedOrder.pickupSite?.name}
                    </p>
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
                      <p>{moment(payment.dateTime).format("DD/MM, H:mm")}</p>
                    </dd>
                  ))}
                </div>
              </dl>

              <h3 className="sr-only">Summary</h3>

              <dl className="space-y-6 border-t border-gray-200 text-sm pt-10">
                <div className="flex justify-between">
                  <dt className="font-medium text-gray-900">Subtotal</dt>
                  <dd className="text-gray-700">${calculateSubTotal(confirmedOrder.lineItems)}</dd>
                </div>

                {confirmedOrder.voucher !== null ? (
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-900">Voucher</dt>
                    <dd className="text-gray-700">-${confirmedOrder.voucher.amount}</dd>
                  </div>
                ) : null}

                <div className="flex justify-between">
                  <dt className="flex font-medium text-gray-900">
                    Discount
                    {/* <span className="rounded-full bg-gray-200 text-xs text-gray-600 py-0.5 px-2 ml-2">STUDENT50</span> */}
                  </dt>
                  <dd className="text-gray-700">
                    -$
                    {confirmedOrder.promotions === null || confirmedOrder.promotions.length === 0
                      ? "0"
                      : calculateDiscounts(confirmedOrder.promotions)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-gray-900">Shipping</dt>
                  <dd className="text-gray-700">
                    {confirmedOrder.delivery === true ? "$2.50" : "$0"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-base font-bold text-gray-900">Total</dt>
                  <dd className="text-base text-gray-900 font-bold">
                    ${confirmedOrder.totalAmount}
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        </div>
      ) : (
        <p>loading</p>
      )}
    </main>
  );
};
