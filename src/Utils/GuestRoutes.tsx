import { useContext, ReactElement } from "react";
import { UserContext } from "./UserProvider";
import { Navigate } from "react-router-dom";

interface GuestRoutesProps {
  element: ReactElement;
}

export default function GuestRoutes({ element }: GuestRoutesProps) {
  const { token } = useContext(UserContext) ?? {};

  return token ? <Navigate to="/" replace /> : element;
}
