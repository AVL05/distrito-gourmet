import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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
import AnimatedPage from './components/animations/AnimatedPage';
import Preloader from './components/animations/Preloader';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const { isAuthenticated, isAdmin } = useAuthStore();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const location = useLocation();

  return (
    <>
      <Preloader />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<MainLayout />}>
            <Route
              index
              element={
                <AnimatedPage>
                  <HomeView />
                </AnimatedPage>
              }
            />
            <Route
              path="login"
              element={
                <AnimatedPage>
                  <LoginView />
                </AnimatedPage>
              }
            />
            <Route
              path="register"
              element={
                <AnimatedPage>
                  <RegisterView />
                </AnimatedPage>
              }
            />
            <Route
              path="menu"
              element={
                <AnimatedPage>
                  <MenuView />
                </AnimatedPage>
              }
            />
            <Route
              path="reservations"
              element={
                <AnimatedPage>
                  <ReservationsView />
                </AnimatedPage>
              }
            />
            <Route
              path="cart"
              element={
                <AnimatedPage>
                  <CartView />
                </AnimatedPage>
              }
            />
            <Route
              path="contact"
              element={
                <AnimatedPage>
                  <ContactView />
                </AnimatedPage>
              }
            />

            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <AnimatedPage>
                    <DashboardView />
                  </AnimatedPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <AnimatedPage>
                    <ProfileView />
                  </AnimatedPage>
                </ProtectedRoute>
              }
            />

            <Route
              path="admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AnimatedPage>
                    <AdminView />
                  </AnimatedPage>
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default App;
