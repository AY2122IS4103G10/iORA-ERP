import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { login, refreshTokenJwt } from "../../../../stores/slices/userSlice";

export function Auth() {
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
          console.log("token refreshed");
          localStorage.setItem("accessToken", data.accessToken);
          location.pathname === "/" &&
            data?.username !== null &&
            navigate("/home");
        })
        .catch((err) => {
          addToast(`Error: ${err.message}`, {
            appearance: "error",
            autoDismiss: true,
          });
          localStorage.removeItem("refreshToken");
          location.pathname !== "/" && navigate("/");
        });
    } else {
      location.pathname !== "/" && navigate("/");
    }
  }, [location, dispatch, navigate, refreshToken, addToast]);

  return <Outlet />;
}
