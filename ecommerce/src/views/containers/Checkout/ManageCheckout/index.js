import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { selectCart } from "../../../../stores/slices/cartSlice";
import { selectUser, selectUserId } from "../../../../stores/slices/userSlice";

import { checkoutApi } from "../../../../environments/Api";
import { OrderSummary } from "../OrderSummary";
import { CheckoutForm } from "../CheckoutForm";
import { ManagePayment } from "../ManagePayment";

const deliveryMethods = [
  {
    id: 1,
    title: "Standard Shipping",
    description: "4-10 business days",
    footer: "$2.50",
  },
  {
    id: 2,
    title: "Store Pickup",
    description: "5-7 business days",
    footer: "Free",
  },
];

export const ManageCheckout = () => {
  const user = useSelector(selectUser);
  const [enterPayment, setEnterPayment] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [afterDiscount, setAfterDiscount] = useState(0);
  const [promotions, setPromotions] = useState([]);
  const [lineItems, setLineItems] = useState(null);
  const [order, setOrder] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("Singapore");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [sameAddress, setSameAddress] = useState(true);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(
    deliveryMethods[0]
  );
  const [store, setStore] = useState({ name: "Select Store" });
  const [storeList, setStoreList] = useState([]);

  const cart = useSelector(selectCart);
  // const customerId = useSelector(selectUserId);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setName(`${user.firstName} ${user.lastName}`);
      setPhoneNumber(user.contactNumber);
      if (user.address) {
        setCountry(user.address.country);
        setAddress(user.address.street1);
        setAddress2(user.address.street2);
        setCity(user.address.city);
        setState(user.address.state);
        setPostalCode(user.address.zip);
      }
    }
  }, [user]);

  useEffect(() => {
    checkoutApi
      .getStores()
      .then((response) => setStoreList(response.data))
      .catch((err) => console.log(err));

    async function calculate() {
      let subTotal = 0;
      let lineItems = cart.map((item) => {
        const { model, stock, ...lineItem } = item;
        subTotal = subTotal + item.qty * model.discountPrice;
        return { ...lineItem, subTotal: model.discountPrice * item.qty };
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
  }, [cart]);

  const onCancelClicked = () => setEnterPayment(false);

  const handleMakePayment = () => {
    let delivery = selectedDeliveryMethod.id === 1 ? true : false;
    let totalAmount =
      afterDiscount + (selectedDeliveryMethod.id === 1 ? 2.5 : 0);
    let order = {
      lineItems,
      customerId: user?.id,
      totalAmount: totalAmount,
      delivery,
      promotions: promotions,
      deliveryAddress: {
        name,
        street1: address.trim(),
        street2: address2.trim(),
        country,
        city,
        zip: postalCode,
        state,
        phone: phoneNumber,
      },
      pickupSite: selectedDeliveryMethod.id === 1 ? null : store,
    };
    setOrder(order);
    setEnterPayment(true);
  };

  return (
    <div className="bg-white">
      <h1 className="align-middle text-center mt-3 sm:px-8 sm:py-6 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 ">
        Checkout
      </h1>

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
        {enterPayment ? (
          <ManagePayment
            order={order}
            isDelivery={selectedDeliveryMethod.id === 1 ? true : false}
            onCancelClicked={onCancelClicked}
          />
        ) : (
          <CheckoutForm
            email={email}
            setEmail={setEmail}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            name={name}
            setName={setName}
            country={country}
            setCountry={setCountry}
            address={address}
            setAddress={setAddress}
            address2={address2}
            setAddress2={setAddress2}
            postalCode={postalCode}
            setPostalCode={setPostalCode}
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            sameAddress={sameAddress}
            setSameAddress={setSameAddress}
            selectedDeliveryMethod={selectedDeliveryMethod}
            setSelectedDeliveryMethod={setSelectedDeliveryMethod}
            store={store}
            setStore={setStore}
            storeList={storeList}
            handleMakePayment={handleMakePayment}
          />
        )}
      </div>
    </div>
  );
};
