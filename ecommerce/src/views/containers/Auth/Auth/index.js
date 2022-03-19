import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { refreshTokenJwt } from "../../../../stores/slices/userSlice";

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
        })
        .catch((err) => {
          addToast(`Error: ${err.message}`, {
            appearance: "error",
            autoDismiss: true,
          });
          localStorage.removeItem("refreshToken");
          location.pathname !== "/login" && navigate("/login");
        });
    } else {
      location.pathname !== "/login" && navigate("/login");
    }
  }, [location, dispatch, navigate, refreshToken, addToast]);

  return children;
}
