import React, { useEffect, useState } from 'react';
import { profesorService, type Profesor } from '../services/profesorService';
import { getRol } from '../services/auth';

const Profesores: React.FC = () => {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProfesor, setEditingProfesor] = useState<Profesor | null>(null);
  const [formData, setFormData] = useState<Profesor>({
    nombre: '',
    email: '',
    especialidad: '',
    numeroEmpleado: '',
    telefono: '',
    usuario: '', // Mantener como string para el formulario
    contrasena: ''
  });
  const rol = getRol();

  useEffect(() => {
    if (rol === 'ADMIN') {
      loadProfesores();
    }
  }, [rol]);

  // Auto-limpiar mensajes después de 5 segundos
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Verificar permisos de admin DESPUÉS de los hooks
  if (rol !== 'ADMIN') {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <div className="alert alert-error">
          <h3>Acceso Denegado</h3>
          <p>No tienes permiso para ver esta página. Solo los administradores pueden gestionar profesores.</p>
        </div>
      </div>
    );
  }

  const loadProfesores = () => {
    setError(''); // Limpiar errores previos
    profesorService.getAll()
      .then(res => {
        console.log('Respuesta GET /profesores:', res.data);
        // Soporta ambos formatos: array directo o { profesores: [...] }
        if (Array.isArray(res.data)) {
          setProfesores(res.data);
        } else if (res.data && Array.isArray((res.data as any).profesores)) {
          setProfesores((res.data as any).profesores);
        } else {
          setProfesores([]);
        }
      })
      .catch(() => setError('No se pudo cargar la lista de profesores'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos
    setSuccess(''); // Limpiar éxitos previos
    try {
      if (editingProfesor) {
        // No enviar usuario ni contrasena al editar
        const { usuario, contrasena, ...profData } = formData;
        await profesorService.update(editingProfesor.id!, profData);
        setSuccess('Profesor actualizado correctamente');
      } else {
        await profesorService.create(formData);
        setSuccess('Profesor creado correctamente');
      }
      loadProfesores();
      resetForm();
    } catch (err: any) {
      // Mostrar mensaje del backend si existe
      if (err?.response?.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data));
      } else {
        setError('Error al guardar el profesor');
      }
    }
  };

  const handleEdit = (profesor: Profesor) => {
    setEditingProfesor(profesor);
    // Convertir el usuario object a string para el formulario
    const formProfesor = {
      ...profesor,
      usuario: typeof profesor.usuario === 'object' ? profesor.usuario.usuario : profesor.usuario || ''
    };
    setFormData(formProfesor);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este profesor?')) {
      setError(''); // Limpiar errores previos
      setSuccess(''); // Limpiar éxitos previos
      try {
        await profesorService.delete(id);
        setProfesores(profesores.filter(p => p.id !== id));
        setSuccess('Profesor eliminado correctamente');
      } catch (err: any) {
        if (err?.response?.status === 403) {
          setError('No tienes permiso para eliminar este profesor. Puede que sea un usuario protegido o tu propio usuario.');
        } else if (err?.response?.status === 404) {
          setError('No se encontró el profesor a eliminar.');
        } else {
          setError('Error al eliminar el profesor');
        }
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      especialidad: '',
      numeroEmpleado: '',
      telefono: '',
      usuario: '',
      contrasena: ''
    });
    setEditingProfesor(null);
    setShowForm(false);
    setError(''); // Limpiar mensajes de error
    setSuccess(''); // Limpiar mensajes de éxito
  };

  return (
    <div className="container">
      <div className="flex justify-between align-center mb-3">
        <h2 style={{ 
          fontSize: '2rem',
          fontWeight: '700',
          color: '#333'
        }}>
          Gestión de Profesores
        </h2>
        <button 
          onClick={() => setShowForm(true)} 
          className="btn btn-primary"
        >
          + Agregar Profesor
        </button>
      </div>
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}
      {showForm && (
        <div className="card mb-3" style={{ 
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 6px 30px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.8rem',
              marginBottom: '0.5rem',
              color: '#333',
              fontWeight: '700'
            }}>
              {editingProfesor ? '✏️ Editar Profesor' : '➕ Agregar Nuevo Profesor'}
            </h3>
            <p style={{ color: '#666', margin: 0 }}>
              {editingProfesor ? 'Modifica la información del profesor' : 'Completa todos los campos para registrar un nuevo profesor'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Información Personal */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ 
                fontSize: '1.2rem', 
                color: '#333', 
                marginBottom: '1rem',
                borderBottom: '2px solid #f8f9fa',
                paddingBottom: '0.5rem'
              }}>
                👤 Información Personal
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="nombre" style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600', 
                    color: '#333' 
                  }}>
                    Nombre Completo
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    placeholder="Ej: Juan Pérez García"
                    value={formData.nombre}
                    onChange={e => setFormData({...formData, nombre: e.target.value})}
                    required
                    className="form-input"
                    style={{ fontSize: '1rem', padding: '0.75rem' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600', 
                    color: '#333' 
                  }}>
                    Correo Electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Ej: juan.perez@universidad.edu"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required
                    className="form-input"
                    style={{ fontSize: '1rem', padding: '0.75rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Información Profesional */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ 
                fontSize: '1.2rem', 
                color: '#333', 
                marginBottom: '1rem',
                borderBottom: '2px solid #f8f9fa',
                paddingBottom: '0.5rem'
              }}>
                🎓 Información Profesional
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="especialidad" style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600', 
                    color: '#333' 
                  }}>
                    Especialidad
                  </label>
                  <input
                    id="especialidad"
                    type="text"
                    placeholder="Ej: Ingeniería de Software"
                    value={formData.especialidad}
                    onChange={e => setFormData({...formData, especialidad: e.target.value})}
                    required
                    className="form-input"
                    style={{ fontSize: '1rem', padding: '0.75rem' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="numeroEmpleado" style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600', 
                    color: '#333' 
                  }}>
                    Número de Empleado
                  </label>
                  <input
                    id="numeroEmpleado"
                    type="text"
                    placeholder="Ej: EMP-2024-001"
                    value={formData.numeroEmpleado}
                    onChange={e => setFormData({...formData, numeroEmpleado: e.target.value})}
                    required
                    className="form-input"
                    style={{ fontSize: '1rem', padding: '0.75rem' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telefono" style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600', 
                    color: '#333' 
                  }}>
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    placeholder="Ej: +1 234 567 8900"
                    value={formData.telefono}
                    onChange={e => setFormData({...formData, telefono: e.target.value})}
                    required
                    className="form-input"
                    style={{ fontSize: '1rem', padding: '0.75rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Información de Acceso (solo para crear) */}
            {!editingProfesor && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ 
                  fontSize: '1.2rem', 
                  color: '#333', 
                  marginBottom: '1rem',
                  borderBottom: '2px solid #f8f9fa',
                  paddingBottom: '0.5rem'
                }}>
                  🔐 Credenciales de Acceso
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="usuario" style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600', 
                      color: '#333' 
                    }}>
                      Usuario para Login
                    </label>
                    <input
                      id="usuario"
                      type="text"
                      placeholder="Ej: juan.perez"
                      value={typeof formData.usuario === 'string' ? formData.usuario : ''}
                      onChange={e => setFormData({...formData, usuario: e.target.value})}
                      required={!editingProfesor}
                      className="form-input"
                      style={{ fontSize: '1rem', padding: '0.75rem' }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contrasena" style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600', 
                      color: '#333' 
                    }}>
                      Contraseña
                    </label>
                    <input
                      id="contrasena"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.contrasena}
                      onChange={e => setFormData({...formData, contrasena: e.target.value})}
                      required={!editingProfesor}
                      className="form-input"
                      style={{ fontSize: '1rem', padding: '0.75rem' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #e9ecef'
            }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ 
                  fontSize: '1rem', 
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  fontWeight: '600'
                }}
              >
                {editingProfesor ? '💾 Actualizar Profesor' : '➕ Crear Profesor'}
              </button>
              <button 
                type="button" 
                onClick={resetForm} 
                className="btn btn-secondary"
                style={{ 
                  fontSize: '1rem', 
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  fontWeight: '600'
                }}
              >
                ❌ Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de profesores minimalista */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.2rem',
        marginTop: '2rem',
      }}>
        {profesores.map(prof => (
          <div key={prof.id} style={{
            background: '#fff',
            border: '1px solid #ececec',
            borderRadius: '10px',
            padding: '1.2rem 1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.7rem',
            minHeight: 180,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#222' }}>{prof.nombre}</div>
              {typeof prof.usuario === 'object' && prof.usuario?.usuario && (
                <span style={{ fontSize: '0.95rem', color: '#888', background: '#f5f5f5', borderRadius: 6, padding: '2px 10px' }}>
                  @{prof.usuario.usuario}
                </span>
              )}
            </div>
            <div style={{ color: '#666', fontSize: '0.97rem', display: 'flex', flexWrap: 'wrap', gap: '0.7rem' }}>
              <span>{prof.email}</span>
              <span style={{ color: '#bbb' }}>|</span>
              <span>{prof.especialidad}</span>
            </div>
            <div style={{ color: '#aaa', fontSize: '0.93rem', display: 'flex', gap: '1.2rem' }}>
              <span>N°: <b style={{ color: '#444' }}>{prof.numeroEmpleado}</b></span>
              <span>Tel: <b style={{ color: '#444' }}>{prof.telefono}</b></span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
              <button
                onClick={() => handleEdit(prof)}
                className="btn btn-secondary"
                style={{
                  fontSize: '0.95rem',
                  padding: '0.4rem 1.2rem',
                  borderRadius: '6px',
                  background: '#f5f5f5',
                  color: '#222',
                  border: 'none',
                  boxShadow: 'none',
                  transition: 'background 0.2s',
                }}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(prof.id!)}
                className="btn btn-danger"
                style={{
                  fontSize: '0.95rem',
                  padding: '0.4rem 1.2rem',
                  borderRadius: '6px',
                  background: '#f9f9f9',
                  color: '#c00',
                  border: 'none',
                  boxShadow: 'none',
                  transition: 'background 0.2s',
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {profesores.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '2.5rem',
          background: '#fafbfc',
          borderRadius: '10px',
          border: '1.5px dashed #e0e0e0',
          color: '#bbb',
          marginTop: '2rem',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👨‍🏫</div>
          <h3 style={{ color: '#aaa', marginBottom: '0.5rem' }}>No hay profesores registrados</h3>
          <p style={{ color: '#bbb', margin: 0 }}>Haz clic en "Agregar Profesor" para comenzar.</p>
        </div>
      )}
    </div>
  );
};

export default Profesores;
