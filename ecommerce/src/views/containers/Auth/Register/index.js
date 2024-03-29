import { useDispatch } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import DatePicker from "react-datepicker";
import { useToasts } from "react-toast-notifications";
import { classNames } from "../../../../utilities/Util";
import { register } from "../../../../stores/slices/userSlice";

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState(null);
  const { addToast } = useToasts();

  const onEmailChanged = (e) => setEmail(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onConfirmPasswordChanged = (e) => setConfirmPassword(e.target.value);
  const onFirstNameChanged = (e) => setFirstName(e.target.value);
  const onLastNameChanged = (e) => setLastName(e.target.value);
  const onContactNoChanged = (e) => setContactNo(e.target.value);
  const onDobChanged = (date) => setDob(date);

  const canRegister = [
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    contactNo,
    dob,
  ].every(Boolean);
  const onSaveClicked = (evt) => {
    evt.preventDefault();
    if (canRegister) {
      if (password !== confirmPassword)
        setError(new Error("Passwords do not match."));
      // else if (
      //   !password.match(
      //     "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      //   )
      // )
      //   setError(
      //     new Error(
      //       "Passwords must be minimum eight characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character."
      //     )
      //   );
      else
        dispatch(
          register({
            firstName,
            lastName,
            email,
            dob,
            contactNumber: contactNo,
            password,
          })
        )
          .unwrap()
          .then((data) => {
            // localStorage.setItem("user", JSON.stringify(data));
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setFirstName("");
            setLastName("");
            setContactNo("");
            setDob("");
            addToast("Welcome to iORA! Please log in to your account.", {
              appearance: "success",
              autoDismiss: true,
            });
            data.id !== -1 && navigate("/login");
          })
          .catch((error) => {
            addToast(`Error: ${error.message}`, {
              appearance: "error",
              autoDismiss: true,
            });
          });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="android-chrome-512x512.png"
          alt="iORA"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            key="login"
            to="/login"
            className="font-medium text-gray-600 hover:text-gray-500"
          >
            log in
          </Link>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={onSaveClicked}>
            <div className="space-y-8 divide-y divide-gray-200">
              <div>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Account Information
                  </h3>
                </div>
                <div className="mt-6">
                  <label
                    htmlFor="input"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={onEmailChanged}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                      autoComplete="email"
                      autoFocus
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 ">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={onPasswordChanged}
                      className={classNames(
                        !error
                          ? "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                          : "block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                      )}
                      required
                    />
                    {error && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon
                          className="h-5 w-5 text-red-500"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600" id="input-error">
                      {error.message}
                    </p>
                  )}
                </div>
                <div className="mt-6">
                  <label
                    htmlFor="input"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-1 relative rounded-md">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="current-password"
                      value={confirmPassword}
                      onChange={onConfirmPasswordChanged}
                      className={classNames(
                        !error
                          ? "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                          : "block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                      )}
                      required
                    />
                    {error && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon
                          className="h-5 w-5 text-red-500"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600" id="input-error">
                      {error.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-8 divide-y divide-gray-200">
              <div>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Personal Information
                  </h3>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First name
                    </label>
                    <div className="mt-1 relative rounded-md">
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="firstName"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                        value={firstName}
                        onChange={onFirstNameChanged}
                        required
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last name
                    </label>
                    <div className="mt-1">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="lastName"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                        value={lastName}
                        onChange={onLastNameChanged}
                        required
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="contactNo"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Contact number
                    </label>
                    <div className="mt-1">
                      <input
                        id="contactNo"
                        name="contactNo"
                        type="text"
                        autoComplete="contactNo"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                        value={contactNo}
                        onChange={onContactNoChanged}
                        required
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="dob"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date of birth
                    </label>
                    <div className="mt-1">
                      <DatePicker
                        className="focus:ring-gray-500 focus:border-gray-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        selected={dob}
                        onChange={onDobChanged}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-base font-medium text-gray-600 hover:text-gray-500"
          >
            <span aria-hidden="true"> &larr;</span> Back to store
          </Link>
        </div>
      </div>
    </div>
  );
};
