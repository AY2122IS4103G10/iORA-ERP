import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {CheckCircleIcon, XIcon} from "@heroicons/react/solid";

const AlertSuccessful = () => {
  return (
    <div className="rounded-md bg-green-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800">An email as been sent to</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600">
              <span className="sr-only">Dismiss</span>
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function ResetPassword() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setStatus = true;
    console.log("s");
  };

  return (
    <>
      <div className=" min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img className="mx-auto h-12 w-auto" src="android-chrome-512x512.png" alt="iORA" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">iORA ERP</h2>
          <p className="mt-2 text-center text-sm text-gray-600"></p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-cyan border py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6">
              <div>
                <h1 className="font-bold text-black-600 text-center text-2xl">Account Recovery</h1>
                <h3 className="font-normal mt-2 pb-10 text-gray-600 text-center text-base">
                  Reset password through email account.
                </h3>
                {status === true ? <AlertSuccessful /> : ""}
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  onClick={handleReset}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                  Reset Password
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="/" className="font-medium text-cyan-600 hover:text-cyan-500">
                    {"< Return to login"}
                  </a>
                </div>
              </div>
            </form>
            <div className="mt-6"></div>
          </div>
        </div>
      </div>
    </>
  );
}
