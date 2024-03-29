import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  selectUser,
  updateAccount,
} from "../../../../../stores/slices/userSlice";
import { useEffect } from "react";
import { api } from "../../../../../environments/Api";

export const fetchCountries = async () => {
  const { data } = await api.getAll("admin/countries");
  return data;
};

export const Profile = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const user = useSelector(selectUser);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [dob, setDob] = useState(new Date());
  const [receiverName, setRecieverName] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Singapore");
  const [state, setState] = useState("");
  const [deliveryCon, setDeliveryCon] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [addressID, setAddressID] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetchCountries().then((data) => setCountries(data));
  }, []);

  const onFirstNameChanged = (e) => setFirstName(e.target.value);
  const onLastNameChanged = (e) => setLastName(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);
  const onContactNoChanged = (e) => setContactNo(e.target.value);
  const onDobChanged = (date) => setDob(date);
  const onReceiverNameChanged = (e) => setRecieverName(e.target.value);
  const onStreet1Changed = (e) => setStreet1(e.target.value);
  const onStreet2Changed = (e) => setStreet2(e.target.value);
  const onZipChanged = (e) => setZip(e.target.value);
  const onCityChanged = (e) => setCity(e.target.value);
  const onStateChanged = (e) => setState(e.target.value);
  const onCountryChanged = (e) => setCountry(e.target.value);
  const onDeliveryConChanged = (e) => setDeliveryCon(e.target.value);

  const onLoad = (user) => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setContactNo(user.contactNumber);
    setDob(user.dob);
    setEmail(user.email);
    if (user.address) {
      setRecieverName(user.address.name);
      setStreet1(user.address.street1);
      setStreet2(user.address.street2);
      setZip(user.address.zip);
      setCity(user.address.city);
      setState(user.address.state);
      setCountry(user.address.country);
      setDeliveryCon(user.address.phone);
      setAddressID(user.address.id);
    }
  };
