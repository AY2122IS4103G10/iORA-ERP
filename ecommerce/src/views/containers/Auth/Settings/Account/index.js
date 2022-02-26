import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectUser,
  updateAccount,
} from "../../../../../stores/slices/userSlice";

export const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onEmailChanged = (e) => setEmail(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onConfirmPasswordChanged = (e) => setConfirmPassword(e.target.value);

  const onSaveClicked = () => {
    dispatch(
      updateAccount({
        ...user,
        email,
        hashPass: password,
      })
    )
      .then((data) => {
        localStorage.setItem("user", JSON.stringify(data));
        alert("Successfully created account.");
        data.id !== -1 && navigate("/");
      })
      .then(() => navigate("/"));
    // .catch((error) => {
    //   if (!error.response)
    //     setSubmitError(new Error("Failed to connect to server"));
    //   if (error.response.status === 404)
    //     setSubmitError(new Error("Account already exists"));
    //   else
    //     setSubmitError(
    //       new Error("Something went wrong. Please try again later.")
    //     );
    // });
  };
  return (
    <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
      <section aria-labelledby="payment-details-heading">
        <form action="#" method="POST">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="bg-white py-6 px-4 sm:p-6">
              <div>
                <h2
                  id="payment-details-heading"
                  className="text-lg leading-6 font-medium text-gray-900"
                >
                  Account
                </h2>
              </div>

              <div className="mt-6 grid grid-cols-4 gap-6">
                <div className="col-span-4">
                  <div className="grid grid-cols-4 gap-6">
                    <div className="col-span-4 sm:col-span-2">
                      <label
                        htmlFor="email-address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email address
                      </label>
                      <input
                        type="email"
                        name="email-address"
                        id="email-address"
                        autoComplete="email"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={email}
                        onChange={onEmailChanged}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label
                    htmlFor="contactNo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="text"
                    name="contactNo"
                    id="contactNo"
                    autoComplete="contactNo"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={password}
                    onChange={onPasswordChanged}
                  />
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label
                    htmlFor="dob"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm password
                  </label>
                  <input
                    type="text"
                    name="contactNo"
                    id="contactNo"
                    autoComplete="contactNo"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={confirmPassword}
                    onChange={onConfirmPasswordChanged}
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
