import React, { useEffect, useState } from 'react';
import { profesorService, type Profesor } from '../services/profesorService';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

function PerfilProfesor() {
  const navigate = useNavigate();
  const [profesor, setProfesor] = useState<Profesor | null>(null);
  const [formData, setFormData] = useState<Partial<Profesor>>({});
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  useEffect(() => {
    profesorService.getPerfil()
      .then(res => {
        setProfesor(res.data);
        setFormData(res.data);
      })
      .catch(err => {
        if (err?.response?.status === 403) {
          setError('No tienes permiso para ver esta página.');
        } else if (err?.response?.status === 404) {
          setError('No se encontró el perfil.');
        } else {
          setError('No se pudo cargar el perfil');
        }
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profesor) return;
    try {
      await profesorService.update(profesor.id!, formData as Profesor);
      setSuccess('Perfil actualizado correctamente');
      setEditMode(false);
      setProfesor({ ...profesor, ...formData });
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setError('No tienes permiso para actualizar el perfil.');
      } else if (err?.response?.status === 404) {
        setError('No se encontró el perfil para actualizar.');
      } else {
        setError('Error al actualizar el perfil');
      }
    }
  };

  if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>;
  if (!profesor) return <div className="container">Cargando perfil...</div>;

  return (
    <div className="container" style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#333', marginBottom: '0.5rem' }}>
          Mi Perfil de Profesor
        </h2>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Gestiona tu información personal y profesional
        </p>
      </div>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      {!editMode ? (
        <div className="card" style={{ padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div className="form-group">
              <div style={{ fontWeight: 600, color: '#333', marginBottom: '0.5rem', display: 'block' }}>
                Nombre Completo
              </div>
              <p style={{ fontSize: '1.1rem', color: '#555', margin: 0 }}>{profesor.nombre}</p>
            </div>
            
            <div className="form-group">
              <div style={{ fontWeight: 600, color: '#333', marginBottom: '0.5rem', display: 'block' }}>
                Correo Electrónico
              </div>
              <p style={{ fontSize: '1.1rem', color: '#555', margin: 0 }}>{profesor.email}</p>
            </div>
            
            <div className="form-group">
              <div style={{ fontWeight: 600, color: '#333', marginBottom: '0.5rem', display: 'block' }}>
                Especialidad
              </div>
              <p style={{ fontSize: '1.1rem', color: '#555', margin: 0 }}>{profesor.especialidad}</p>
            </div>
            
            <div className="form-group">
              <div style={{ fontWeight: 600, color: '#333', marginBottom: '0.5rem', display: 'block' }}>
                Número de Empleado
              </div>
              <p style={{ fontSize: '1.1rem', color: '#555', margin: 0 }}>{profesor.numeroEmpleado}</p>
            </div>
            
            <div className="form-group">
              <div style={{ fontWeight: 600, color: '#333', marginBottom: '0.5rem', display: 'block' }}>
                Teléfono
              </div>
              <p style={{ fontSize: '1.1rem', color: '#555', margin: 0 }}>{profesor.telefono}</p>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => setEditMode(true)}
              style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}
            >
              ✏️ Editar Mi Perfil
            </button>
          </div>
        </div>
      ) : (
        <form className="card" style={{ padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
            Editar Mi Perfil
          </h3>
          
          <div className="form-group">
            <label htmlFor="nombre" style={{ fontWeight: 600, color: '#333', marginBottom: '0.5rem', display: 'block' }}>
              Nombre Completo
            </label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              value={formData.nombre || ''}
              onChange={handleChange}
              required
              className="form-input"
              style={{ fontSize: '1rem', padding: '0.75rem' }}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email" style={{ fontWeight: 600, color: '#333', marginBottom: '0.5rem', display: 'block' }}>
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email || ''}
              onChange={handleChange}
              required
              className="form-input"
              style={{ fontSize: '1rem', padding: '0.75rem' }}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="especialidad" style={{ fontWeight: 600, color: '#333', marginBottom: '0.5rem', display: 'block' }}>
              Especialidad
            </label>
            <input
              id="especialidad"
              type="text"
              name="especialidad"
              placeholder="Especialidad"
              value={formData.especialidad || ''}
              onChange={handleChange}
              required
              className="form-input"
              style={{ fontSize: '1rem', padding: '0.75rem' }}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="numeroEmpleado" style={{ fontWeight: 600, color: '#333', marginBottom: '0.5rem', display: 'block' }}>
              Número de Empleado
            </label>
            <input
              id="numeroEmpleado"
              type="text"
              name="numeroEmpleado"
              placeholder="Número de empleado"
              value={formData.numeroEmpleado || ''}
              onChange={handleChange}
              required
              className="form-input"
              style={{ fontSize: '1rem', padding: '0.75rem' }}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="telefono" style={{ fontWeight: 600, color: '#333', marginBottom: '0.5rem', display: 'block' }}>
              Teléfono
            </label>
            <input
              id="telefono"
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono || ''}
              onChange={handleChange}
              required
              className="form-input"
              style={{ fontSize: '1rem', padding: '0.75rem' }}
            />
          </div>
          
          <div className="flex gap-2" style={{ marginTop: '2rem', justifyContent: 'center' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
            >
              💾 Guardar Cambios
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setEditMode(false)}
              style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
            >
              ❌ Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PerfilProfesor;
