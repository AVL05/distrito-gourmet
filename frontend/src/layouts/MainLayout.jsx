import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';

// Layout principal que envuelve todas las páginas con Navbar, Footer y transiciones
const MainLayout = () => {
  const location = useLocation();

  // Ocultar Footer en páginas de administración
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-bg-body text-text-main font-body">
      <Navbar />
      <main className="flex-grow pt-24 px-4 md:px-0">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      <div className="bg-bg-body z-10">{!isAdminPage && <Footer />}</div>
    </div>
  );
};

export default MainLayout;
