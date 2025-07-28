import api from './api';

export interface Usuario {
  id?: number;
  usuario: string;
  email: string;
  rol: string;
}

export interface Profesor {
  id?: number;
  nombre: string;
  email: string;
  especialidad: string;
  numeroEmpleado: string;
  telefono: string;
  usuario?: Usuario | string; // Puede ser objeto Usuario o string para el formulario
  contrasena?: string;
}

export const profesorService = {
  // Listar todos los profesores (solo admin)
  getAll: () => api.get<Profesor[]>('/profesores'),
  
  // Crear profesor (solo admin)
  create: (profesor: Profesor) => api.post<Profesor>('/profesores', profesor),
  
  // Actualizar profesor (admin o el propio profesor)
  update: (id: number, profesor: Profesor) => api.put<Profesor>(`/profesores/${id}`, profesor),
  
  // Eliminar profesor (solo admin)
  delete: (id: number) => api.delete(`/profesores/${id}`),
  
  // Obtener perfil propio
  getPerfil: () => api.get<Profesor>('/profesores/perfil')
};
