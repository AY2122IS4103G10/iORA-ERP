import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { authApi } from "../../../../environments/Api";

export const PasswordForm = () => {
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const [current, setCurrent] = useState("")
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordMatch = password === confirmPassword;

  const handleChangePassword = async (e) => {
    try {
      await authApi.changePassword({ current, password });
      addToast(`Successfully changed password`, {
        appearance: "success",
        autoDismiss: true,
      });
      navigate("/account");
    } catch (err) {
      addToast(`Error: ${err.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <div className="mt-10 divide-y divide-gray-200 mx-3">
          <div className="space-y-1">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Change your password
            </h3>
            <p className="max-w-2xl text-sm text-gray-500">
              Change your password here!
            </p>
          </div>
          <div className="mt-6">
            <dl className="divide-y divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">
                  Current password
                </dt>
                <div className="mt-1 sm:col-span-2">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    required
                    className="shadow-sm p-3 focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm rounded-md"
                  />
                </div>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">
                  New password
                </dt>
                <div className="mt-1 sm:col-span-2">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="shadow-sm p-3 focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm rounded-md"
                  />
                </div>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:pt-5">
                <dt className="text-sm font-medium text-gray-500">
                  Confirm password
                </dt>
                <div className="sm:col-span-2">
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="password"
                      name="confirmpassword"
                      id="confirmpassword"
                      className={
                        !passwordMatch
                          ? "block w-full p-3 pr-10 border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                          : "shadow-sm p-3 focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm rounded-md"
                      }
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      aria-invalid="true"
                      aria-describedby="email-error"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
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
              <div className="py-4 sm:py-5 flex sm:justify-end sm:gap-4 sm:border-b sm:border-gray-200">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-3 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  onClick={() => navigate("/account")}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  disabled={!passwordMatch || !password}
                  onClick={handleChangePassword}
                >
                  Save
                </button>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
