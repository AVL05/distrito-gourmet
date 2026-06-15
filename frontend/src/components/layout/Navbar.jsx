import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { IS_PUBLIC_DEMO } from "@/config/demo";

// Barra de navegación principal con overlay a pantalla completa.
// Gestiona el menú modal, cambios al hacer scroll y accesos dinámicos según sesión y carrito
const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  // Detectar el evento scroll de la ventana para cambiar el estilo visual del navbar (fondo semi-transparente vs transparente)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Efecto secundario: Deshabilitar el scroll vertical del documento cuando el menú modal a pantalla completa está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  // Finalizar sesión y redirigir al login
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsOpen((current) => !current);
  };
  const closeMenu = () => {
    if (isOpen) setIsOpen(false);
  };

  // Números romanos para los links
  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII"];

  // Links principales de navegación
  const mainLinks = [
    { to: "/", label: "Inicio" },
    { to: "/menu", label: "La Carta" },
    { to: "/reservations", label: "Reservas" },
    { to: "/contact", label: "Contacto" },
  ];
  const socialLinks = [
    { label: "Instagram ficticio", text: "Ig" },
    { label: "Facebook ficticio", text: "Fb" },
    { label: "TikTok ficticio", text: "Tk" },
  ];

  return (
    <div>
      <nav
        className={
          isAdminPage
            ? "fixed right-4 top-4 z-[60] flex items-center transition-all duration-700 md:right-8 md:top-6"
            : `fixed top-0 w-full z-[60] transition-all duration-700 flex items-center ${
                isOpen
                  ? "bg-transparent border-b border-transparent h-20 md:h-28"
                  : scrolled
                    ? "bg-bg-body/95 backdrop-blur-md border-b border-text-main/5 h-16 md:h-20"
                    : "bg-transparent h-20 md:h-28"
              }`
        }
      >
        <div
          className={
            isAdminPage
              ? "flex items-center justify-end"
              : "w-full mobile-safe-padding md:px-12 2k:px-24 4k:px-72 ultra:px-96 flex justify-between items-center"
          }
        >
          {!isAdminPage ? (
            <NavLink
              to="/cart"
              onClick={closeMenu}
              className={`relative flex items-center group transition-colors z-[70] ${isOpen ? "text-[#FCFBF8]" : "text-text-main"}`}
              title="Selección"
              aria-label={`Ver selección (${totalItems()} artículos)`}
            >
              <svg
                className="w-[18px] h-[18px] group-hover:scale-110 transition-transform group-hover:text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                ></path>
              </svg>
              {totalItems() > 0 && (
                <span className="absolute -top-2 -right-3 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-body font-bold">
                  {totalItems()}
                </span>
              )}
            </NavLink>
          ) : (
            <div className="w-[18px] h-[18px]" />
          )}

          {!isAdminPage && (
            <NavLink
              to="/"
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group z-[70] max-w-[58vw]"
              onClick={closeMenu}
            >
              <span
                className={`font-heading text-base sm:text-lg md:text-2xl uppercase tracking-[0.18em] sm:tracking-[0.25em] leading-none transition-colors duration-500 truncate max-w-full ${isOpen ? "text-[#FCFBF8]" : "text-text-main"}`}
              >
                Distrito
              </span>
              <span className="font-heading text-[9px] sm:text-[10px] md:text-xs text-primary italic tracking-[0.24em] sm:tracking-[0.3em] leading-none mt-[2px]">
                Gourmet
              </span>
            </NavLink>
          )}

          <button
            className={`flex flex-col items-end justify-center gap-[5px] cursor-pointer group z-[70] ${
              isAdminPage && !isOpen
                ? "h-11 w-11 border border-text-main/10 bg-bg-body/90 p-2 shadow-sm backdrop-blur"
                : "w-8 h-8 bg-transparent"
            }`}
            onClick={toggleMenu}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
          >
            <span
              className={`block h-[1.5px] origin-right transition-all duration-500 group-hover:bg-primary ${isOpen ? "bg-[#FCFBF8] w-6 -rotate-45 translate-x-[2px]" : "bg-text-main w-6"}`}
            />
            <span
              className={`block h-[1.5px] transition-all duration-500 group-hover:bg-primary ${isOpen ? "bg-[#FCFBF8] w-0 opacity-0" : "bg-text-main w-4"}`}
            />
            <span
              className={`block h-[1.5px] origin-right transition-all duration-500 group-hover:bg-primary ${isOpen ? "bg-[#FCFBF8] w-6 rotate-45 translate-x-[2px]" : "bg-text-main w-5"}`}
            />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[55] bg-text-main overflow-hidden transition-[clip-path] duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{
          clipPath: isOpen ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.07] grayscale"
          style={{ backgroundImage: "url('/sala_de_restaurante .png')" }}
        />
        <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-white/5 hidden md:block" />
        <div className="absolute top-0 bottom-0 left-2/3 w-[1px] bg-white/5 hidden md:block" />
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/5 hidden md:block" />

        <div className="relative z-10 h-full overflow-y-auto no-scrollbar flex flex-col justify-between mobile-safe-padding md:px-16 pt-24 sm:pt-28 md:pt-28 pb-8 md:pb-10">
          <nav
            className="flex flex-col gap-1 md:gap-1"
            style={{ perspective: "600px" }}
          >
            {mainLinks.map((link, i) => (
              <div
                key={link.to}
                className={`nav-link-item group transition-all duration-500 ${
                  isOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: isOpen ? `${160 + i * 70}ms` : "0ms" }}
              >
                <NavLink
                  to={link.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-baseline gap-4 md:gap-8 py-2 md:py-2 transition-all duration-300 ${
                      isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                    }`
                  }
                >
                  <span className="font-body text-[10px] md:text-[11px] text-primary tracking-[0.2em] w-6 md:w-8 shrink-0 font-bold">
                    {romanNumerals[i]}
                  </span>
                  <span className="font-heading text-[clamp(2.25rem,13vw,4.5rem)] md:text-6xl lg:text-[5.25rem] 2xl:text-[5.75rem] text-bg-body uppercase tracking-wide sm:tracking-wider leading-none group-hover:text-primary transition-colors duration-500 group-hover:italic break-words">
                    {link.label}
                  </span>
                </NavLink>
                {i < mainLinks.length - 1 && (
                  <div className="w-full h-[1px] bg-white/5 ml-10 md:ml-16" />
                )}
              </div>
            ))}

            <div
              className={`nav-link-item mt-8 md:mt-12 ml-10 md:ml-16 flex flex-col gap-4 transition-all duration-500 ${
                isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: isOpen ? "440ms" : "0ms" }}
            >
              <span className="text-primary text-[10px] uppercase tracking-[4px] font-body font-bold mb-2">
                Acceso
              </span>
              <div className="flex flex-wrap gap-x-6 md:gap-x-8 gap-y-3">
                {IS_PUBLIC_DEMO ? (
                  <>
                    <NavLink
                      to="/admin"
                      onClick={closeMenu}
                      className="text-bg-body/60 hover:text-primary text-sm md:text-base font-heading tracking-widest uppercase transition-colors"
                    >
                      Administración
                    </NavLink>
                    <NavLink
                      to="/dashboard"
                      onClick={closeMenu}
                      className="text-bg-body/60 hover:text-primary text-sm md:text-base font-heading tracking-widest uppercase transition-colors"
                    >
                      Área Personal
                    </NavLink>
                    <span className="text-bg-body/40 text-[11px] font-body uppercase tracking-[2px]">
                      Vista de prueba
                    </span>
                  </>
                ) : isAuthenticated() ? (
                  <>
                    {isAdmin() && (
                      <NavLink
                        to="/admin"
                        onClick={closeMenu}
                        className="text-bg-body/60 hover:text-primary text-sm md:text-base font-heading tracking-widest uppercase transition-colors"
                      >
                        Administración
                      </NavLink>
                    )}
                    <NavLink
                      to="/dashboard"
                      onClick={closeMenu}
                      className="text-bg-body/60 hover:text-primary text-sm md:text-base font-heading tracking-widest uppercase transition-colors"
                    >
                      Área Personal
                    </NavLink>
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                      className="text-bg-body/40 hover:text-primary text-[11px] font-body uppercase tracking-[2px] transition-colors border-b border-bg-body/20 hover:border-primary pb-[2px]"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      onClick={closeMenu}
                      className="text-bg-body/60 hover:text-primary text-sm md:text-base font-heading tracking-widest uppercase transition-colors"
                    >
                      Iniciar Sesión
                    </NavLink>
                    <NavLink
                      to="/register"
                      onClick={closeMenu}
                      className="text-bg-body/40 hover:text-primary text-[11px] font-body uppercase tracking-[2px] transition-colors border-b border-bg-body/20 hover:border-primary pb-[2px]"
                    >
                      Crear Cuenta
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </nav>

          <div
            className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-12 mt-10 md:mt-10 pb-[env(safe-area-inset-bottom)] transition-all duration-500 ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: isOpen ? "520ms" : "0ms" }}
          >
            <div className="flex flex-col gap-1">
              <span className="text-primary text-[9px] uppercase tracking-[4px] font-body font-bold mb-2">
                Reservas
              </span>
              <span className="text-bg-body/50 text-[12px] font-body tracking-widest">
                +34 960 00 00 00
              </span>
              <span className="text-bg-body/50 text-[12px] font-body tracking-widest">
                info@distrito-gourmet.test
              </span>
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
              {socialLinks.map((link, index) => (
                <div key={link.label} className="flex items-center gap-6">
                  <span
                    aria-label={link.label}
                    className="text-bg-body/40 hover:text-primary transition-colors text-[11px] font-body tracking-[3px] uppercase"
                  >
                    {link.text}
                  </span>
                  {index < socialLinks.length - 1 && (
                    <span className="text-bg-body/10">|</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
