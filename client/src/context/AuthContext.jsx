import { createContext, useContext, useState } from 'react';
import { iniciarSesion } from '../servicios/api.js'

const AuthContext = createContext(null);

// Lee el campo exp del payload del JWT (no verifica la firma: eso lo hace el backend)
function tokenVencido(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' && payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function leerSesionInicial() {
  try {
    const raw = localStorage.getItem('sesion');
    if (!raw || raw === 'undefined' || raw === 'null') {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    // El JWT dura 1h: si ya venció, descartamos la sesión guardada
    if (tokenVencido(parsed.token)) {
      localStorage.removeItem('sesion');
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem('sesion');
    return null;
  }
}

export function obtenerToken() {
  const sesion = leerSesionInicial();
  return sesion?.token ?? null;
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
    usuario: sesion?.user ?? null,
    token: sesion?.token ?? null,
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