// Servicio base para llamadas a la API protegida con JWT
import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Cambia si tu backend usa otro puerto

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar el token JWT automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;