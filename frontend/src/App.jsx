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
const CookiePolicyView = lazy(() => import("./pages/CookiePolicyView"));
const DashboardView = lazy(() => import("./pages/DashboardView"));
const ForgotPasswordView = lazy(() => import("./pages/ForgotPasswordView"));
const HomeView = lazy(() => import("./pages/HomeView"));
const LegalNoticeView = lazy(() => import("./pages/LegalNoticeView"));
const LoginView = lazy(() => import("./pages/LoginView"));
const MenuView = lazy(() => import("./pages/MenuView"));
const NotFoundView = lazy(() => import("./pages/NotFoundView"));
const PrivacyPolicyView = lazy(() => import("./pages/PrivacyPolicyView"));
const RegisterView = lazy(() => import("./pages/RegisterView"));
const ReservationsView = lazy(() => import("./pages/ReservationsView"));
const ResetPasswordView = lazy(() => import("./pages/ResetPasswordView"));
const ProfileView = lazy(() => import("./pages/ProfileView"));

const PageLoader = () => (
  <div className="min-h-screen bg-bg-body flex items-center justify-center">
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border border-primary/15 rounded-full" />
        <div className="absolute inset-0 border-t border-primary rounded-full animate-spin" />
      </div>
      <span className="text-text-muted text-[10px] uppercase tracking-[4px] font-body">
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
            <Route path="forgot-password" element={<ForgotPasswordView />} />
            <Route path="reset-password" element={<ResetPasswordView />} />
            <Route path="menu" element={<MenuView />} />
            <Route path="reservations" element={<ReservationsView />} />
            <Route path="cart" element={<CartView />} />
            <Route path="contact" element={<ContactView />} />
            <Route path="legal" element={<LegalNoticeView />} />
            <Route path="privacy" element={<PrivacyPolicyView />} />
            <Route path="cookies" element={<CookiePolicyView />} />

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
            <Route path="*" element={<NotFoundView />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
