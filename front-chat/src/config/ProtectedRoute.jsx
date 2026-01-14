import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const admin = JSON.parse(sessionStorage.getItem("admin"));

  if (adminOnly) {
    return admin ? children : <Navigate to="/login/admin" />;
  }

  return user ? children : <Navigate to="/login/user" />;
};

export default ProtectedRoute;
