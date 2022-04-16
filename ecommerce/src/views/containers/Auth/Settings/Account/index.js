import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/outline";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { api } from "../../../../../environments/Api";
import { logout, selectUser } from "../../../../../stores/slices/userSlice";
import { classNames } from "../../../../../utilities/Util";

export const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { addToast } = useToasts();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordMatch = newPassword === confirmPassword;

  const onSaveClicked = (evt) => {
    evt.preventDefault();
    const resetPassword = async () => {
      try {
        await api.create(
          `online/profile/password/${user.id}/${password}/${newPassword}`
        );
        addToast("Successfully updated password. Please login again.", {
          appearance: "success",
          autoDismiss: true,
        });
        dispatch(logout());
        navigate("/login");
      } catch (error) {
        addToast(`Error: ${error.response.data}`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    };
    resetPassword();
  };
  return (
    <>
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
                    Change password
                  </h2>
                </div>

                <div className="mt-6 grid grid-cols-4 gap-6">
                  <div className="col-span-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-1">
                        <label
                          htmlFor="email-address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Current password
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          placeholder="Enter your current password."
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <label
                      htmlFor="email-address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New password
                    </label>
                    <input
                      type="password"
                      name="new-password"
                      id="new-password"
                      placeholder="Enter new password."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <div className="relative">
                      <label
                        htmlFor="email-address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Confirm password
                      </label>
                      <input
                        type="password"
                        name="password-confirm"
                        id="password-confirm"
                        placeholder="Confirm new password."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={classNames(
                          !passwordMatch
                            ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-gray-500 focus:border-gray-500",
                          "mt-1 block w-full border rounded-md shadow-sm py-2 px-3 sm:text-sm focus:outline-none"
                        )}
                      />
                      <div className="absolute mt-6 inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {!passwordMatch ? (
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <CheckCircleIcon
                            className="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </div>
                    {!passwordMatch && (
                      <p
                        className="mt-2 text-sm text-red-600"
                        id="password-error"
                      >
                        Passwords do not match
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  className="bg-gray-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};
