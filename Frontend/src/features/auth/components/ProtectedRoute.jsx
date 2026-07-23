import { Navigate } from "react-router";
import { useAuth } from "../hook/use.auth";
import AuthLoading from "./AuthLoading";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <AuthLoading />;
  }

  return user ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
