import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Checking authentication...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content if authenticated
  return <Outlet />;
};

export default ProtectedRoute;