console.log(user)
  useEffect(() => {
    if (user) {
      onLoad(user);
    }
  }, [user]);

  const onEditingClicked = (evt) => {
    evt.preventDefault();
    setIsEditing(!isEditing);
  };

  const onSaveClicked = (evt) => {
    evt.preventDefault();
    const address = {
      street1,
      street2,
      name: receiverName,
      city,
      state,
      zip,
      country,
      phone: deliveryCon,
    };
    if (addressID) address["id"] = addressID;
    dispatch(
      updateAccount({
        ...user,
        firstName,
        lastName,
        dob,
        contactNumber: contactNo,
        email,
        address,
      })
    )
      .then(({ payload }) => {
        onLoad(payload);
        addToast("Successfully updated account.", {
          appearance: "success",
          autoDismiss: true,
        });
        setIsEditing(!isEditing);
      })
      .catch((error) =>
        addToast(`Error: ${error.message}`, {
          appearance: "error",
          autoDismiss: true,
        })
      );
  };
  return (
    <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
      <section aria-labelledby="payment-details-heading">
        <form onSubmit={isEditing ? onSaveClicked : onEditingClicked}>
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="bg-white py-6 px-4 sm:p-6">
              <div>
                <h1
                  id="payment-details-heading"
                  className="text-lg leading-6 font-medium text-gray-900"
                >
                  Profile
                </h1>
              </div>

              <div className="mt-6 grid grid-cols-4 gap-6">
                <div className="col-span-4 sm:col-span-2">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-500"
                  >
                    First name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      autoComplete="cc-given-name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                      value={firstName}
                      onChange={onFirstNameChanged}
                      required
                      autoFocus
                    />
                  ) : (
                    <p className="py-2 sm:text-sm">{firstName}</p>
                  )}
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-500"
                  >
                    Last name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      autoComplete="cc-family-name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                      value={lastName}
                      onChange={onLastNameChanged}
                      required
                    />
                  ) : (
                    <p className="py-2 sm:text-sm">{lastName}</p>
                  )}
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label
                    htmlFor="email-address"
                    className="block text-sm font-medium text-gray-500"
                  >
                    Email address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email-address"
                      id="email-address"
                      autoComplete="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                      value={email}
                      onChange={onEmailChanged}
                      required
                    />
                  ) : (
                    <p className="py-2 sm:text-sm">{email}</p>
                  )}
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label
                    htmlFor="contactNo"
                    className="block text-sm font-medium text-gray-500"
                  >
                    Contact number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="contactNo"
                      id="contactNo"
                      autoComplete="contactNo"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                      value={contactNo}
                      onChange={onContactNoChanged}
                      required
                    />
                  ) : (
                    <p className="py-2 sm:text-sm">{contactNo}</p>
                  )}
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label
                    htmlFor="dob"
                    className="block text-sm font-medium text-gray-500"
                  >
                    Date of birth
                  </label>
                  {isEditing ? (
                    <DatePicker
                      className="focus:ring-gray-500 focus:border-gray-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      selected={dob}
                      onChange={onDobChanged}
                    />
                  ) : (
                    <time className="py-2 sm:text-sm">
                      {moment(dob).format("DD/MM/YYYY")}
                    </time>
                  )}
                </div>
              </div>
              <div>
                <h1
                  id="address-details-heading"
                  className="text-lg mt-12 border-t border-gray-200 py-5 leading-6 font-medium text-gray-900"
                >
                  Delivery Address
                </h1>
              </div>
              <div className="mt-6 grid grid-cols-4 gap-6">
                <div className="col-span-4 sm:col-span-2">
                  <label
                    htmlFor="receiverName"
                    className="block text-sm font-medium text-gray-500"
                  >
                    Address Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="receiverName"
                      id="receiverName"
                      autoComplete="receiverName"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                      value={receiverName}
                      onChange={onReceiverNameChanged}
                    />
                  ) : (
                    <p className="py-3 sm:text-sm">{receiverName}</p>
                  )}
                </div>
                <div className="col-span-2 sm:col-span-2">
                  <label
                    htmlFor="receiverContact"
                    className="block text-sm font-medium text-gray-500"
                  >
                    Contact
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="receiverContact"
                      id="receiverContact"
                      autoComplete="receiverContact"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                      value={deliveryCon}
                      onChange={onDeliveryConChanged}
                    />
                  ) : (
                    <p className="py-3 sm:text-sm">{deliveryCon}</p>
                  )}
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label
                    htmlFor="street1"
                    className="block text-sm font-medium text-gray-500"
                  >
                    Street / Building
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="street1"
                      id="street1"
                      autoComplete="street1"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                      value={street1}
                      onChange={onStreet1Changed}
                    />
                  ) : (
                    <p className="py-3 sm:text-sm">{street1}</p>
                  )}
                </div>
                <div className="col-span-4 sm:col-span-1">
                  <label
                    htmlFor="street2"
                    className="block text-sm font-medium text-gray-500"
                  >
                    Unit No.
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="street2"
                      id="street2"
                      autoComplete="street2"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                      value={street2}
                      onChange={onStreet2Changed}
                    />
                  ) : (
                    <p className="py-3 sm:text-sm">{street2}</p>
                  )}
                </div>
                <div className="col-span-4 sm:col-span-1">
                  <label
                    htmlFor="zip"
                    className="block text-sm font-medium text-gray-500"
                  >
                    Zip/ Postal Code
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="zip"
                      id="zip"
                      autoComplete="zip"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                      value={zip}
                      onChange={onZipChanged}
                    />
                  ) : (
                    <p className="py-3 sm:text-sm">{zip}</p>
                  )}
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-500"
                  >
                    Country
                  </label>
                  {isEditing ? (
                    // <input
                    //   type="text"
                    //   name="country"
                    //   id="country"
                    //   autoComplete="country"
                    //   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    //   value={country}
                    //   onChange={onCountryChanged}
                    // />
                    <select
                      id="countries"
                      name="countries"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                      value={country}
                      onChange={onCountryChanged}
                    >
                      {countries.map((country, index) => (
                        <option key={index} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="py-3 sm:text-sm">{country}</p>
                  )}
                </div>
                <div className="col-span-4 sm:col-span-1">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-500"
                  >
                    City
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      id="city"
                      autoComplete="city"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                      value={city}
                      onChange={onCityChanged}
                    />
                  ) : (
                    <p className="py-3 sm:text-sm">{city}</p>
                  )}
                </div>
                <div className="col-span-4 sm:col-span-1">
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-500"
                  >
                    State / Province
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="state"
                      id="state"
                      autoComplete="state"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                      placeholder="Optional"
                      value={state}
                      onChange={onStateChanged}
                    />
                  ) : (
                    <p className="py-3 sm:text-sm">{state ? state : "-"}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              {isEditing && (
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="ml-3 bg-gray-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                {isEditing ? "Save" : "Edit"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};
