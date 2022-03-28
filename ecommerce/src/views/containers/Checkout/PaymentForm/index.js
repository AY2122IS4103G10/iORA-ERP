import { useState, useEffect } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";


export default function PaymentForm({ clientSecret, order }) {
    const stripe = useStripe();
    const elements = useElements();
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState("");

    useEffect(() => {
        console.log("Reload");
        console.log(clientSecret);
        console.log(stripe);
        if (!clientSecret || !stripe) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
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
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
        console.log("hello");
    }, [stripe, clientSecret, loading]);

    const handleSubmit = async (e) => {
        console.log('submit');
        e.preventDefault();
        setLoading(true);

        if (!stripe || !elements || !clientSecret) {
            return;
        }

        const  error  = await stripe.confirmPayment({
            elements,
            confirmParams: {
                //payment completion page
                return_url: `http://localhost:3000/checkout/order/complete`,
            }
        })

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occured.");
        }

        //capture payment
        


        setLoading(false);
    }

    console.log(message);



    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element"/>
            {message && <div id="payment-message">{message}</div>}
            <button
                type="submit"
                className="w-full bg-gray-900 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500 sm:ml-6 sm:order-last sm:w-auto"
            >
                Make Payment
            </button>
        </form>
    )
}