import { useState, useEffect } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { checkoutApi } from "../../../../environments/Api";
import { useNavigate } from "react-router-dom";
import { orderSuccess } from "../../../../stores/slices/purchasesSlice";
import { clearCart } from "../../../../stores/slices/cartSlice";
import { useDispatch } from "react-redux";
import { TailSpin } from "react-loader-spinner";

export default function PaymentForm({ clientSecret, order, onCancelClicked }) {
  const stripe = useStripe();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState("");

  useEffect(() => {
    if (!clientSecret || !stripe) {
      return;
    }
    const createOnlineOrder = () => {
      let newOrder = {
        ...order,
        payments: [
          {
            amount: order.totalAmount,
            paymentType: "MASTERCARD",
            ccTransactionId: paymentIntentId,
          },
        ],
      };
      setLoading(true);
      checkoutApi
        .createOnlineOrder(newOrder, paymentIntentId)
        .then((response) => {
          console.log(response.data);
          dispatch(orderSuccess(response.data));
          dispatch(clearCart());
          setLoading(false);
          navigate(`/checkout/success/${response.data.id}`);
        })
        .catch((err) => setMessage(err));
    };
    const getPaymentStatus = async () => {
      const { paymentIntent } = await stripe.retrievePaymentIntent(
        clientSecret
      );
      setPaymentIntentId(paymentIntent.id);
      console.log("STATUS:", paymentIntent.status);
      console.log("Client Secret:", clientSecret);
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        case "requires_capture":
          createOnlineOrder();
          break;
        default:
          setMessage("Something went wrong.");
      }
    };
    getPaymentStatus();
  }, [
    stripe,
    clientSecret,
    loading,
    dispatch,
    navigate,
    order,
    paymentIntentId,
  ]);

  const handleSubmit = async (e) => {
    console.log("submit");
    e.preventDefault();

    if (!stripe || !elements || !paymentIntentId) {
      return;
    }
    setLoading(true);

    const error = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    console.log(error);
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occured.");
    }

    setLoading(false);
  };

  return (
    <div>
      <div id="payment-form" className="m-4 pl-4">
        <h2
          id="summary-heading"
          className="text-lg font-medium text-gray-900 mb-5"
        >
          Make Payment
        </h2>
        <PaymentElement id="payment-element" />
        {/* {message && <div id="payment-message">{message}</div>} */}
      </div>
      <div className="mt-4 mr-4 flex justify-end">
        <button
          className="w-fit bg-white text-black border border-black rounded-md shadow-sm py-2 px-4 text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500 sm:ml-6 sm:order-last sm:w-auto"
          onClick={onCancelClicked}
        >
          Go back
        </button>
        <button
          type="submit"
          className="inline-flex w-full bg-gray-900 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500 sm:ml-6 sm:order-last sm:w-auto"
          onClick={handleSubmit}
        >
          <span>Make Payment</span>
          {loading && (
            <div className="ml-2 flex items-center">
              <TailSpin color="#FFFFFF" height={20} width={20} />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
