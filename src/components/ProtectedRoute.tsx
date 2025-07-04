import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { Rol } from '../types/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Rol;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    let redirectPath = '/usuario/dashboard'; // Default path
    
    if (user?.role === Rol.EMPRESA) {
      redirectPath = '/empresa/dashboard';
    } else if (user?.role === Rol.ADMIN) {
      redirectPath = '/admin/dashboard';
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
