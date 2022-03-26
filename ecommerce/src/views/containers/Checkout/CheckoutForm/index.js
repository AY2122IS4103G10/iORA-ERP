import { useEffect, useState, Fragment } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Popover, Transition } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'

import { selectCart } from "../../../../stores/slices/cartSlice";
import { checkoutApi } from "../../../../environments/Api";
import { countries, classNames } from "../../../../utilities/Util";
import { RadioGroupComponent } from "../../../components/RadioGroup";
import { SimpleComboBox } from "../../../components/ComboBoxes/SimpleComboBox";

const deliveryMethods = [
  { id: 1, title: 'Standard Shipping', description: '4–10 business days', footer: '$2.50' },
  { id: 2, title: 'Store Pickup', description: '5-7 business days', footer: 'Free' },
]


function calculateSubTotal(cart) {
  let amount = 0;
  cart.map((item) => {
    amount = amount + item.model.listPrice * item.qty;
  })
  return amount;
}

export const AddressForm = ({ country, setCountry, setAddress }) => {

  return (
    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
      <div className="sm:col-span-3">
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <div className="mt-1">
          <select
            id="country"
            name="country"
            onChange={(e) => setCountry(e.target.value)}
            value={country}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          >
            {countries.map((item, id) =>
              <option key={id} value={item}>{item}</option>
            )
            }
          </select>
        </div>
      </div>


      <div className="sm:col-span-3">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="address"
            autoComplete="street-address"
            onChange={(e) => setAddress(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="city"
            autoComplete="address-level2"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="region" className="block text-sm font-medium text-gray-700">
          State / Province
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="region"
            autoComplete="address-level1"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
          Postal code
        </label>
        <div className="mt-1">
          <input
            type="number"
            id="postal-code"
            autoComplete="postal-code"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  )
}

export const DeliveryForm = ({ sameAddress, setSameAddress, country, setCountry, setAddress }) => {
  return (
    <>
      <section aria-labelledby="shipping-heading" className="mt-10">
        <h2 id="shipping-heading" className="text-lg font-medium text-gray-900">
          Shipping information
        </h2>

        <div className="mt-6 flex items-center">
          <input
            id="same-as-shipping"
            type="checkbox"
            defaultChecked={sameAddress}
            onChange={() => setSameAddress(!sameAddress)}
            className="h-4 w-4 border-gray-300 rounded text-gray-600 focus:ring-gray-500"
          />
          <div className="ml-2">
            <label htmlFor="same-as-billing" className="text-sm font-medium text-gray-900">
              Same as billing information
            </label>
          </div>
        </div>
      </section>

      {
        sameAddress === true ? "" :
          <AddressForm
            country={country}
            setCountry={setCountry}
            setAddress={setAddress}
          />
      }
    </>
  )
}

export const StorePickupForm = ({ store, setStore, storeList }) => {

  return (
    <section aria-labelledby="storepickup-heading" className="mt-10">
      <h2 id="storepickup-heading" className="text-lg font-medium text-gray-900">
        Store Pickup
      </h2> 

      <div className="mt-4 ml-1">
        {storeList !== null ? 
        <SimpleComboBox
          label="Select Store to Pickup From"
          options={storeList}
          value={store}
          onChange={setStore}
        /> : ""}
      </div>

    </section>
  )
}


export const OrderSummary = ({ cart }) => {
  return (
    <section
      aria-labelledby="summary-heading"
      className="bg-gray-50 mt-7 pt-10 pb-10  sm:px-6 lg:px-10 lg:pb-16 lg:row-start-1 lg:col-start-2"
    >
      <div className="max-w-lg mx-auto lg:max-w-none">
        <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
          Order summary
        </h2>

        <ul role="list" className="text-sm font-medium text-gray-900 divide-y divide-gray-200">
          {cart.map((item, id) => (
            <li key={id} className="flex items-start py-6 space-x-4">
              <div className="flex-auto space-y-1">
                <h3>{item.model.name} x {item.qty}</h3>
                <p className="text-gray-500">
                  Colour: {item.product?.productFields.find((field) => field.fieldName === "COLOUR").fieldValue}
                </p>
                <p className="text-gray-500">
                  Size: {item.product?.productFields.find((field) => field.fieldName === "SIZE").fieldValue}
                </p>
              </div>
              <p className="flex-none text-base font-medium">${parseInt(item.model.listPrice) * item.qty}</p>
            </li>
          ))}
        </ul>

        <dl className="hidden text-sm font-medium text-gray-900 space-y-6 border-t border-gray-200 pt-6 lg:block">
          <div className="flex items-center justify-between">
            <dt className="text-gray-600">Subtotal</dt>
            <dd>${cart !== null ? calculateSubTotal(cart) : 0}</dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-gray-600">Shipping</dt>
            <dd>$15.00</dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-gray-600">Taxes</dt>
            <dd>$26.80</dd>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <dt className="text-base">Total</dt>
            <dd className="text-base">$361.80</dd>
          </div>
        </dl>

        <Popover className="fixed bottom-0 inset-x-0 flex flex-col-reverse text-sm font-medium text-gray-900 lg:hidden">
          <div className="relative z-10 bg-white border-t border-gray-200 px-4 sm:px-6">
            <div className="max-w-lg mx-auto">
              <Popover.Button className="w-full flex items-center py-6 font-medium">
                <span className="text-base mr-auto">Total</span>
                <span className="text-base mr-2">$361.80</span>
                <ChevronUpIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
              </Popover.Button>
            </div>
          </div>

          <Transition.Root as={Fragment}>
            <div>
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Popover.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <Popover.Panel className="relative bg-white px-4 py-6 sm:px-6">
                  <dl className="max-w-lg mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                      <dt className="text-gray-600">Subtotal</dt>
                      <dd>{cart !== null ? calculateSubTotal(cart) : 0}</dd>
                    </div>

                    <div className="flex items-center justify-between">
                      <dt className="text-gray-600">Shipping</dt>
                      <dd>$15.00</dd>
                    </div>

                    <div className="flex items-center justify-between">
                      <dt className="text-gray-600">Taxes</dt>
                      <dd>$26.80</dd>
                    </div>
                  </dl>
                </Popover.Panel>
              </Transition.Child>
            </div>
          </Transition.Root>
        </Popover>
      </div>
    </section>
  )
}

export const CheckoutForm = ({ cart, email, setEmail, firstName, setFirstName,
  lastName, setLastName, setPhoneNumber, country, setCountry, address, setAddress,
  sameAddress, setSameAddress, selectedDeliveryMethod, setSelectedDeliveryMethod, store, setStore, storeList }) => {


  return (
    <div className="bg-white">
      <h1 className="align-middle text-center sm:px-8 sm:py-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        Checkout
      </h1>
      {/* Background color split screen for large screens */}
      <div className="hidden lg:block h-full bg-white" aria-hidden="true" />
      <div className="hidden lg:block h-full bg-gray-50" aria-hidden="true" />

      <div className="relative grid grid-cols-1 gap-x-16 max-w-7xl mx-auto lg:px-8 lg:grid-cols-2 xl:gap-x-48">
        <h1 className="sr-only">Order information</h1>

        <OrderSummary
          cart={cart}
        />

        <form className="pt-8 pb-36 px-4 sm:px-6 lg:pb-16 lg:px-0 lg:row-start-1 lg:col-start-1">
          <div className="max-w-lg mx-auto lg:max-w-none">
            <section aria-labelledby="contact-info-heading">
              <h2 id="contact-info-heading" className="text-lg font-medium text-gray-900">
                Contact information
              </h2>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email-address"
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="first-name"
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="last-name"
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="contact-number" className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    id="phone-number"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  />
                </div>
              </div>
            </section>

            <section aria-labelledby="billing-heading" className="mt-10">
              <h2 id="billing-heading" className="text-lg font-medium text-gray-900">
                Billing Information
              </h2>
              <AddressForm
                country={country}
                setCountry={setCountry}
                setAddress={setAddress}
              />
            </section>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <RadioGroupComponent 
                label="Delivery Method"
                options={deliveryMethods}
                value={selectedDeliveryMethod}
                onChange={setSelectedDeliveryMethod}
              />
            </div>

            {selectedDeliveryMethod.id === 1 ?
              <DeliveryForm
                sameAddress={sameAddress}
                setSameAddress={setSameAddress}
                country={country}
                address={address}
                setAddress={setAddress}
              /> :
              <StorePickupForm
                store={store}
                setStore={setStore}
                storeList={storeList}
              />
            }

            <div className="mt-10 pt-6 border-t border-gray-200 sm:flex sm:items-center sm:justify-between">
              <button
                type="submit"
                className="w-full bg-gray-900 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500 sm:ml-6 sm:order-last sm:w-auto"
              >
                Make Payment
              </button>
              <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0 sm:text-left">
                You won't be charged until the next step.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("Singapore");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [sameAddress, setSameAddress] = useState(true);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(deliveryMethods[0]);
  const [store, setStore] = useState({name: ""});
  const [storeList, setStoreList] = useState();

  const cart = useSelector(selectCart);

  useEffect(() => {
    checkoutApi.getStores()
      .then((response) => setStoreList(response.data))
      .catch((err) => console.log(err))
  }, [])

  return (
    <CheckoutForm
      cart={cart}
      setEmail={setEmail}
      setFirstName={setFirstName}
      setLastName={setLastName}
      setPhoneNumber={setPhoneNumber}
      country={country}
      setCountry={setCountry}
      setAddress={setAddress}
      sameAddress={sameAddress}
      setSameAddress={setSameAddress}
      selectedDeliveryMethod={selectedDeliveryMethod}
      setSelectedDeliveryMethod={setSelectedDeliveryMethod}
      storeList={storeList}
      store={store}
      setStore={setStore}
    />
  )
}
