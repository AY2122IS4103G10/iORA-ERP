import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import departmentPaths from "../constants/departmentPaths";

export const ADRoute = ({ children }) => {
  const user = useSelector((state) => state.user.user);
  return user.department.id === 6 ? (
    children
  ) : (
    <Navigate to={departmentPaths[user.department.id]} />
  );
};
