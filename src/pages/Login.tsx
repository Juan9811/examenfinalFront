import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('Intentando login con:', { usuario, password });
    
    try {
      const result = await login(usuario, password);
      console.log('Login exitoso:', result);
      
      // Redirigir según el rol del usuario
      if (result.rol === 'ADMIN') {
        navigate('/profesores');
      } else {
        navigate('/perfil');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-3">
          <h2 style={{ 
            color: '#333', 
            marginBottom: '0.5rem',
            fontSize: '2rem',
            fontWeight: '700'
          }}>
            Bienvenido
          </h2>
          <p style={{ color: '#6c757d', fontSize: '16px' }}>
            Inicia sesión en tu cuenta
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
          
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
