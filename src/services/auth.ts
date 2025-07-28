import api from './api';

export async function login(usuario: string, password: string) {
  const response = await api.post<{ token: string; rol: string; error?: string }>('/auth/login', { usuario, contrasena: password });
  
  // Si la respuesta contiene un error, lanzar excepción
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  
  if (response.data?.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('rol', response.data.rol);
    localStorage.setItem('usuario', usuario);
  } else {
    throw new Error('No se recibió token de autenticación');
  }
  
  return response.data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('rol');
  localStorage.removeItem('usuario');
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

export function getRol() {
  return localStorage.getItem('rol');
}
