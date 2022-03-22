import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { authApi } from "../../../../environments/Api";
import {
  postLoginJwt,
  updateProfile,
} from "../../../../stores/slices/userSlice";

export const ProfileForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const user = useSelector((state) => state.user.user);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [usernameErr, setUsernameErr] = useState(false);

  useEffect(() => {
    setName(user?.name);
    setUsername(user?.username);
    setEmail(user?.email);
  }, [user]);

  const changeUsername = async (e) => {
    setUsername(e.target.value);
    if (e.target?.value && e.target.value !== user?.username) {
      const { data } = await authApi.isUsernameAvailable(e.target.value);
      setUsernameErr(!data);
    }
  };

  const handleUpdate = async (e) => {
    try {
      const { payload } = await dispatch(
        updateProfile({ name, username, email })
      );
      addToast(
        `Successfully updated details for employee with username ${payload.username}`,
        {
          appearance: "success",
          autoDismiss: true,
        }
      );
      dispatch(postLoginJwt(payload?.accessToken));
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
              Edit Your Profile
            </h3>
            <p className="max-w-2xl text-sm text-gray-500">
              View your personal information here!
            </p>
          </div>
          <div className="mt-6">
            <dl className="divide-y divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <div className="mt-1 sm:col-span-2">
                  <input
                    type="name"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="shadow-sm p-3 focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:pt-5">
                <dt className="text-sm font-medium text-gray-500">Username</dt>
                <div className="sm:col-span-2">
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="username"
                      name="username"
                      id="username"
                      className={
                        usernameErr
                          ? "block w-full p-3 pr-10 border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                          : "shadow-sm p-3 focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      }
                      placeholder="johndoe"
                      value={username}
                      onChange={changeUsername}
                      aria-invalid="true"
                      aria-describedby="email-error"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {usernameErr ? (
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
                  {usernameErr && (
                    <p
                      className="mt-2 text-sm text-red-600"
                      id="username-error"
                    >
                      This username is already being used.
                    </p>
                  )}
                </div>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:pt-5">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <div className="mt-1 sm:col-span-2">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="shadow-sm p-3 focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="johndoe@gmail.com"
                  />
                </div>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-b sm:border-gray-200">
                <dt className="text-sm font-medium text-gray-500">
                  Company/Department/JobTitle
                </dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="rounded-md bg-blue-50 p-4 flex">
                    <div className="flex-shrink-0">
                      <InformationCircleIcon
                        className="h-5 w-5 text-blue-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3 flex-1 md:flex md:justify-between">
                      <p className="text-sm text-blue-700">
                        To change your company, department or job title, please
                        inform the system administrator by e-mailing{" "}
                        <a href="mailto:iorasalesmail@gmail.com">
                          iorasalesmail@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                </dd>
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
                  disabled={usernameErr}
                  onClick={handleUpdate}
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
