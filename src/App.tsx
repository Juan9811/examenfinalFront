import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Profesores from './pages/Profesores';
import PerfilProfesor from './pages/PerfilProfesor';
import Navbar from './components/Navbar';
import { isAuthenticated, getRol } from './services/auth';
import './App.css';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  const rol = getRol();
  const isAuth = isAuthenticated();
  return (
    <Router>
      {/* Mostrar Navbar solo si está autenticado y no en /login */}
      {isAuth && window.location.pathname !== '/login' && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/profesores"
          element={
            <PrivateRoute>
              <Profesores />
            </PrivateRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <PerfilProfesor />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to={isAuth ? (rol === 'ADMIN' ? '/profesores' : '/perfil') : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;
