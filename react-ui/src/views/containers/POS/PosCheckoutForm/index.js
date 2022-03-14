import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { posApi } from "../../../../environments/Api";
import CheckoutForm from "./CheckoutForm";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  "pk_test_51KctAyIg5oaI7BMzEzTNnU7xnLmOYawYBDbGziHVJJhlyGZ1Y86QvYSh0zy5MfmBCyOOnQAdvXIq0K4fqQMr0QMQ00LwoM8VzL"
);

export default function PosCheckoutForm(props) {
  const [clientSecret, setClientSecret] = useState("");
  const { addToast } = useToasts();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    posApi
      .getPaymentIntent(props.lineItems)
      .then((data) => setClientSecret(data.clientSecret))
      .catch((err) => {
        addToast(`Error: ${err.response.data.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  }, []);

  const options = {
    clientSecret,
  };

  return (
    <div className="stripe">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
