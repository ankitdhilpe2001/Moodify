import { Navigate } from "react-router";
import { useAuth } from "../hook/use.auth";
import AuthLoading from "./AuthLoading";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <AuthLoading />;
  }

  return user ? <Navigate to="/home" replace /> : children;
};

export default PublicRoute;
