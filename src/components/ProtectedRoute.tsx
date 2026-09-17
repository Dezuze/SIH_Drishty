import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: ('customer' | 'farmer' | 'driver' | 'admin')[];
  requiredRole?: 'customer' | 'farmer' | 'driver' | 'admin';
  redirectTo?: string;
  allowGuest?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  requiredRole,
  redirectTo,
  allowGuest = false
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 text-emerald-400">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-slate-600">Authenticating Kisan Drishti Session...</p>
      </div>
    );
  }

  // If guests are allowed and user is not authenticated, let them through
  if (allowGuest && !isAuthenticated) {
    return children;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const effectiveRoles = allowedRoles || (requiredRole ? [requiredRole] : undefined);

  if (effectiveRoles && effectiveRoles.length > 0) {
    const userRole = user?.role || 'customer';
    const hasRole = effectiveRoles.includes(userRole as any) || userRole === 'admin';

    if (!hasRole) {
      if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
      }
      // Intelligent role-based fallback redirect
      if (userRole === 'driver') {
        return <Navigate to="/driver" replace />;
      } else if (userRole === 'farmer') {
        return <Navigate to="/profile" replace />;
      } else {
        return <Navigate to="/tracking" replace />;
      }
    }
  }

  return children;
};

