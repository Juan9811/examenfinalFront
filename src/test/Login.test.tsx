
// Mock localStorage ANTES de cualquier import
const setItemMock = vi.fn();
const getItemMock = vi.fn();
const removeItemMock = vi.fn();
const clearMock = vi.fn();

Object.defineProperty(window, 'localStorage', {
  value: {
    setItem: setItemMock,
    getItem: getItemMock,
    removeItem: removeItemMock,
    clear: clearMock,
  },
  writable: true,
});

import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';

// Mock API ANTES de importar cualquier módulo que lo use
vi.mock('../services/api', () => ({
  default: {
    post: vi.fn()
  }
}));

import api from '../services/api';
const apiPostMock = api.post as ReturnType<typeof vi.fn>;

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form correctly', () => {
    renderLogin();
    expect(screen.getByText('Bienvenido')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/usuario/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('should handle successful login', async () => {
    const user = userEvent.setup();
    const mockLoginResponse = {
      data: {
        token: 'fake-jwt-token',
        rol: 'ADMIN',
        usuario: 'admin'
      }
    };
    
    // Mock successful API response
    apiPostMock.mockResolvedValue(mockLoginResponse);
    
    renderLogin();
    
    // Llenar el formulario
    await user.type(screen.getByPlaceholderText(/usuario/i), 'admin');
    await user.type(screen.getByPlaceholderText(/contraseña/i), 'password123');
    
    // Enviar formulario
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    // Verificar que se llamó al API
    await waitFor(() => {
      expect(apiPostMock).toHaveBeenCalledWith('/auth/login', { 
        usuario: 'admin', 
        contrasena: 'password123' 
      });
    });
    
    // Verificar que se guardó el token en localStorage
    await waitFor(() => {
      expect(setItemMock).toHaveBeenCalledWith('token', 'fake-jwt-token');
      expect(setItemMock).toHaveBeenCalledWith('rol', 'ADMIN');
      expect(setItemMock).toHaveBeenCalledWith('usuario', 'admin');
    });
    
    // Verificar que se navega a la página correcta
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/profesores');
    });
  });

  it('should handle login failure', async () => {
    const user = userEvent.setup();
    
    // Mock failed API response with error
    apiPostMock.mockResolvedValue({
      data: {
        error: 'Credenciales incorrectas'
      }
    });
    
    renderLogin();
    
    // Llenar el formulario
    await user.type(screen.getByPlaceholderText(/usuario/i), 'wronguser');
    await user.type(screen.getByPlaceholderText(/contraseña/i), 'wrongpass');
    
    // Enviar formulario
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    // Verificar que se muestra el mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/credenciales incorrectas/i)).toBeInTheDocument();
    });
    
    // Verificar que NO se navega
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
// Archivo de pruebas limpiado para nuevas pruebas de frontend (login, editar objeto)
