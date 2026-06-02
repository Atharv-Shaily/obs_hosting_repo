import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps a route and redirects unauthenticated users to /auth.
 * Passes the current path as `?returnTo=` so AuthPage can redirect
 * back after a successful login.
 *
 * While the auth state is still loading (token being validated), renders
 * nothing to avoid a flash of the login page.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null; // Prevents redirect flash during token validation
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth"
        state={{ returnTo: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
