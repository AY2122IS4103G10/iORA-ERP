import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  login,
} from "../../../../stores/slices/userSlice";

export function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user && user.username !== "" && user.password !== "") {
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
