import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { onlineOrderApi } from "../../../../environments/Api";
import CheckoutForm from "../CheckoutForm";
import OrderSuccess from "../OrderSuccess";

const stripePromise = loadStripe(
  "pk_test_51KctAyIg5oaI7BMzEzTNnU7xnLmOYawYBDbGziHVJJhlyGZ1Y86QvYSh0zy5MfmBCyOOnQAdvXIq0K4fqQMr0QMQ00LwoM8VzL"
);

export default function ManageCheckout({
  open,
  closeModal,
  checkoutItems,
  order,
  setIsLoading,
}) {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const paymentIntent = params?.get("payment_intent");
  const redirectStatus = params?.get("redirect_status");
  const paymentIntentClientSecret = params?.get("payment_intent_client_secret");
  const [clientSecret, setClientSecret] = useState("");
  const { addToast } = useToasts();

  useEffect(() => {
    checkoutItems.length > 0 &&
      onlineOrderApi
        .getPaymentIntent(checkoutItems)
        .then((response) => setClientSecret(response.data))
        .catch((err) => {
          addToast(`Error: ${err.response.data.message}`, {
            appearance: "error",
            autoDismiss: true,
          });
        });
  }, [checkoutItems, addToast]);

  useEffect(() => {
    setClientSecret(paymentIntentClientSecret);
  }, [paymentIntentClientSecret]);

  const options = {
    clientSecret,
  };

  return (
    <div className="stripe">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          {redirectStatus === "succeeded" ? (
            <OrderSuccess
              paymentIntent={paymentIntent}
              clientSecret={paymentIntentClientSecret}
            />
          ) : (
            clientSecret && (
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
                        <div className="sm:mt-3 sm:ml-3 sm:text-left sm:items-stretch sm:justify-items-stretch">
                          <Dialog.Title
                            as="h3"
                            className="text-lg leading-6 font-medium text-gray-900 mb-6"
                          >
                            Checkout using Stripe
                          </Dialog.Title>
                          <CheckoutForm
                            setIsLoading={setIsLoading}
                            clientSecret={clientSecret}
                            closeModal={closeModal}
                            order={order}
                          />
                        </div>
                      </div>
                    </Transition.Child>
                  </div>
                </Dialog>
              </Transition.Root>
            )
          )}
        </Elements>
      )}
    </div>
  );
}
