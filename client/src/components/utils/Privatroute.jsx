import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Privatroute = ({ children, allowedRoles }) => {
  const role = useSelector((state) => state.auth.role);

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Privatroute;
