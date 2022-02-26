import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, updateAccount } from "../../../../../stores/slices/userSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const user = useSelector(selectUser);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [contactNo, setContactNo] = useState(user.contactNumber);
  const [dob, setDob] = useState(user.dob);

  const onFirstNameChanged = (e) => setFirstName(e.target.value);
  const onLastNameChanged = (e) => setLastName(e.target.value);
  const onContactNoChanged = (e) => setContactNo(e.target.value);
  const onDobChanged = (date) => setDob(date);

  const onSaveClicked = () => {
    dispatch(updateAccount({
      ...user,
      firstName,
      lastName,
      dob,
      contactNumber: contactNo,
    }))
      .then((data) => {
        // data.password = password;
        localStorage.setItem("user", JSON.stringify(data));
        setFirstName("");
        setLastName("");
        setContactNo("");
        setDob("");
        alert("Successfully created account.");
        data.id !== -1 && navigate("/");
      })
      // .then(() => navigate("/"))
  }
  return (
    <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
      <section aria-labelledby="payment-details-heading">
        <form onSubmit={onSaveClicked}>
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="bg-white py-6 px-4 sm:p-6">
              <div>
                <h2
                  id="payment-details-heading"
                  className="text-lg leading-6 font-medium text-gray-900"
                >
                  Profile
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-4 gap-6">
                <div className="col-span-4 sm:col-span-2">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="cc-given-name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={firstName}
                    onChange={onFirstNameChanged}
                  />
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="cc-family-name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={lastName}
                    onChange={onLastNameChanged}
                  />
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label
                    htmlFor="contactNo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Contact number
                  </label>
                  <input
                    type="text"
                    name="contactNo"
                    id="contactNo"
                    autoComplete="contactNo"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={contactNo}
                    onChange={onContactNoChanged}
                  />
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label
                    htmlFor="dob"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date of birth
                  </label>
                  <DatePicker
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    selected={dob}
                    onChange={onDobChanged}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};