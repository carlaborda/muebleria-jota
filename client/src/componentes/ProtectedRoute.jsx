import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// La sesión se restaura de forma sincrónica desde localStorage al crear el AuthProvider,
// así que en el primer render ya sabemos si hay usuario y no hay redirecciones falsas al recargar.
export default function ProtectedRoute({ children, soloAdmin = false }) {
  const { usuario } = useAuth();
  const location = useLocation();

  // Sin sesión: al login, recordando a dónde quería ir
  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }
  // Con sesión pero sin rol de administrador: al inicio
  if (soloAdmin && usuario.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}