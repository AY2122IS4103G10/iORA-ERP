import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) =>
  !localStorage.getItem("user") ? children : <Navigate to="/" />;
