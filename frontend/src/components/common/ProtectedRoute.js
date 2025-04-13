import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children, role }) => {
  const { isLoggedIn, userRole } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (role && role !== userRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
