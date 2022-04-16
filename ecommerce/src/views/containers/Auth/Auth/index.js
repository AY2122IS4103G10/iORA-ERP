import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import {
  fetchCustomer,
  fetchCustomerByEmail,
  refreshTokenJwt,
} from "../../../../stores/slices/userSlice";

export function Auth({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const location = useLocation();
  const refreshToken = localStorage.getItem("refreshToken");

  useEffect(() => {
    if (refreshToken != null) {
      dispatch(refreshTokenJwt(refreshToken))
        .unwrap()
        .then((data) => {
          localStorage.setItem("accessToken", data.accessToken);
          location.pathname === "/login" &&
            data?.username !== null &&
            navigate("/settings/account");
          // data.username && dispatch(fetchCustomerByEmail(data.username));
        })
        .catch((err) => {
          addToast(`Error: ${err.message}`, {
            appearance: "error",
            autoDismiss: true,
          });
          localStorage.removeItem("refreshToken");
          location.pathname.startsWith("/settings") && navigate("/login");
        });
      // refreshJwt();
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) dispatch(fetchCustomer(user.id));
    } else {
      location.pathname.startsWith("/settings") && navigate("/login");
    }
  }, [location, dispatch, navigate, refreshToken, addToast]);

  return children;
}
