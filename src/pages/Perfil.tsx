import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Profesor {
  id: number;
  nombre: string;
  email: string;
  especialidad: string;
  numeroEmpleado: string;
  telefono: string;
}

const Perfil: React.FC = () => {
  const [perfil, setPerfil] = useState<Profesor | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<Profesor>('/profesores/perfil')
      .then(res => setPerfil(res.data))
      .catch(() => setError('No se pudo cargar el perfil'));
  }, []);

  if (error) return (
    <div className="container">
      <div className="alert alert-error">
        {error}
      </div>
    </div>
  );
  
  if (!perfil) return (
    <div className="container">
      <div className="text-center" style={{ padding: '2rem' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        <p>Cargando perfil...</p>
      </div>
    </div>
  );

  return (
    <div className="container">
      <h2 style={{ 
        fontSize: '2rem',
        fontWeight: '700',
        color: '#333',
        marginBottom: '2rem'
      }}>
        Mi Perfil
      </h2>
      
      <div className="card">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          <div>
            <div style={{ 
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '3rem',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {perfil.nombre.charAt(0).toUpperCase()}
              </div>
              <h3 style={{ 
                fontSize: '1.5rem',
                color: '#333',
                marginBottom: '0.5rem'
              }}>
                {perfil.nombre}
              </h3>
              <p style={{ 
                color: '#6c757d',
                fontSize: '1rem'
              }}>
                {perfil.especialidad}
              </p>
            </div>
          </div>
          
          <div>
            <h4 style={{ 
              fontSize: '1.25rem',
              color: '#333',
              marginBottom: '1.5rem',
              borderBottom: '2px solid #e9ecef',
              paddingBottom: '0.5rem'
            }}>
              Información Personal
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="info-item">
                <strong style={{ 
                  color: '#667eea',
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Correo Electrónico
                </strong>
                <p style={{ 
                  color: '#333',
                  fontSize: '1.1rem',
                  margin: 0
                }}>
                  {perfil.email}
                </p>
              </div>
              
              <div className="info-item">
                <strong style={{ 
                  color: '#667eea',
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Número de Empleado
                </strong>
                <p style={{ 
                  color: '#333',
                  fontSize: '1.1rem',
                  margin: 0
                }}>
                  {perfil.numeroEmpleado}
                </p>
              </div>
              
              <div className="info-item">
                <strong style={{ 
                  color: '#667eea',
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Teléfono
                </strong>
                <p style={{ 
                  color: '#333',
                  fontSize: '1.1rem',
                  margin: 0
                }}>
                  {perfil.telefono}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
