import { useState, useEffect } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { checkoutApi } from "../../../../environments/Api";
import { useNavigate } from "react-router-dom";
import { orderSuccess } from "../../../../stores/slices/purchasesSlice";


export default function PaymentForm({ clientSecret, order }) {
    const stripe = useStripe();
    const navigate = useNavigate();
    const elements = useElements();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState("");
    const [paymentIntentId, setPaymentIntentId] = useState("");

    useEffect(() => {

        if (!clientSecret || !stripe) {
            return;
        }

        getPaymentStatus();

    }, [stripe, clientSecret, loading]);
    
    const getPaymentStatus = () => {
        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            setPaymentIntentId(paymentIntent.id);
            console.log("STATUS:", paymentIntent.status);
            console.log("Client Secret:", clientSecret)
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
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }


    const handleSubmit = async (e) => {
        console.log('submit');
        e.preventDefault();

        if (!stripe || !elements || !paymentIntentId) {
            return; 
        }
        setLoading(true);

        const error = await stripe.confirmPayment({
            elements,
            redirect: "if_required"
        })
        console.log(error);
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occured.");
        }
        
        setLoading(false);
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
            ]
        }
        checkoutApi.createOnlineOrder(newOrder, paymentIntentId)
            .then((response) => {
                console.log(response.data)
                orderSuccess(response.data);
                navigate(`/checkout/success/${response.data.id}`)
            })
            .catch((err) => setMessage(err));
    }


    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
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