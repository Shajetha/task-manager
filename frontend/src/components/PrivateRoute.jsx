import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3, borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
    </div>
  );
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}