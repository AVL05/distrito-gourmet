import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "./layouts/MainLayout";
import ScrollToTop from "./components/layout/ScrollToTop";
import SmoothScroll from "./components/layout/SmoothScroll";
import { useAuthStore } from "./store/auth";

// Vistas con Lazy Loading
const AdminView = lazy(() => import("./pages/AdminView"));
const CartView = lazy(() => import("./pages/CartView"));
const ContactView = lazy(() => import("./pages/ContactView"));
const DashboardView = lazy(() => import("./pages/DashboardView"));
const HomeView = lazy(() => import("./pages/HomeView"));
const LoginView = lazy(() => import("./pages/LoginView"));
const MenuView = lazy(() => import("./pages/MenuView"));
const RegisterView = lazy(() => import("./pages/RegisterView"));
const ReservationsView = lazy(() => import("./pages/ReservationsView"));
const ProfileView = lazy(() => import("./pages/ProfileView"));

// Componente simple de carga para Suspense
const PageLoader = () => (
  <div className="min-h-screen bg-bg-body flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <span className="text-primary text-[11px] uppercase tracking-[3px] font-body animate-pulse">
        Distrito Gourmet
      </span>
    </div>
  </div>
);

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
    <>
      <ScrollToTop />
      <SmoothScroll />
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </>
  );
};

export default App;
