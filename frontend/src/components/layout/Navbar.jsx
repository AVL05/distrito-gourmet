import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

/**
 * Navbar Component
 *
 * Barra de navegación principal del sitio, rediseñada con animaciones GSAP.
 * Gestiona un menú modal a pantalla completa, cambios visuales al hacer scroll,
 * y muestra accesos dinámicos basados en la sesión del usuario y los elementos del carrito.
 *
 */
const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menuRef = useRef(null);
  const overlayRef = useRef(null);
  const linksRef = useRef(null);
  const bottomInfoRef = useRef(null);

  // Detectar el evento scroll de la ventana para cambiar el estilo visual del navbar (fondo semi-transparente vs transparente)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efecto secundario: Deshabilitar el scroll vertical del documento cuando el menú modal a pantalla completa está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Hook personalizado de GSAP para manejar la secuencia de animaciones del menú de navegación
  useGSAP(
    () => {
      if (isOpen) {
        const tl = gsap.timeline();

        tl.set(overlayRef.current, { display: 'block', clipPath: 'inset(0 0 100% 0)' });

        tl.to(overlayRef.current, {
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.8,
          ease: 'power4.inOut',
        });

        const links = linksRef.current.querySelectorAll('.nav-link-item');
        tl.from(
          links,
          {
            opacity: 0,
            y: 40,
            rotateX: -15,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
          },
          '-=0.4'
        );

        tl.from(
          bottomInfoRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.2'
        );
      } else {
        if (overlayRef.current) {
          gsap.to(overlayRef.current, {
            clipPath: 'inset(0 0 100% 0)',
            duration: 0.6,
            ease: 'power4.inOut',
            onComplete: () => {
              if (overlayRef.current) overlayRef.current.style.display = 'none';
            },
          });
        }
      }
    },
    { dependencies: [isOpen], scope: menuRef }
  );

  /**
   * Finaliza la sesión del usuario actual y lo redirige a la vista de inicio de sesión.
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Números romanos para los links
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

  // Links principales de navegación
  const mainLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/menu', label: 'La Carta' },
    { to: '/reservations', label: 'Reservas' },
    { to: '/contact', label: 'Contacto' },
  ];

  return (
    <div ref={menuRef}>
      <nav
        className={`fixed top-0 w-full z-[60] transition-all duration-700 flex items-center ${
          scrolled
            ? 'bg-bg-body/95 backdrop-blur-md border-b border-text-main/5 h-16 md:h-20'
            : 'bg-transparent h-20 md:h-28'
        }`}>
        <div className="w-full px-6 md:px-12 flex justify-between items-center">
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
            {totalItems() > 0 && (
              <span className="absolute -top-2 -right-3 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-body font-bold">
                {totalItems()}
              </span>
            )}
          </NavLink>

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

          <button
            className="flex flex-col items-end justify-center gap-[5px] w-8 h-8 cursor-pointer group z-[70]"
            onClick={toggleMenu}
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}>
            <span
              className={`block h-[1.5px] bg-text-main origin-right transition-all duration-500 group-hover:bg-primary ${isOpen ? 'w-6 -rotate-45 translate-x-[2px]' : 'w-6'}`}
            />
            <span
              className={`block h-[1.5px] bg-text-main transition-all duration-500 group-hover:bg-primary ${isOpen ? 'w-0 opacity-0' : 'w-4'}`}
            />
            <span
              className={`block h-[1.5px] bg-text-main origin-right transition-all duration-500 group-hover:bg-primary ${isOpen ? 'w-6 rotate-45 translate-x-[2px]' : 'w-5'}`}
            />
          </button>
        </div>
      </nav>

      <div
        ref={overlayRef}
        className="fixed inset-0 z-[55] bg-text-main overflow-hidden hidden"
        style={{ clipPath: 'inset(0 0 100% 0)' }}>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.07] grayscale"
          style={{ backgroundImage: "url('/sala_de_restaurante .png')" }}
        />
        <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-white/5 hidden md:block" />
        <div className="absolute top-0 bottom-0 left-2/3 w-[1px] bg-white/5 hidden md:block" />
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/5 hidden md:block" />

        <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-16 pt-28 md:pt-32 pb-8 md:pb-12">
          <nav ref={linksRef} className="flex flex-col gap-1 md:gap-2" style={{ perspective: '600px' }}>
            {mainLinks.map((link, i) => (
              <div key={link.to} className="nav-link-item group">
                <NavLink
                  to={link.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-baseline gap-4 md:gap-8 py-2 md:py-3 transition-all duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                    }`
                  }>
                  <span className="font-body text-[10px] md:text-[11px] text-primary tracking-[0.2em] w-6 md:w-8 shrink-0 font-bold">
                    {romanNumerals[i]}
                  </span>
                  <span className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-bg-body uppercase tracking-wider leading-none group-hover:text-primary transition-colors duration-500 group-hover:italic">
                    {link.label}
                  </span>
                </NavLink>
                {i < mainLinks.length - 1 && <div className="w-full h-[1px] bg-white/5 ml-10 md:ml-16" />}
              </div>
            ))}

            <div className="nav-link-item mt-6 md:mt-10 ml-10 md:ml-16 flex flex-col gap-3">
              <span className="text-primary text-[10px] uppercase tracking-[4px] font-body font-bold mb-2">Acceso</span>
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
            </div>
          </nav>

          <div
            ref={bottomInfoRef}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0 mt-8 md:mt-0">
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

            <div className="hidden md:flex flex-col gap-1 text-center">
              <span className="text-primary text-[9px] uppercase tracking-[4px] font-body font-bold mb-2">
                Servicio
              </span>
              <span className="text-bg-body/40 text-[11px] font-body tracking-widest">
                Mar–Dom 13:30–15:30 · Mar–Sáb 20:30–22:30
              </span>
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
