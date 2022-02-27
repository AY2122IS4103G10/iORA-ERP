import { Navigate } from "react-router-dom";

export const PublicRoute = ({ children }) =>
  !localStorage.getItem("user") ? children : <Navigate to="/" />;
