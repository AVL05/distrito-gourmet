import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';

// Layout principal que incluye la navegación, el contenido de la página y el pie de página
const MainLayout = () => {
  // Obtenemos la ruta actual para saber en qué página estamos
  const location = useLocation();

  // Comprobamos si estamos en una página de administración (ej. /admin) para ocultar elementos si es necesario
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    // Contenedor principal que ocupa toda la pantalla (min-h-screen)
    <div className="flex flex-col min-h-screen bg-bg-body text-text-main font-body">
      {/* Barra de navegación superior */}
      <Navbar />

      {/* Contenedor central donde se cargan las distintas páginas (Outlet) */}
      <main className="flex-grow pt-24 px-4 md:px-0">
        <Outlet key={location.pathname} />
      </main>

      {/* Pie de página, que se oculta si estamos en el panel de administración */}
      <div className="bg-bg-body z-10">{!isAdminPage && <Footer />}</div>
    </div>
  );
};

export default MainLayout;
