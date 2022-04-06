import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useToasts} from "react-toast-notifications";
import DatePicker from "react-datepicker";
import moment from "moment";
import {SimpleInputGroup} from "../../../components/InputGroups/SimpleInputGroup";
import {SimpleInputBox} from "../../../components/Input/SimpleInputBox";
import {api} from "../../../../environments/Api";
import {addNewCustomer, updateExistingCustomer} from "../../../../stores/slices/customerSlice";

import "react-datepicker/dist/react-datepicker.css";
//import {set} from "immer/dist/internal";

const CustomerFormBody = ({
  isEditing,
  firstName,
  onFirstNameChanged,
  lastName,
  onLastNameChanged,
  dob,
  onDobChanged,
  email,
  onEmailChanged,
  contactNumber,
  onContactNumberChanged,
  password,
  onPasswordChanged,
  onAddCustomerClicked,
  onCancelClicked,
  membershipTier,
  onMembershipTierChanged,
  membershipPoints,
  onMembershipPointsChanged,
  storeCredit,
  onStoreCreditChanged,
  receiverName,
  onReceiverName,
  street1,
  onStreet1,
  street2,
  onStreet2,
  zip,
  onZip,
  city,
  onCity,
  state,
  onState,
  deliveryContact,
  onDeliveryContact,
  country,
  onCountry,
}) => (
  <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <h1 className="sr-only">{!isEditing ? "Add New" : "Edit"} Customer</h1>
    {/* Left column */}
    <div className="grid grid-cols-1 gap-4 lg:col-span-2">
      {/* Form */}
      <section aria-labelledby="profile-overview-title">
        <div className="rounded-lg bg-white overflow-hidden shadow">
          <form onSubmit={onAddCustomerClicked}>
            <div className="p-8 space-y-8 divide-y divide-gray-200">
              <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div>
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {!isEditing ? "Create New" : "Edit"} Customer
                    </h3>
                  </div>
                  <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                    <SimpleInputGroup
                      label="First name"
                      inputField="firstName"
                      className="sm:mt-0 sm:col-span-2">
                      <SimpleInputBox
                        type="text"
                        name="firstName"
                        id="firstName"
                        autoComplete="firstName"
                        value={firstName}
                        onChange={onFirstNameChanged}
                        required
                      />
                    </SimpleInputGroup>
                    <SimpleInputGroup
                      label="Last name"
                      inputField="lastName"
                      className="sm:mt-0 sm:col-span-2">
                      <SimpleInputBox
                        type="text"
                        name="lastName"
                        id="lastName"
                        autoComplete="lastName"
                        value={lastName}
                        onChange={onLastNameChanged}
                        required
                      />
                    </SimpleInputGroup>
                    <SimpleInputGroup
                      label="Email"
                      inputField="email"
                      className="sm:mt-0 sm:col-span-2">
                      <SimpleInputBox
                        type="text"
                        name="email"
                        id="email"
                        autoComplete="email"
                        value={email}
                        onChange={onEmailChanged}
                        required
                      />
                    </SimpleInputGroup>
                    <SimpleInputGroup
                      label="Password"
                      inputField="password"
                      className="sm:mt-0 sm:col-span-2">
                      <SimpleInputBox
                        type="password"
                        name="password"
                        id="password"
                        autoComplete="password"
                        value={password}
                        onChange={onPasswordChanged}
                        disabled={isEditing}
                        className={isEditing ? "bg-gray-200" : ""}
                      />
                    </SimpleInputGroup>
                    <SimpleInputGroup
                      label="Date of birth"
                      inputField="dob"
                      className="sm:mt-0 sm:col-span-2">
                      <DatePicker
                        className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        selected={dob}
                        onChange={onDobChanged}
                      />
                    </SimpleInputGroup>
                    <SimpleInputGroup
                      label="Contact number"
                      inputField="contactNumber"
                      className="sm:mt-0 sm:col-span-2">
                      <SimpleInputBox
                        type="text"
                        name="contactNumber"
                        id="contactNumber"
                        autoComplete="contactNumber"
                        value={contactNumber}
                        onChange={onContactNumberChanged}
                        required
                      />
                    </SimpleInputGroup>
                    <SimpleInputGroup
                      label="Membership Tier"
                      inputField="membershipTier"
                      className="sm:mt-0 sm:col-span-2">
                      <SimpleInputBox
                        type="text"
                        name="membershipTier"
                        id="membershipTier"
                        autoComplete="membershipTier"
                        value={membershipTier.name}
                        onChange={onMembershipTierChanged}
                        className="bg-gray-200"
                        disabled
                        required
                      />
                    </SimpleInputGroup>
                    <SimpleInputGroup
                      label="Membership Points"
                      inputField="membershipPoints"
                      className="sm:mt-0 sm:col-span-2">
                      <SimpleInputBox
                        type="text"
                        name="membershipPoints"
                        id="membershipPoints"
                        autoComplete="membershipPoints"
                        value={membershipPoints}
                        onChange={onMembershipPointsChanged}
                        className="bg-gray-200"
                        disabled
                      />
                    </SimpleInputGroup>
                    <SimpleInputGroup
                      label="Store Credit"
                      inputField="storeCredit"
                      className="sm:mt-0 sm:col-span-2">
                      <SimpleInputBox
                        type="text"
                        name="storeCredit"
                        id="storeCredit"
                        autoComplete="storeCredit"
                        value={storeCredit}
                        onChange={onStoreCreditChanged}
                        className="bg-gray-200"
                        disabled
                      />
                    </SimpleInputGroup>
                    <div>
                      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                        <h3 className="text-lg leading-6 font-medium mt-12 text-gray-900">
                          Delivering Address
                        </h3>
                      </div>
                      <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                        <SimpleInputGroup
                          label="Receiver Name"
                          inputField="Receiver Name"
                          className="sm:mt-0 sm:col-span-2">
                          <SimpleInputBox
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="receiverName"
                            value={receiverName}
                            onChange={onReceiverName}
                            required
                          />
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="Reciever Number"
                          inputField="Reciever Number"
                          className="sm:mt-0 sm:col-span-2">
                          <SimpleInputBox
                            type="text"
                            name="phone"
                            id="phone"
                            autoComplete="deliveryContract"
                            value={deliveryContact}
                            onChange={onDeliveryContact}
                            required
                          />
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="Street/ Building/ Road"
                          inputField="Street Name/Building/ Road"
                          className="sm:mt-0 sm:col-span-2">
                          <SimpleInputBox
                            type="text"
                            name="street1"
                            id="street1"
                            autoComplete="street1"
                            value={street1}
                            onChange={onStreet1}
                            required
                          />
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="Unit Number"
                          inputField="Unit Number"
                          className="sm:mt-0 sm:col-span-2">
                          <SimpleInputBox
                            type="text"
                            name="street2"
                            id="street2"
                            autoComplete="street2"
                            value={street2}
                            onChange={onStreet2}
                            required
                          />
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="Country"
                          inputField="country"
                          className="sm:mt-0 sm:col-span-2">
                          <SimpleInputBox
                            type="text"
                            name="country"
                            id="country"
                            autoComplete="country"
                            value={country}
                            onChange={onCountry}
                            required
                          />
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="zip"
                          inputField="zip"
                          className="sm:mt-0 sm:col-span-2">
                          <SimpleInputBox
                            type="text"
                            name="zip"
                            id="zip"
                            autoComplete="zip"
                            value={zip}
                            onChange={onZip}
                            required
                          />
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="city"
                          inputField="city"
                          className="sm:mt-0 sm:col-span-2">
                          <SimpleInputBox
                            type="text"
                            name="city"
                            id="city"
                            autoComplete="city"
                            value={city}
                            onChange={onCity}
                            required
                          />
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="state"
                          inputField="state"
                          className="sm:mt-0 sm:col-span-2">
                          <SimpleInputBox
                            type="text"
                            name="state"
                            id="state"
                            autoComplete="state"
                            value={state}
                            onChange={onState}
                          />
                        </SimpleInputGroup>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    onClick={onCancelClicked}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                    {!isEditing ? "Add" : "Save"} Customer
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
);

