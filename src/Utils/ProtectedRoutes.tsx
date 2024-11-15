import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserProvider";

export default function ProtectedRoutes() {
  const userContext = useContext(UserContext);

  if (!userContext || !userContext.token) {
    return <Navigate to="/login" />;
  }

  const { token } = userContext;

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
