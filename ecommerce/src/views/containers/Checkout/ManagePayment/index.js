import {
    PaymentElement,
    useElements,
    useStripe,
  } from "@stripe/react-stripe-js";
  import React, { useEffect, useState } from "react";
  import { orderApi } from "../../../../environments/Api";
  
  export default function PaymentForm({
    setIsLoading,
    clientSecret,
    order,
    amount,
  }) {
    const stripe = useStripe();
    const elements = useElements();
  
    const [message, setMessage] = useState(null);
    const [paymentIntentId, setPaymentIntentId] = useState("");
  
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
            break;
          default:
            setMessage("Something went wrong.");
            break;
        }
      });
    }, [stripe, clientSecret]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!stripe || !elements || !paymentIntentId) {
        return;
      }
  
      setIsLoading(true);
      const { data } = await orderApi.createOrder({
        ...order,
        paid: true,
        payments: [
          {
            amount: amount,
            paymentType: "MASTERCARD",
            ccTransactionId: clientSecret,
          },
        ],
      }, paymentIntentId);
  
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `http://localhost:3000/ss/order/${data?.id}`,
        },
      });
  
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occured.");
      }
  
      setIsLoading(false);
    };
  
    return (
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" />
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
        <div className="sm:mt-6 sm:flex sm:flex-row">
          <button
            type="submit"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Checkout
          </button>
        </div>
      </form>
    );
  }
  