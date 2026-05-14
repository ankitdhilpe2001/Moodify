import { Navigate } from "react-router";
import { useAuth } from "../hook/use.auth";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return user ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
