import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../authContext/useAuth";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;