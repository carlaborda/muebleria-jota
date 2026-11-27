import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, soloAdmin = false }) {
  const { usuario } = useAuth();
  const location = useLocation();

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }
  if (soloAdmin && usuario.rol !== 'admin') {
    return <p className="error">Necesitás ser administrador para ver esta página.</p>;
  }
  return children;
}