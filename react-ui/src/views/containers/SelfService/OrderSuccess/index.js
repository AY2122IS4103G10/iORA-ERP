import { useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import moment from "moment";
import { orderApi } from "../../../../environments/Api";
import { useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import Barcode from "react-barcode";
import { HomeIcon, PrinterIcon } from "@heroicons/react/solid";

export default function OrderSuccess({ clientSecret }) {
  const stripe = useStripe();
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToasts();
  const [paymentData, setPaymentData] = useState({});
  const [order, setOrder] = useState({});

  useEffect(() => {
    if (!stripe || !clientSecret) {
      return;
    }
    clientSecret &&
      stripe
        .retrievePaymentIntent(clientSecret)
        .then((data) => {
          setPaymentData(data?.paymentIntent);
        })
        .catch((err) => {
          console.log(err?.response?.data?.message)
          addToast(
            `Error: ${
              err?.response?.data?.message || "Stripe unable to connect"
            }`,
            {
              appearance: "error",
              autoDismiss: true,
            }
          );
        });
  }, [stripe, clientSecret, setPaymentData, addToast]);

  useEffect(() => {
    orderApi
      .get(id)
      .then(({ data }) => {
        setOrder(data);
      })
      .catch((err) => {
        addToast(`Error: ${err?.response?.data?.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  }, [id, addToast]);

  return (
    <main className="bg-white px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:px-8 lg:py-32">
      <div className="max-w-xl mx-auto">
        <div className="max-w-xl">
          <h1 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Thank you!
          </h1>
          <p className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Your payment was successful!
          </p>
          <p className="mt-2 text-base text-gray-500 flex-grow">
            Status: Successful
          </p>
          {clientSecret ? (
            <p className="mt-6 font-medium text-base text-gray-800">
              You have paid {paymentData?.currency?.toUpperCase()}$
              {Number.parseFloat(paymentData?.amount / 100).toFixed(2)} on{" "}
              {moment.unix(paymentData?.created).format("DD MMM YYYY HH:mm:SS")}
            </p>
          ) : (
            <p className="mt-6 font-medium text-base text-gray-800">
              You have successfully completed your purchase
            </p>
          )}

          <div className="flex flex-row pt-12">
            <dl className="text-lg font-medium flex-grow">
              <dt className="text-gray-900">Receipt number</dt>
              <dd className="text-indigo-600 mt-2">{id}</dd>
            </dl>
            <Barcode
              value="barcode-example"
              width={1}
              height={64}
              displayValue={false}
              margin={0}
            />
          </div>
        </div>

        <section
          aria-labelledby="order-heading"
          className="mt-10 border-t border-gray-200 max-w-xl"
        >
          <h2 id="order-heading" className="sr-only">
            Your order
          </h2>

          <h3 className="text-lg font-medium text-indigo-600 mb-3">Items</h3>
          {order.lineItems?.map((lineItem, index) => (
            <div
              key={index}
              className="py-3 border-b border-gray-200 flex space-x-6"
            >
              <div className="flex-auto flex flex-row">
                <div className="grow">
                  <h4 className="font-medium text-gray-900">
                    {lineItem?.product.sku}
                  </h4>
                  <p className="mt-2 text-sm text-gray-600">
                    {lineItem?.product?.productFields.map(
                      (productField, index) => {
                        return (
                          <span key={index} className="mr-5">
                            {productField?.fieldName}:{" "}
                            {productField?.fieldValue}
                          </span>
                        );
                      }
                    )}
                  </p>
                </div>
                <div className="mt-6 flex-1 flex items-end">
                  <dl className="flex text-sm divide-x divide-gray-200 space-x-4 sm:space-x-6">
                    <div className="flex">
                      <dt className="font-medium text-gray-900">Quantity</dt>
                      <dd className="ml-2 text-gray-700">{lineItem?.qty}</dd>
                    </div>
                    <div className="pl-4 flex sm:pl-6">
                      <dt className="font-medium text-gray-900">Subtotal</dt>
                      <dd className="ml-2 text-gray-700">
                        ${Number.parseFloat(lineItem?.subTotal).toFixed(2)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </section>
        <div className="mt-6 flex justify-center space-x-6">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => window.print()}
          >
            <PrinterIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Print Receipt
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => navigate("/ss")}
          >
            <HomeIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Return to Home
          </button>
        </div>
      </div>
    </main>
  );
}
