import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getRol } from '../services/auth';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const rol = getRol();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ 
      background: 'white',
      padding: '1rem 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '2rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container">
        <div className="flex justify-between align-center">
          <h3 style={{ 
            color: '#333',
            fontSize: '1.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Sistema de Profesores
          </h3>
          <div className="flex align-center gap-2">
            {rol === 'ADMIN' && (
              <Link 
                to="/profesores" 
                className="btn btn-secondary mr-2"
                style={{ textDecoration: 'none' }}
              >
                Profesores
              </Link>
            )}
            <Link 
              to="/perfil" 
              className="btn btn-secondary mr-2"
              style={{ textDecoration: 'none' }}
            >
              Mi Perfil
            </Link>
            <button onClick={handleLogout} className="btn btn-danger">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
