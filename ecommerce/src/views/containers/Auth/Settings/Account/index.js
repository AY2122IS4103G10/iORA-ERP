import { ExclamationCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  selectUser,
  updateAccount,
} from "../../../../../stores/slices/userSlice";
import { classNames } from "../../../../../utilities/Util";

export const Account = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const { addToast } = useToasts();

  const onEmailChanged = (e) => setEmail(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onConfirmPasswordChanged = (e) => setConfirmPassword(e.target.value);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const canSave = () => {
    if (password) return email && password && confirmPassword;
    else return email;
  };

  const onSaveClicked = (evt) => {
    evt.preventDefault();
    if (canSave) {
      if (password !== confirmPassword)
        setError(new Error("Passwords do not match."));
      else
        dispatch(
          updateAccount({
            ...user,
            email,
            // hashPass: password,
          })
        )
          .then((data) => {
            setEmail(data.email)
            addToast("Successfully updated account.", {
              appearance: "success",
              autoDismiss: true,
            });
          })
          .catch((error) => {
            // if (!error.response)
            //   setSubmitError(new Error("Failed to connect to server"));
            // if (error.response.status === 404)
            //   setSubmitError(new Error("Email address already in use"));
            // else
            //   setSubmitError(
            //     new Error("Something went wrong. Please try again later.")
            //   );
            addToast(`Error: ${error.message}`, {
              appearance: "error",
              autoDismiss: true,
            });
          });
    }
  };
  return (
    <>
      {/* {submitError && (
        <div className="py-4">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon
                  className="h-5 w-5 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  There were errors when attempting to create your account.
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {submitError.message}
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
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
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* <div className="relative col-span-4 sm:col-span-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      autoComplete="password"
                      className={classNames(
                        !error
                          ? "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          : "block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                      )}
                      value={password}
                      onChange={onPasswordChanged}
                    />
                    {error && (
                      <>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        </div>
                        <p
                          className="mt-2 text-sm text-red-600"
                          id="input-error"
                        >
                          {error.message}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="relative col-span-4 sm:col-span-2">
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm password
                    </label>
                    <input
                      type="password"
                      name="confirm-password"
                      id="confirm-password"
                      autoComplete="confirm-password"
                      className={classNames(
                        !error
                          ? "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          : "block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                      )}
                      value={confirmPassword}
                      onChange={onConfirmPasswordChanged}
                    />
                    {error && (
                      <>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        </div>
                        <p
                          className="mt-2 text-sm text-red-600"
                          id="input-error"
                        >
                          {error.message}
                        </p>
                      </>
                    )}
                  </div> */}
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
