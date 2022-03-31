import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../../../../environments/Api";
import { TailSpin } from "react-loader-spinner";
import { ExclamationIcon } from "@heroicons/react/solid";

export default function CheckoutForm({
  clientSecret,
  closeModal,
  order,
  amount,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [buttonState, setButtonState] = useState("Verify");

  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          setPaymentIntentId(paymentIntent.id);
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("");
          setPaymentIntentId(paymentIntent.id);
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe, clientSecret]);

  const handleVerify = async (e) => {
    if (!stripe || !elements || !paymentIntentId) {
      return;
    }

    setButtonState("Verifying");
    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (!error) {
      handleSubmit(e);
    } else if (
      error?.type === "card_error" ||
      error?.type === "validation_error"
    ) {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occured.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setButtonState("Processing");
      const { data } = await orderApi.createOrder(
        {
          ...order,
          paid: true,
          payments: [
            {
              amount: amount,
              paymentType: "MASTERCARD",
              ccTransactionId: clientSecret,
            },
          ],
        },
        paymentIntentId
      );
      navigate(
        `/ss/order/${data.id}?redirect_status=succeeded&payment_intent_client_secret=${clientSecret}`
      );
    } catch (err) {
      setButtonState("checkout");
      setMessage("An unexpected error occured.");
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      {/* Show any error or success messages */}
      {message && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationIcon
                className="h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{message}</p>
            </div>
          </div>
        </div>
      )}
      <div className="sm:mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
          onClick={closeModal}
        >
          Cancel Checkout
        </button>
        {(buttonState === "Verifying" || buttonState === "Processing") && (
          <div className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
            <p className="mr-3">{buttonState}</p>
            <TailSpin color="#00BFFF" height={20} width={20} />
          </div>
        )}
        {buttonState === "Verify" && (
          <button
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            onClick={handleVerify}
          >
            Confirm Details
          </button>
        )}
        {buttonState === "Checkout" && (
          <button
            type="submit"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          >
            Checkout
          </button>
        )}
      </div>
    </form>
  );
}
