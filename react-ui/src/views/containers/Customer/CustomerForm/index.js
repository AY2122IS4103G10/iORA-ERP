import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";
import { SimpleTextArea } from "../../../components/Input/SimpleTextArea";
import { SimpleModal } from "../../../components/Modals/SimpleModal";

import { api } from "../../../../environments/Api";
import SimpleSelectMenu from "../../../components/SelectMenus/SimpleSelectMenu";
import {
  addNewCustomer,
  updateExistingCustomer,
} from "../../../../stores/slices/customerSlice";

const CustomerFormBody = ({
  isEditing,
  firstName,
  onFirstNameChanged,
  lastName,
  onLastNameChanged,
  dob,
  onDobChanged,
  availStatus,
  onAvailStatusChanged,
  email,
  onEmailChanged,
  contactNumber,
  onContactNumberChanged,
  password,
  onPasswordChanged,
  onAddCustomerClicked,
  onCancelClicked,
  membershipPoints,
  onMembershipPointsChanged,
  storeCredit,
  onStoreCreditChanged,
}) => (
  <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <h1 className="sr-only">Create New Customer</h1>
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
                        label="Customer Name"
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
                        label="Available Status"
                        inputField="availStatus"
                        className="sm:mt-0 sm:col-span-2"
                      >
                        <SimpleInputBox
                          type="text"
                          name="availStatus"
                          id="availStatus"
                          autoComplete="availStatus"
                          value={availStatus}
                          onChange={onAvailStatusChanged}
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
                        label="Last Name"
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
                        label="Password"
                        inputField="password"
                        className="sm:mt-0 sm:col-span-2"
                      >
                        <SimpleInputBox
                          type="text"
                          name="password"
                          id="password"
                          autoComplete="password"
                          value={password}
                          onChange={onPasswordChanged}
                          required
                        />
                      </SimpleInputGroup>
                      <SimpleInputGroup
                        label="Date of Birth"
                        inputField="dob"
                        className="sm:mt-0 sm:col-span-2"
                      >
                        <SimpleInputBox
                          type="text"
                          name="dob"
                          id="dob"
                          autoComplete="dob"
                          value={dob}
                          onChange={onDobChanged}
                          required
                        />
                      </SimpleInputGroup>
                      <SimpleInputGroup
                        label="Contact Number"
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
                          required
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
                          required
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
                      {!isEditing ? "Add" : "Save"} customer
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
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [dob, setDob] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [availStatus, setAvailStatus] = useState("");
  const [email, setEmail] = useState("");
  const [active, setActive] = useState(false);
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [membershipPoints, setMembershipPoints] = useState("");
  const [storeCredit, setStoreCredit] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFirstNameChanged = (e) => setFirstName(e.target.value);
  const onAvailStatusChanged = (e) => setAvailStatus(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);
  const onLastNameChanged = (e) => setLastName(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onDobChanged = (e) => setDob(e.target.value);
  const onContactNumberChanged = (e) => setContactNumber(e.target.value);
  const onMembershipPointsChanged = (e) => setMembershipPoints(e.target.value);
  const onStoreCreditChanged = (e) => setStoreCredit(e.target.value);

  const [requestStatus, setRequestStatus] = useState("idle");
  const canAdd =
    [
      firstName,
      storeCredit,
      availStatus,
      email,
      lastName,
      password,
      dob,
      contactNumber,
      membershipPoints,
    ].every(Boolean) && requestStatus === "idle";

  const onAddCustomerClicked = (evt) => {
    evt.preventDefault();
    if (canAdd)
      try {
        setRequestStatus("pending");
        if (!isEditing) {
          dispatch(
            addNewCustomer({
              firstName,
              availStatus,
              email,
              lastName,
              password,
              dob,
              contactNumber,
              membershipPoints,
              storeCredit,
            })
          ).unwrap();
        } else {
          dispatch(
            updateExistingCustomer({
              firstName,
              storeCredit,
              availStatus,
              email,
              lastName,
              password,
              dob,
              contactNumber,
              membershipPoints,
            })
          ).unwrap();
        }
        alert("Successfully added customer");
        setFirstName("");
        navigate(!isEditing ? "/crm/customer" : `/crm/customer/${customerId}`);
      } catch (err) {
        console.error("Failed to add customer: ", err);
      } finally {
        setRequestStatus("idle");
      }
  };

  const onCancelClicked = () =>
    navigate(!isEditing ? "/crm/customer" : `/crm/customer/${customerId}`);

  useEffect(() => {
    Boolean(customerId) &&
      api.get("admin/viewCustomer", customerId).then((response) => {
        const {
          firstName,
          membershipPoints,
          availStatus,
          email,
          lastName,
          password,
          dob,
          contactNumber,
          storeCredit,
        } = response.data;
        setIsEditing(true);
        setFirstName(firstName);
        setStoreCredit,(storeCredit);
        setAvailStatus(availStatus);
        setEmail(email);
        setLastName(lastName);
        setPassword(password);
        setDob(dob);
        setContactNumber(contactNumber);
        setMembershipPoints(membershipPoints);
        setActive(active);
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
      availStatus={availStatus}
      onAvailStatusChanged={onAvailStatusChanged}
      email={email}
      onEmailChanged={onEmailChanged}
      lastName={lastName}
      onLastNameChanged={onLastNameChanged}
      password={password}
      onPasswordChanged={onPasswordChanged}
      membershipPoints={membershipPoints}
      onMembershipPointsChanged={onMembershipPointsChanged}
      storeCredit={storeCredit}
      onStoreCreditChanged={onStoreCreditChanged}
      onAddCustomerClicked={onAddCustomerClicked}
      onCancelClicked={onCancelClicked}
    />
  );
};
