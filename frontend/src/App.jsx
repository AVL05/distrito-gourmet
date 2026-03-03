import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { useAuthStore } from './store/auth';
import AdminView from './pages/AdminView';
import CartView from './pages/CartView';
import ContactView from './pages/ContactView';
import DashboardView from './pages/DashboardView';
import HomeView from './pages/HomeView';
import LoginView from './pages/LoginView';
import MenuView from './pages/MenuView';
import RegisterView from './pages/RegisterView';
import ReservationsView from './pages/ReservationsView';
import ProfileView from './pages/ProfileView';

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children, requireAdmin }) => {
  const { isAuthenticated, isAdmin } = useAuthStore();

  // Si no está logueado, redirigir al login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere admin y no lo es, redirigir al inicio
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Rutas públicas */}
        <Route index element={<HomeView />} />
        <Route path="login" element={<LoginView />} />
        <Route path="register" element={<RegisterView />} />
        <Route path="menu" element={<MenuView />} />
        <Route path="reservations" element={<ReservationsView />} />
        <Route path="cart" element={<CartView />} />
        <Route path="contact" element={<ContactView />} />

        {/* Rutas protegidas (requieren login) */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardView />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfileView />
            </ProtectedRoute>
          }
        />

        {/* Ruta de admin (requiere login + rol admin) */}
        <Route
          path="admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminView />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
