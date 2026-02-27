import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { useEffect, useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  // Very subtle active state, similar to Gucci
  const navLinkClasses = ({ isActive }) =>
    `text-text-main hover:text-primary uppercase text-[11px] tracking-[2px] font-body transition-colors relative ${
      isActive
        ? "text-primary before:content-[''] before:absolute before:-bottom-1 before:left-1/4 before:w-1/2 before:h-[1px] before:bg-primary"
        : ''
    }`;

  const mobileNavLinkClasses = ({ isActive }) =>
    `block py-2 text-text-main hover:text-primary uppercase text-sm tracking-widest ${isActive ? 'text-primary' : ''}`;

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-700 flex items-center ${
        scrolled ? 'bg-bg-body/95 backdrop-blur-md border-b border-text-main/5 h-20' : 'bg-transparent h-20 md:h-28'
      }`}>
      <div className="w-full px-6 md:px-12 flex justify-between items-center relative z-50">
        {/* Left: Logo */}
        <NavLink to="/" className="flex flex-col group" onClick={() => setIsOpen(false)}>
          <span className="font-heading text-xl md:text-3xl text-text-main uppercase tracking-[0.15em] leading-[0.9]">
            Distrito
          </span>
          <span className="font-heading text-base md:text-xl text-primary italic tracking-widest leading-none font-light pl-[2px]">
            Gourmet
          </span>
        </NavLink>

        {/* Right: Cart & Menu Toggle */}
        <div className="flex items-center gap-6 md:gap-10">
          <NavLink
            to="/cart"
            onClick={() => setIsOpen(false)}
            className="relative flex items-center group transition-colors text-text-main"
            title="Selección">
            <span className="uppercase text-[10px] tracking-[4px] font-body font-bold hidden md:block mr-2 group-hover:text-primary transition-colors">
              Selección
            </span>
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform group-hover:text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            {totalItems() > 0 && (
              <span className="absolute -top-2 -right-3 bg-text-main text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-body ring-1 ring-white">
                {totalItems()}
              </span>
            )}
          </NavLink>

          <button
            className="flex items-center gap-3 text-text-main hover:text-primary transition-colors cursor-pointer group"
            onClick={toggleMenu}>
            <span className="uppercase text-[10px] tracking-[4px] font-body font-bold hidden md:block group-hover:text-primary transition-colors">
              {isOpen ? 'Cerrar' : 'Menú'}
            </span>
            <div className="text-2xl group-hover:scale-110 transition-transform">{isOpen ? <HiX /> : <HiMenu />}</div>
          </button>
        </div>
      </div>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-0 left-0 w-full h-screen bg-bg-surface flex flex-col items-center justify-center">
            {/* Decorative Grid Lines */}
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-text-main/5 -translate-x-1/2 z-0 hidden md:block"></div>
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-text-main/5 -translate-y-1/2 z-0 hidden md:block"></div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex flex-col items-center gap-12 text-center w-full max-w-5xl px-4 overflow-y-auto max-h-screen py-20 pb-24 md:py-0">
              <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-8 md:gap-0 mt-8 md:mt-0">
                {/* Main Links */}
                <div className="flex flex-col items-center md:items-end gap-6 md:gap-10 md:pr-24 md:border-r border-text-main/10 w-full">
                  <span className="block text-text-muted text-[10px] uppercase tracking-[4px] mb-2 font-body font-bold">
                    / Navegación
                  </span>
                  <NavLink
                    to="/menu"
                    className="text-4xl sm:text-5xl md:text-6xl font-heading text-text-main hover:text-primary hover:italic transition-all duration-300"
                    onClick={() => setIsOpen(false)}>
                    La Carta
                  </NavLink>
                  <NavLink
                    to="/reservations"
                    className="text-4xl sm:text-5xl md:text-6xl font-heading text-text-main hover:text-primary hover:italic transition-all duration-300"
                    onClick={() => setIsOpen(false)}>
                    Reservas
                  </NavLink>
                  <NavLink
                    to="/contact"
                    className="text-4xl sm:text-5xl md:text-6xl font-heading text-text-main hover:text-primary hover:italic transition-all duration-300"
                    onClick={() => setIsOpen(false)}>
                    Contacto
                  </NavLink>
                </div>

                {/* Auth/User Links */}
                <div className="flex flex-col items-center md:items-start gap-6 md:gap-8 md:pl-24 w-full justify-center">
                  <span className="block text-text-muted text-[10px] uppercase tracking-[4px] mb-2 font-body font-bold">
                    / Acceso Privado
                  </span>
                  {isAuthenticated() ? (
                    <>
                      {isAdmin() && (
                        <NavLink
                          to="/admin"
                          className="text-2xl sm:text-3xl font-heading text-text-main hover:text-primary transition-colors"
                          onClick={() => setIsOpen(false)}>
                          Administración
                        </NavLink>
                      )}
                      <NavLink
                        to="/dashboard"
                        className="text-2xl sm:text-3xl font-heading text-text-main hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}>
                        Área Personal
                      </NavLink>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="text-[10px] font-body uppercase tracking-[3px] text-text-muted hover:text-text-main transition-colors mt-6 border-b border-text-main/10 hover:border-text-main pb-1">
                        Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to="/login"
                        className="text-2xl sm:text-3xl font-heading text-text-main hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}>
                        Iniciar Sesión
                      </NavLink>
                      <NavLink
                        to="/register"
                        className="text-[10px] font-body uppercase tracking-[3px] text-text-muted hover:text-text-main transition-colors mt-6 border-b border-text-main/10 hover:border-text-main pb-1"
                        onClick={() => setIsOpen(false)}>
                        Solicitar Registro
                      </NavLink>
                    </>
                  )}
                </div>
              </div>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[4px] text-text-muted/50 font-body hidden md:block">
                Distrito Gourmet © {new Date().getFullYear()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
