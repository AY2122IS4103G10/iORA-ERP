import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import PaymentForm from "../PaymentForm";
import { checkoutApi } from "../../../../environments/Api";

const PUBLIC_KEY = "pk_test_51KctAyIg5oaI7BMzEzTNnU7xnLmOYawYBDbGziHVJJhlyGZ1Y86QvYSh0zy5MfmBCyOOnQAdvXIq0K4fqQMr0QMQ00LwoM8VzL"

const stripePromise = loadStripe(PUBLIC_KEY)

export default function ManagePayment({ cart, isDelivery }) {
  const [clientSecret, setClientSecret] = useState(null);

  let lineItems = cart.map((item) => {
    const { model, ...lineItem } = item;
    return {...lineItem, subTotal: model.listPrice * item.qty};
  });
  console.log(lineItems);
  useEffect(() => {
    lineItems.length > 0 &&
    checkoutApi
      .createPaymentIntent(lineItems, isDelivery)
      .then((response) => setClientSecret(response.data))
      .catch((err) => console.log(err))
  }, [cart, isDelivery])

  const options = {
    clientSecret,
  };
  return (
    <div>
      {clientSecret !== null ? (
        <div>
          <Elements options={options} stripe={stripePromise}>
            <PaymentForm clientSecret={clientSecret}/>
          </Elements>
        </div>)
        : (
          <p className="text-center">loading</p>
        )}
    </div>
  );
}