export const CustomerForm = ({subsys}) => {
  const {customerId} = useParams();
  const {addToast} = useToasts();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [membershipTier, setMembershipTier] = useState({name: "BASIC"});
  const [membershipPoints, setMembershipPoints] = useState("0");
  const [storeCredit, setStoreCredit] = useState("0");
  const [receiverName, setRecieverName] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [deliveryContact, setDeliveryContact] = useState("");
  const [country, setCountry] = useState("");
  const [addressID, setAddressID] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFirstNameChanged = (e) => setFirstName(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);
  const onLastNameChanged = (e) => setLastName(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onDobChanged = (e) => setDob(e);
  const onContactNumberChanged = (e) => setContactNumber(e.target.value);
  const onMembershipTierChanged = (e) => setMembershipTier(e.target.value);
  const onMembershipPointsChanged = (e) => setMembershipPoints(e.target.value);
  const onStoreCreditChanged = (e) => setStoreCredit(e.target.value);
  const onReceiverName = (e) => setRecieverName(e.target.value);
  const onStreet1 = (e) => setStreet1(e.target.value);
  const onStreet2 = (e) => setStreet2(e.target.value);
  const onZip = (e) => setZip(e.target.value);
  const onCity = (e) => setCity(e.target.value);
  const onState = (e) => setState(e.target.value);
  const onDeliveryContact = (e) => setDeliveryContact(e.target.value);
  const onCountry = (e) => setCountry(e.target.value);

  const canAdd = [firstName, lastName, dob, contactNumber, email].every(Boolean);

  const onAddCustomerClicked = (evt) => {
    evt.preventDefault();
    if (canAdd)
      if (!isEditing) {
        dispatch(
          addNewCustomer({
            firstName,
            lastName,
            dob,
            contactNumber,
            availStatus: true,
            email,
            password,
          })
        )
          .unwrap()
          .then(() => {
            addToast("Successfully added customer", {
              appearance: "success",
              autoDismiss: true,
            });
            navigate(subsys === "str" ? `/str/pos/orderPurchase` : "/sm/customers");
          })
          .catch((err) => {
            addToast(`Error: ${err.message}`, {
              appearance: "error",
              autoDismiss: true,
            });
          });
      } else {
        dispatch(
          updateExistingCustomer({
            id: customerId,
            firstName,
            lastName,
            dob,
            contactNumber,
            email,
            address: {
              id: addressID,
              name: receiverName,
              street1,
              street2,
              city,
              zip,
              state,
              country,
              phone: deliveryContact,
            },
          })
        )
          .unwrap()
          .then(() => {
            addToast("Successfully updated customer", {
              appearance: "success",
              autoDismiss: true,
            });
            navigate(`/sm/customers/${customerId}`);
          })
          .catch((err) => {
            addToast(`Error: ${err.message}`, {
              appearance: "error",
              autoDismiss: true,
            });
          });
      }
  };

  const onCancelClicked = () =>
    navigate(!isEditing ? "/sm/customers" : `/sm/customers/${customerId}`);

  useEffect(() => {
    Boolean(customerId) &&
      api.get("sam/customer/view", customerId).then((response) => {
        const {
          firstName,
          lastName,
          dob,
          contactNumber,
          email,
          membershipTier,
          membershipPoints,
          storeCredit,
          address,
        } = response.data;
        setIsEditing(true);
        setFirstName(firstName);
        setLastName(lastName);
        setDob(moment(dob).toDate());
        setContactNumber(contactNumber);
        setEmail(email);
        setMembershipTier(membershipTier);
        setMembershipPoints(membershipPoints);
        setStoreCredit(storeCredit);
        setAddressID(address.id);
        setRecieverName(address.name);
        setStreet1(address.street1);
        setStreet2(address.street2);
        setZip(address.zip);
        setCity(address.city);
        setState(address.state);
        setDeliveryContact(address.phone);
        setCountry(address.country);
      });
  }, [customerId]);

  return (
    <CustomerFormBody
      isEditing={isEditing}
      dob={dob}
      onDobChanged={onDobChanged}
      contactNumber={contactNumber}
      onContactNumberChanged={onContactNumberChanged}
      firstName={firstName}
      onFirstNameChanged={onFirstNameChanged}
      email={email}
      onEmailChanged={onEmailChanged}
      lastName={lastName}
      onLastNameChanged={onLastNameChanged}
      password={password}
      onPasswordChanged={onPasswordChanged}
      membershipTier={membershipTier}
      onMembershipTierChanged={onMembershipTierChanged}
      membershipPoints={membershipPoints}
      onMembershipPointsChanged={onMembershipPointsChanged}
      storeCredit={storeCredit}
      onStoreCreditChanged={onStoreCreditChanged}
      onAddCustomerClicked={onAddCustomerClicked}
      onCancelClicked={onCancelClicked}
      receiverName={receiverName}
      onReceiverName={onReceiverName}
      street1={street1}
      onstreet1={onStreet1}
      street2={street2}
      onstreet2={onStreet2}
      zip={zip}
      onZip={onZip}
      city={city}
      onCity={onCity}
      state={state}
      onState={onState}
      deliveryContact={deliveryContact}
      onDeliveryContact={onDeliveryContact}
      country={country}
      onCountry={onCountry}
    />
  );
};
