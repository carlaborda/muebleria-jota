import { createContext, useContext, useState } from 'react';
import { iniciarSesion } from '../servicios/api.js'

const AuthContext = createContext(null);

function leerSesionInicial() {
  try {
    const raw = localStorage.getItem('sesion');
    if (!raw || raw === 'undefined' || raw === 'null') {
      return null;
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    localStorage.removeItem('sesion');
    return null;
  }
}

export function AuthProvider({ children }) {
  // La sesión es lo que devuelve el login: { token, usuario }. Sin sesión: null.
  const [sesion, setSesion] = useState(leerSesionInicial);

  async function login(email, password) {
    const datos = await iniciarSesion({ email, password });
    localStorage.setItem('sesion', JSON.stringify(datos));
    setSesion(datos);
    return datos;
  }

  function logout() {
    localStorage.removeItem('sesion');
    setSesion(null);
  }

  const valor = {
    usuario: sesion ? sesion.usuario : null,
    token: sesion ? sesion.token : null,
    sesion,
    login,
    logout,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return contexto;
}