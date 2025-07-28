import { useAuth } from './context/AuthContext';
import { useLocation } from 'react-router-dom';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Profesores from './pages/Profesores';
import PerfilProfesor from './pages/PerfilProfesor';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import './App.css';


const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, role } = useAuth();
  const isAuth = !!token && !!role;
  return isAuth ? children : <Navigate to="/login" />;
};


function AppRoutes() {
  const { token, role } = useAuth();
  const location = useLocation();
  const isAuth = !!token && !!role;
  return (
    <>
      {/* Mostrar Navbar solo si está autenticado y no en /login */}
      {isAuth && location.pathname !== '/login' && <Navbar />}
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
        <Route path="/" element={<Navigate to={isAuth ? (role === 'ADMIN' ? '/profesores' : '/perfil') : '/login'} />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
