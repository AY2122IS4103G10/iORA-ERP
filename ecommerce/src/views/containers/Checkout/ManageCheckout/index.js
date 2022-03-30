import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectCart } from "../../../../stores/slices/cartSlice";
import { selectUserId } from "../../../../stores/slices/userSlice";

import { checkoutApi } from "../../../../environments/Api";
import { countries } from "../../../../utilities/Util";
import { OrderSummary } from "../OrderSummary";
import { CheckoutForm } from "../CheckoutForm";
import { ManagePayment } from "../ManagePayment";

const deliveryMethods = [
    { id: 1, title: 'Standard Shipping', description: '4–10 business days', footer: '$2.50' },
    { id: 2, title: 'Store Pickup', description: '5-7 business days', footer: 'Free' },
]

export const ManageCheckout = () => {
    const navigate = useNavigate();
    const [enterPayment, setEnterPayment] = useState(false);

    const [subTotal, setSubTotal] = useState(0);
    const [afterDiscount, setAfterDiscount] = useState(0);
    const [promotions, setPromotions] = useState([]);
    const [lineItems, setLineItems] = useState(null);
    const [order, setOrder] = useState(null);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [country, setCountry] = useState({ name: countries[197] });
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [sameAddress, setSameAddress] = useState(true);
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(deliveryMethods[0]);
    const [store, setStore] = useState({ name: "Select Store" });
    const [storeList, setStoreList] = useState();


    const cart = useSelector(selectCart);
    const customerId = useSelector(selectUserId);

    useEffect(() => {
        checkoutApi.getStores()
            .then((response) => setStoreList(response.data))
            .catch((err) => console.log(err))


        async function calculate() {
            let subTotal = 0;
            let lineItems = cart.map((item) => {
                const { model, ...lineItem } = item;
                subTotal = subTotal + item.qty * model.listPrice;
                return { ...lineItem, subTotal: model.listPrice * item.qty };
            });
            setLineItems(lineItems);
            setSubTotal(subTotal);

            const response = await checkoutApi.calculatePromotions(lineItems);
            setPromotions(response.data[1]);
            setAfterDiscount(
                response.data
                    .map((y) => y.map((x) => x.subTotal).reduce((x, y) => x + y, 0))
                    .reduce((x, y) => x + y, 0)
            );
        }

        calculate();

    }, [])

    const onCancelClicked = () => navigate(-1);

    const handleMakePayment = () => {
        let delivery = selectedDeliveryMethod.id === 1 ? true : false
        let totalAmount = afterDiscount + (selectedDeliveryMethod.id === 1 ? 2.50 : 0)
        let order = {
            lineItems,
            customerId,
            totalAmount: totalAmount,
            country: country.name,
            delivery,
            promotions: promotions,
            deliveryAddress: {
                name: name,
                street1: address,
                city: city,
                zip: postalCode,
                state: state,
                phone: phoneNumber
            },
            pickupSite: selectedDeliveryMethod.id === 1 ? null : store,

        }
        setOrder(order);
        setEnterPayment(true);
    }

    return (
        <div className="bg-white">
            <h1 className="align-middle text-center mt-3 sm:px-8 sm:py-6 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 ">
                Checkout
            </h1>

            {/* <p className="text-gray-900 text-center">
                        Returning customer? {' '}
                        <Link to="/login" className="underline underline-offset-1">
                            Click here to login
                        </Link>
                    </p> */}

            <div className="hidden lg:block h-full bg-white" aria-hidden="true" />
            <div className="hidden lg:block h-full bg-gray-50" aria-hidden="true" />
            <div className="relative grid grid-cols-1 gap-x-16 max-w-full mx-auto lg:px-8 lg:grid-cols-2 xl:gap-x-40">
                <OrderSummary
                    cart={cart}
                    subTotal={subTotal}
                    afterDiscount={afterDiscount}
                    promotions={promotions}
                    selectedDeliveryMethod={selectedDeliveryMethod}
                />
                {enterPayment ?
                    <ManagePayment
                        order={order}
                        isDelivery={selectedDeliveryMethod.id === 1 ? true : false}
                    />
                    : <CheckoutForm
                        setEmail={setEmail}
                        setPhoneNumber={setPhoneNumber}
                        setName={setName}
                        country={country}
                        setCountry={setCountry}
                        address={address}
                        setAddress={setAddress}
                        setPostalCode={setPostalCode}
                        setCity={setCity}
                        setState={setState}
                        sameAddress={sameAddress}
                        setSameAddress={setSameAddress}
                        selectedDeliveryMethod={selectedDeliveryMethod}
                        setSelectedDeliveryMethod={setSelectedDeliveryMethod}
                        store={store}
                        setStore={setStore}
                        storeList={storeList}
                        handleMakePayment={handleMakePayment}
                    />}
            </div>
        </div>
    );

}