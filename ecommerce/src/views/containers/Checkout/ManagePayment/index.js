import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { TailSpin } from "react-loader-spinner";
import PaymentForm from "../PaymentForm";
import { checkoutApi } from "../../../../environments/Api";

const PUBLIC_KEY = "pk_test_51KctAyIg5oaI7BMzEzTNnU7xnLmOYawYBDbGziHVJJhlyGZ1Y86QvYSh0zy5MfmBCyOOnQAdvXIq0K4fqQMr0QMQ00LwoM8VzL"

const stripePromise = loadStripe(PUBLIC_KEY)

export const ManagePayment = ({ order, isDelivery, onCancelClicked }) => {
  const [clientSecret, setClientSecret] = useState(null);

  
  console.log("Create payment Intent", order?.totalAmount)
  useEffect(() => {
    if (order !== null && order.lineItems !== null && order.lineItems.length > 0) {
      checkoutApi
      .createPaymentIntent(order.totalAmount * 100, isDelivery)
      .then((response) => setClientSecret(response.data))
      .catch((err) => console.log(err))
    }
     
  }, [isDelivery, order])
  const options = {
    clientSecret,
  };
   
  return (
    <div>
      {clientSecret !== null ? (
        <div className="m-10">
          <Elements options={options} stripe={stripePromise}>
            <PaymentForm clientSecret={clientSecret} order={order} onCancelClicked={onCancelClicked} />
          </Elements>
        </div>)
        : (
          <div className="flex mt-5 items-center justify-center">
              <TailSpin color="#111827" height={20} width={20} />
            </div>
        )}
    </div>
  );
}