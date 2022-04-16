import { countries } from "../../../../utilities/Util";
import { RadioGroupComponent } from "../../../components/RadioGroup";
import { SimpleComboBox } from "../../../components/ComboBoxes/SimpleComboBox";

const deliveryMethods = [
  {
    id: 1,
    title: "Standard Shipping",
    description: "4–7 business days",
    footer: "$2.50",
  },
  {
    id: 2,
    title: "Store Pickup",
    description: "2-3 business days",
    footer: "Free",
  },
];

export const AddressForm = ({
  country,
  setCountry,
  address,
  setAddress,
  address2,
  setAddress2,
  city,
  setCity,
  state,
  setState,
  postalCode,
  setPostalCode,
}) => {
  console.log(postalCode)
  return (
    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
      <div className="sm:col-span-3">
        <select
          id="countries"
          name="countries"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-3">
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address 1
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="address"
            autoComplete="street-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="sm:col-span-3">
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address 2
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="address"
            autoComplete="street-address"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="city"
          className="block text-sm font-medium text-gray-700"
        >
          City
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="city"
            autoComplete="address-level2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="region"
          className="block text-sm font-medium text-gray-700"
        >
          State / Province
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="region"
            autoComplete="address-level1"
            placeholder="Optional"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="postal-code"
          className="block text-sm font-medium text-gray-700"
        >
          Postal code
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="postal-code"
            autoComplete="postal-code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export const DeliveryForm = ({
  sameAddress,
  setSameAddress,
  country,
  setCountry,
  setAddress,
}) => {
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
            <label
              htmlFor="same-as-billing"
              className="text-sm font-medium text-gray-900"
            >
              Same as billing information
            </label>
          </div>
        </div>
      </section>

      {sameAddress ? (
        ""
      ) : (
        <AddressForm
          country={country}
          setCountry={setCountry}
          setAddress={setAddress}
        />
      )}
    </>
  );
};

export const StorePickupForm = ({ store, setStore, storeList }) => {
  return (
    <section aria-labelledby="storepickup-heading" className="mt-10">
      <h2
        id="storepickup-heading"
        className="text-lg font-medium text-gray-900"
      >
        Store Pickup
      </h2>

      <div className="mt-4 ml-1">
        {storeList !== null ? (
          <SimpleComboBox
            label="Select Store to Pickup From"
            options={storeList}
            value={store}
            onChange={setStore}
          />
        ) : (
          ""
        )}
      </div>
    </section>
  );
};

export const VoucherForm = ({ voucher, setVoucher, handleApplyVoucher }) => {


  return (
    <section aria-labelledby="voucher-heading" className="mt-2 pb-6">
      <h2
        id="voucher-heading"
        className="text-lg font-medium text-gray-900"
      >
        Voucher
      </h2>

      <div className="my-4">
        <label className="block text-sm font-medium text-gray-700">
          Voucher Code
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="voucherCode"
            value={voucher}
            placeholder="leave blank if not using"
            onChange={(e) => setVoucher(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          />
          <button
            type="submit"
            className="mt-1 float-right min-w bg-gray-800 border border-transparent rounded-md shadow-sm py-2 px-4 text-xs font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500 sm:ml-6 sm:order-last sm:w-auto"
            onClick={handleApplyVoucher}
          >
            Apply
          </button>
        </div>
      </div>
    </section>
  );
}

export const CheckoutForm = ({
  voucher,
  setVoucher,
  email,
  setEmail,
  name,
  setName,
  phoneNumber,
  setPhoneNumber,
  country,
  setCountry,
  address,
  setAddress,
  address2,
  setAddress2,
  postalCode,
  setPostalCode,
  city,
  setCity,
  state,
  setState,
  selectedDeliveryMethod,
  setSelectedDeliveryMethod,
  store,
  setStore,
  storeList,
  handleMakePayment,
  onCancelClicked,
  handleApplyVoucher,
}) => {
  return (
    <div className="m-8 pt-4 pb-36 px-4 sm:px-6 lg:pb-16 lg:px-0 lg:row-start-1 lg:col-start-1">
      <div className="max-w-lg mx-auto lg:max-w-none">

        <VoucherForm voucher={voucher} setVoucher={setVoucher} handleApplyVoucher={handleApplyVoucher}/>

        <section aria-labelledby="contact-info-heading">
          <h2
            id="contact-info-heading"
            className="text-lg font-medium text-gray-900"
          >
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="contact-number"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="contact-number"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Number
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="phone-number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
            </div>
          </div>
        </section>



        <div className="mt-10 border-t border-gray-200 pt-10">
          <RadioGroupComponent
            label="Delivery Method"
            options={deliveryMethods}
            value={selectedDeliveryMethod}
            onChange={setSelectedDeliveryMethod}
          />
        </div>

        {selectedDeliveryMethod.id === 1 ? (
          <section aria-labelledby="billing-heading" className="mt-10">
            <h2
              id="billing-heading"
              className="text-lg font-medium text-gray-900"
            >
              Shipping Information
            </h2>
            <AddressForm
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
            />
          </section>
        ) : (
          <StorePickupForm
            store={store}
            setStore={setStore}
            storeList={storeList}
          />
        )}

        <div className="mt-10 pt-6 border-t border-gray-200 sm:flex sm:items-center sm:justify-between">
          <button
            type="submit"
            className="w-full bg-gray-900 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500 sm:ml-6 sm:order-last sm:w-auto"
            onClick={handleMakePayment}
          >
            Make Payment
          </button>
          <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0 sm:text-left">
            You won't be charged until the next step.
          </p>
        </div>
      </div>
    </div>
  );
};
