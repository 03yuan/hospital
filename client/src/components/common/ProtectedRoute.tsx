import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface Props {
  children: ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const { token, loadFromStorage } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  if (!token && !localStorage.getItem('token')) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
