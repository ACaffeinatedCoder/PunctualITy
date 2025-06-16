// src/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ requiredRole }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
