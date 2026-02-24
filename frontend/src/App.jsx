import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { useAuthStore } from "./store/auth";
import AdminView from "./pages/AdminView";
import CartView from "./pages/CartView";
import ContactView from "./pages/ContactView";
import DashboardView from "./pages/DashboardView";
import HomeView from "./pages/HomeView";
import LoginView from "./pages/LoginView";
import MenuView from "./pages/MenuView";
import RegisterView from "./pages/RegisterView";
import ReservationsView from "./pages/ReservationsView";
import ProfileView from "./pages/ProfileView";

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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomeView />} />
          <Route path="login" element={<LoginView />} />
          <Route path="register" element={<RegisterView />} />
          <Route path="menu" element={<MenuView />} />
          <Route path="reservations" element={<ReservationsView />} />
          <Route path="cart" element={<CartView />} />
          <Route path="contact" element={<ContactView />} />

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
    </BrowserRouter>
  );
};

export default App;
