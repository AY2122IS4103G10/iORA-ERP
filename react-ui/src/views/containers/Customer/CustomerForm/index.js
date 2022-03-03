import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import DatePicker from "react-datepicker";

import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";
import { api } from "../../../../environments/Api";
import {
  addNewCustomer,
  updateExistingCustomer,
} from "../../../../stores/slices/customerSlice";

import "react-datepicker/dist/react-datepicker.css";

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
}) => (
  <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <h1 className="sr-only">{!isEditing ? "Add New" : "Edit"} Customer</h1>
    {/* Main 3 column grid */}
    <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
      {/* Left column */}
      <div className="grid grid-cols-1 gap-4 lg:col-span-2">
        {/* Form */}
        <section aria-labelledby="profile-overview-title">
          <div className="rounded-lg bg-white overflow-hidden shadow">
            <form>
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
                        className="sm:mt-0 sm:col-span-2"
                      >
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
                        className="sm:mt-0 sm:col-span-2"
                      >
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
                        className="sm:mt-0 sm:col-span-2"
                      >
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
                        className="sm:mt-0 sm:col-span-2"
                      >
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
                        className="sm:mt-0 sm:col-span-2"
                      >
                        <DatePicker
                          className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                          selected={dob}
                          onChange={onDobChanged}
                        />
                      </SimpleInputGroup>
                      <SimpleInputGroup
                        label="Contact number"
                        inputField="contactNumber"
                        className="sm:mt-0 sm:col-span-2"
                      >
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
                        className="sm:mt-0 sm:col-span-2"
                      >
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
                        className="sm:mt-0 sm:col-span-2"
                      >
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
                        className="sm:mt-0 sm:col-span-2"
                      >
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
                    </div>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                      onClick={onCancelClicked}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                      onClick={onAddCustomerClicked}
                    >
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
  </div>
);

export const CustomerForm = () => {
  const { customerId } = useParams();
  const { addToast } = useToasts();
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

  const canAdd = [firstName, lastName, dob, contactNumber, email].every(
    Boolean
  );

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
            navigate("/sm/customers");
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
        } = response.data;
        setIsEditing(true);
        setFirstName(firstName);
        setLastName(lastName);
        setDob(dob);
        setContactNumber(contactNumber);
        setEmail(email);
        setMembershipTier(membershipTier);
        setMembershipPoints(membershipPoints);
        setStoreCredit(storeCredit);
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
    />
  );
};
