import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * ProtectedRoute
 * - requiredRole: "ADMIN" | "EMPLOYEE" or undefined
 * If not authenticated => redirect to /auth/signin
 * If role mismatch => redirect to respective dashboard
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    if (!user) return <Navigate to="/auth/signin" replace />;
    if (requiredRole === "ADMIN" && user.role !== "ADMIN") {
      // Employee signed in, redirect to employee dashboard
      return <Navigate to="/dashboard" replace />;
    }
    if (requiredRole === "EMPLOYEE" && user.role !== "EMPLOYEE") {
      // Admin signed in, redirect to admin dashboard
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
