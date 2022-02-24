import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  login,
  selectUser,
  selectUserLoggedIn,
} from "../../../../stores/slices/userSlice";

export function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const loggedIn = useSelector(selectUserLoggedIn);

  useEffect(() => {
    if (loggedIn) {
      dispatch(login({ username: user.username, password: user.password }))
        .unwrap()
        .then((data) => {
          location.pathname === "/" && data.id !== -1 && navigate("/home");
        })
        .catch((err) => {
          console.error(err);
          localStorage.removeItem("user");
          location.pathname !== "/" && navigate("/");
        });
    } else {
      location.pathname !== "/" && navigate("/");
    }
  }, [location]);

  return <Outlet />;
}
