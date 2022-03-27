import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { logout, refreshTokenJwt } from "../../../../stores/slices/userSlice";

export function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const location = useLocation();
  const refreshToken =
    useSelector((state) => state.user.refreshToken) ||
    localStorage.getItem("refreshToken");

  useEffect(() => {
    if (refreshToken) {
      dispatch(refreshTokenJwt(refreshToken))
        .unwrap()
        .then(({ username }) => {
          location.pathname === "/" && username !== null && navigate("/home");
        })
        .catch((err) => {
          addToast(`Error: ${err.message}`, {
            appearance: "error",
            autoDismiss: true,
          });
          dispatch(logout());
          location.pathname !== "/" && navigate("/");
        });
    } else if (location.pathname !== "/") {
      addToast(`Error: You are not logged in`, {
        appearance: "error",
        autoDismiss: true,
      });
      dispatch(logout());
      navigate("/");
    }
  }, [location, dispatch, navigate, refreshToken, addToast]);

  return <Outlet />;
}
