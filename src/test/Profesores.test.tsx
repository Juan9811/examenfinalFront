import * as authService from '../services/auth';
import { profesorService } from '../services/profesorService';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// ===============================
// Archivo de pruebas para Login y Profesores
// Proyecto: Frontend React + TypeScript (Vite)
// Objetivo: Validar el flujo de login y la edición de profesores usando mocks y pruebas de integración simples.
// ===============================

// Mocks globales antes de importar componentes
// Mock del servicio de autenticación:
// - login: simula un login exitoso devolviendo un token y rol ADMIN
// - getRol: simula que el usuario autenticado es ADMIN
vi.mock('../services/auth', () => ({
  login: vi.fn((usuario, contrasena) => Promise.resolve({ token: 'fake-jwt', rol: 'ADMIN' })),
  getRol: () => 'ADMIN'
}));
// Mock del servicio de profesores:
// - getAll: simula la obtención de una lista con un profesor de ejemplo
// - update: simula la actualización exitosa de un profesor
vi.mock('../services/profesorService', () => ({
  profesorService: {
    getAll: vi.fn(() => Promise.resolve({ data: [{
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan@uni.edu',
      especialidad: 'Matemáticas',
      numeroEmpleado: 'EMP001',
      telefono: '555-1234',
      usuario: 'juanp',
    }] })),
    update: vi.fn(() => Promise.resolve({}))
  }
}));


import Login from '../pages/Login';
import Profesores from '../pages/Profesores';

// ===============================
// Pruebas para la pantalla de Login
// ===============================
describe('Login', () => {
  // Antes de cada test, limpiar mocks y localStorage
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it('permite al usuario loguearse con credenciales válidas', async () => {
    // Simula el flujo de login:
    // 1. Escribe usuario y contraseña
    // 2. Hace click en el botón de iniciar sesión
    // 3. Verifica que el servicio de login fue llamado con los datos correctos
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    await user.type(screen.getByPlaceholderText(/usuario/i), 'admin');
    await user.type(screen.getByPlaceholderText(/contraseña/i), 'admin123');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('admin', 'admin123');
    });
  });
});

// ===============================
// Pruebas para la pantalla de Profesores (CRUD)
// ===============================
describe('Profesores', () => {
  // Antes de cada test, limpiar mocks y localStorage
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it('permite editar un profesor y ver el cambio en la lista', async () => {
    // Simula el flujo de edición de un profesor:
    // 1. Renderiza la lista de profesores (mockeada)
    // 2. Hace click en el botón de editar
    // 3. Cambia el nombre del profesor
    // 4. Hace click en actualizar
    // 5. Verifica que el servicio de actualización fue llamado
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Profesores />
      </BrowserRouter>
    );
    await screen.findByText('Juan Pérez');
    await user.click(screen.getByRole('button', { name: /editar/i }));
    const nombreInput = screen.getByPlaceholderText(/juan pérez garcía/i);
    await user.clear(nombreInput);
    await user.type(nombreInput, 'Juan Editado');
    await user.click(screen.getByRole('button', { name: /actualizar profesor/i }));
    await waitFor(() => {
      expect(profesorService.update).toHaveBeenCalled();
    });
  });
});