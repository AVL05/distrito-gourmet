import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DURATION, EASING } from '@/motion';

/**
 * Navbar premium inspirado en:
 * - Gucci Osteria: Logo centrado, hamburguesa minimalista de 3 líneas animadas
 * - Lucky Folks: Panel overlay con números romanos, color de fondo contrastante
 * - Adachi: Overlay a pantalla completa, tipografía serif grande, X para cerrar
 */
const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll para cambiar estilo del navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloquear scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Números romanos para los links (estilo Lucky Folks)
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

  // ─── Variantes de animación ─────────────────────────────────────

  // Overlay: cortina que baja desde arriba
  const overlayVariants = {
    hidden: {
      clipPath: 'inset(0 0 100% 0)',
    },
    visible: {
      clipPath: 'inset(0 0 0% 0)',
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      clipPath: 'inset(0 0 100% 0)',
      transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
    },
  };

  // Contenedor de links con stagger
  const navContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.4,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.04,
        staggerDirection: -1,
      },
    },
  };

  // Cada link individual
  const navItemVariants = {
    hidden: { opacity: 0, y: 40, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] },
    },
  };

  // Info inferior con fade
  const bottomInfoVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  // Links principales de navegación
  const mainLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/menu', label: 'La Carta' },
    { to: '/reservations', label: 'Reservas' },
    { to: '/contact', label: 'Contacto' },
  ];

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          BARRA SUPERIOR FIJA
          Estilo Gucci: Logo centrado, hamburguesa a la derecha
          ═══════════════════════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 w-full z-[60] transition-all duration-700 flex items-center ${
          scrolled
            ? 'bg-bg-body/95 backdrop-blur-md border-b border-text-main/5 h-16 md:h-20'
            : 'bg-transparent h-20 md:h-28'
        }`}>
        <div className="w-full px-6 md:px-12 flex justify-between items-center">
          {/* Carrito — izquierda */}
          <NavLink
            to="/cart"
            onClick={closeMenu}
            className="relative flex items-center group transition-colors text-text-main z-[70]"
            title="Selección">
            <svg
              className="w-[18px] h-[18px] group-hover:scale-110 transition-transform group-hover:text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <AnimatePresence>
              {totalItems() > 0 && (
                <motion.span
                  key="cart-badge"
                  initial={shouldReduceMotion ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: DURATION.fast, ease: EASING.smooth }}
                  className="absolute -top-2 -right-3 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-body font-bold">
                  {totalItems()}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>

          {/* Logo — centrado (estilo Gucci Osteria) */}
          <NavLink
            to="/"
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group z-[70]"
            onClick={closeMenu}>
            <span className="font-heading text-lg md:text-2xl text-text-main uppercase tracking-[0.25em] leading-none">
              Distrito
            </span>
            <span className="font-heading text-[10px] md:text-xs text-primary italic tracking-[0.3em] leading-none mt-[2px]">
              Gourmet
            </span>
          </NavLink>

          {/* Hamburguesa custom — derecha (3 líneas animadas estilo Gucci) */}
          <button
            className="flex flex-col items-end justify-center gap-[5px] w-8 h-8 cursor-pointer group z-[70]"
            onClick={toggleMenu}
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}>
            <motion.span
              className="block h-[1.5px] bg-text-main origin-right transition-colors group-hover:bg-primary"
              animate={isOpen ? { width: '24px', rotate: -45, y: 0, x: 2 } : { width: '24px', rotate: 0, y: 0, x: 0 }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.span
              className="block h-[1.5px] bg-text-main transition-colors group-hover:bg-primary"
              animate={isOpen ? { width: 0, opacity: 0 } : { width: '16px', opacity: 1 }}
              transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.span
              className="block h-[1.5px] bg-text-main origin-right transition-colors group-hover:bg-primary"
              animate={isOpen ? { width: '24px', rotate: 45, y: 0, x: 2 } : { width: '20px', rotate: 0, y: 0, x: 0 }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            />
          </button>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          OVERLAY DE NAVEGACIÓN A PANTALLA COMPLETA
          Inspirado en Adachi (fullscreen + imagen) + Lucky Folks (numeración)
          ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="nav-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[55] bg-text-main overflow-hidden">
            {/* Imagen de fondo con opacidad baja (estilo Adachi) */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-[0.07] grayscale"
              style={{ backgroundImage: "url('/sala_de_restaurante .png')" }}
            />

            {/* Patrón decorativo de líneas (estilo Lucky Folks) */}
            <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-white/5 hidden md:block" />
            <div className="absolute top-0 bottom-0 left-2/3 w-[1px] bg-white/5 hidden md:block" />
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/5 hidden md:block" />

            {/* Contenido del overlay */}
            <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-16 pt-28 md:pt-32 pb-8 md:pb-12">
              {/* ─── Links principales ─── */}
              <motion.nav
                variants={navContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-1 md:gap-2"
                style={{ perspective: '600px' }}>
                {mainLinks.map((link, i) => (
                  <motion.div key={link.to} variants={navItemVariants} className="group">
                    <NavLink
                      to={link.to}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-baseline gap-4 md:gap-8 py-2 md:py-3 transition-all duration-300 ${
                          isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                        }`
                      }>
                      {/* Número romano (estilo Lucky Folks) */}
                      <span className="font-body text-[10px] md:text-[11px] text-primary tracking-[0.2em] w-6 md:w-8 shrink-0 font-bold">
                        {romanNumerals[i]}
                      </span>
                      {/* Texto del link */}
                      <span className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-bg-body uppercase tracking-wider leading-none group-hover:text-primary transition-colors duration-500 group-hover:italic">
                        {link.label}
                      </span>
                    </NavLink>
                    {/* Línea separadora sutil */}
                    {i < mainLinks.length - 1 && <div className="w-full h-[1px] bg-white/5 ml-10 md:ml-16" />}
                  </motion.div>
                ))}

                {/* Links de acceso privado — más pequeños, debajo */}
                <motion.div variants={navItemVariants} className="mt-6 md:mt-10 ml-10 md:ml-16 flex flex-col gap-3">
                  <span className="text-primary text-[10px] uppercase tracking-[4px] font-body font-bold mb-2">
                    Acceso
                  </span>
                  <div className="flex flex-wrap gap-x-8 gap-y-3">
                    {isAuthenticated() ? (
                      <>
                        {isAdmin() && (
                          <NavLink
                            to="/admin"
                            onClick={closeMenu}
                            className="text-bg-body/60 hover:text-primary text-sm md:text-base font-heading tracking-widest uppercase transition-colors">
                            Administración
                          </NavLink>
                        )}
                        <NavLink
                          to="/dashboard"
                          onClick={closeMenu}
                          className="text-bg-body/60 hover:text-primary text-sm md:text-base font-heading tracking-widest uppercase transition-colors">
                          Área Personal
                        </NavLink>
                        <NavLink
                          to="/profile"
                          onClick={closeMenu}
                          className="text-bg-body/60 hover:text-primary text-sm md:text-base font-heading tracking-widest uppercase transition-colors">
                          Perfil
                        </NavLink>
                        <button
                          onClick={() => {
                            handleLogout();
                            closeMenu();
                          }}
                          className="text-bg-body/40 hover:text-primary text-[11px] font-body uppercase tracking-[2px] transition-colors border-b border-bg-body/20 hover:border-primary pb-[2px]">
                          Cerrar Sesión
                        </button>
                      </>
                    ) : (
                      <>
                        <NavLink
                          to="/login"
                          onClick={closeMenu}
                          className="text-bg-body/60 hover:text-primary text-sm md:text-base font-heading tracking-widest uppercase transition-colors">
                          Iniciar Sesión
                        </NavLink>
                        <NavLink
                          to="/register"
                          onClick={closeMenu}
                          className="text-bg-body/40 hover:text-primary text-[11px] font-body uppercase tracking-[2px] transition-colors border-b border-bg-body/20 hover:border-primary pb-[2px]">
                          Solicitar Registro
                        </NavLink>
                      </>
                    )}
                  </div>
                </motion.div>
              </motion.nav>

              {/* ─── Información inferior (estilo Lucky Folks — redes + datos) ─── */}
              <motion.div
                variants={bottomInfoVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0 mt-8 md:mt-0">
                {/* Info de contacto */}
                <div className="flex flex-col gap-1">
                  <span className="text-primary text-[9px] uppercase tracking-[4px] font-body font-bold mb-2">
                    Reservas
                  </span>
                  <a
                    href="tel:+34900000000"
                    className="text-bg-body/50 text-[12px] font-body tracking-widest hover:text-primary transition-colors">
                    +34 900 000 000
                  </a>
                  <a
                    href="mailto:info@distritogourmet.com"
                    className="text-bg-body/50 text-[12px] font-body tracking-widest hover:text-primary transition-colors">
                    info@distritogourmet.com
                  </a>
                </div>

                {/* Horarios */}
                <div className="hidden md:flex flex-col gap-1 text-center">
                  <span className="text-primary text-[9px] uppercase tracking-[4px] font-body font-bold mb-2">
                    Servicio
                  </span>
                  <span className="text-bg-body/40 text-[11px] font-body tracking-widest">
                    Mar–Dom 13:30–15:30 · Mar–Sáb 20:30–22:30
                  </span>
                </div>

                {/* Redes sociales (estilo Lucky Folks — iconos en la esquina) */}
                <div className="flex items-center gap-6">
                  <a
                    href="#"
                    className="text-bg-body/40 hover:text-primary transition-colors text-[11px] font-body tracking-[3px] uppercase">
                    Ig
                  </a>
                  <span className="text-bg-body/10">|</span>
                  <a
                    href="#"
                    className="text-bg-body/40 hover:text-primary transition-colors text-[11px] font-body tracking-[3px] uppercase">
                    Fb
                  </a>
                  <span className="text-bg-body/10">|</span>
                  <a
                    href="#"
                    className="text-bg-body/40 hover:text-primary transition-colors text-[11px] font-body tracking-[3px] uppercase">
                    Tw
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
