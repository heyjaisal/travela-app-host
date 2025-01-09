// src/components/utils/PublicRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const role = useSelector((state) => state.auth.role);

  // If the user is logged in (has a role), redirect them to the home page
  if (role) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;
