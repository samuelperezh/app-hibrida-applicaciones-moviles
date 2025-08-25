import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import SplashScreen from './SplashScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen isVisible={true} />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;