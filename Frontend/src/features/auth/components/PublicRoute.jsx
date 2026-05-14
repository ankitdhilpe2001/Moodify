import { Navigate } from "react-router";
import { useAuth } from "../hook/use.auth";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return user ? <Navigate to="/home" replace /> : children;
};

export default PublicRoute;
