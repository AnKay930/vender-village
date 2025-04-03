import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import useUserRole from "./UseUserRole";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isSignedIn } = useUser();
  const { role, loading, error } = useUserRole();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error("Role fetch error:", error);
    return <p>Error loading user role. Please try again later.</p>;
  }

  if (!isSignedIn || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
