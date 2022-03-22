import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { authApi } from "../../../../environments/Api";
import { loginJwt, postLoginJwt } from "../../../../stores/slices/userSlice";

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [resetPassword, setResetPassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { addToast } = useToasts();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = dispatch(
        loginJwt({ username: username, password: password })
      );
      const data = await response.unwrap();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      const postLogin = dispatch(postLoginJwt(data.accessToken));
      const user = await postLogin.unwrap();
      localStorage.setItem("user", JSON.stringify(user));
      setUsername("");
      setPassword("");
      addToast("Login Successful", {
        appearance: "success",
        autoDismiss: true,
      });
      if (user.id !== -1) {
        navigate("/home");
      }
    } catch (err) {
      addToast(`Error: ${err.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const { data } = await authApi.resetPassword({ email, username });
      addToast(
        `Password was successfuly reset. ${data} Check your e-mail for temporary password`,
        {
          appearance: "success",
          autoDismiss: true,
        }
      );
      setResetPassword(false);
    } catch (err) {
      addToast(`Error: ${err.response.data}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    setProcessing(false);
  };

  return (
    <>
      <div className=" min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="android-chrome-512x512.png"
            alt="iORA"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            iORA ERP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600"></p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white border py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form
              className="space-y-6"
              onSubmit={resetPassword ? handleReset : handleLogin}
            >
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="username"
                    autoComplete="username"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              {resetPassword ? (
                <>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Enter your recovery and work e-mail for verification.
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex sm:grid sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => setResetPassword(false)}
                      type="button"
                      className="inline-flex justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full flex justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                      disabled={processing}
                    >
                      {processing ? (
                        <p className="animate-bounce">
                          Processing...
                        </p>
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    >
                      Login
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex-grow" />
                    <div className="text-sm">
                      <button
                        type="a"
                        onClick={() => setResetPassword(true)}
                        className="font-medium text-cyan-600 hover:text-cyan-500"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  </div>
                </>
              )}
            </form>

            <div className="mt-6"></div>
          </div>
        </div>
      </div>
    </>
  );
}
