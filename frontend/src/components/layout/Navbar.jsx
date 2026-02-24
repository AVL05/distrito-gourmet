import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinkClasses = ({ isActive }) =>
    `text-text-muted hover:text-gray-900 uppercase text-xs tracking-[1.5px] transition-colors relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-[1px] after:bg-primary after:transition-[width] after:duration-300 hover:after:w-full ${isActive ? "text-gray-900 after:w-full" : ""}`;

  const mobileNavLinkClasses = ({ isActive }) =>
    `block py-2 text-text-muted hover:text-gray-900 uppercase text-sm tracking-wider ${isActive ? "text-primary" : ""}`;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-white/90 shadow-sm border-gray-100 backdrop-blur-xl border-b border-gray-100 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]" : "bg-gradient-to-b from-black/80 to-transparent py-8"}`}
    >
      <div className="container flex justify-between items-center px-6 md:px-12">
        <NavLink
          to="/"
          className="font-heading text-2xl md:text-3xl text-gray-900 uppercase tracking-[0.2em] relative z-50 group flex items-center gap-3"
        >
          <span className="text-primary opacity-80 group-hover:rotate-90 transition-transform duration-500">✦</span>
          <span>Distrito<span className="text-primary font-light italic ml-1">Gourmet</span></span>
        </NavLink>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-900 text-2xl relative z-50 hover:text-primary transition-colors"
          onClick={toggleMenu}
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          <NavLink to="/menu" className={navLinkClasses}>
            La Carta
          </NavLink>
          <NavLink to="/reservations" className={navLinkClasses}>
            Reservas
          </NavLink>

          {isAuthenticated() ? (
            <div className="flex items-center gap-10">
              {isAdmin() && (
                <NavLink to="/admin" className={navLinkClasses}>
                  DG MGMT
                </NavLink>
              )}
              <NavLink to="/dashboard" className={navLinkClasses}>
                Área Privada
              </NavLink>
              <button onClick={handleLogout} className="text-[10px] uppercase tracking-[3px] text-gray-500 hover:text-red-400 transition-colors">
                Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <NavLink to="/login" className={navLinkClasses}>
                Acceso
              </NavLink>
              <NavLink to="/register" className="group relative px-6 py-2 bg-transparent border border-gray-200 text-gray-900 font-body text-[10px] uppercase tracking-[3px] overflow-hidden transition-all duration-300 hover:border-primary">
                <div className="absolute inset-0 w-0 bg-primary transition-all duration-[400ms] ease-out group-hover:w-full"></div>
                <span className="relative z-10 group-hover:text-black font-bold transition-colors duration-300">Registro</span>
              </NavLink>
            </div>
          )}

          <NavLink
            to="/cart"
            className="relative text-gray-500 hover:text-primary transition-colors flex items-center"
            title="Su Selección"
          >
            <span className="text-xl">🛒</span>
            {totalItems() > 0 && (
              <span className="absolute -top-2 -right-3 bg-primary text-black rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold ring-2 ring-black">
                {totalItems()}
              </span>
            )}
          </NavLink>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-0 left-0 w-full h-screen bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-10 transition-all duration-500 ease-in-out ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

        <NavLink
          to="/menu"
          className="text-3xl font-heading uppercase tracking-[0.1em] text-gray-900 hover:text-primary transition-colors font-light"
          onClick={() => setIsOpen(false)}
        >
          La Carta
        </NavLink>
        <NavLink
          to="/reservations"
          className="text-3xl font-heading uppercase tracking-[0.1em] text-gray-900 hover:text-primary transition-colors font-light"
          onClick={() => setIsOpen(false)}
        >
          Reservas
        </NavLink>

        {isAuthenticated() ? (
          <>
            {isAdmin() && (
              <NavLink
                to="/admin"
                className="text-3xl font-heading uppercase tracking-[0.1em] text-gray-900 hover:text-primary transition-colors font-light"
                onClick={() => setIsOpen(false)}
              >
                DG MGMT
              </NavLink>
            )}
            <NavLink
              to="/dashboard"
              className="text-3xl font-heading uppercase tracking-[0.1em] text-gray-900 hover:text-primary transition-colors font-light"
              onClick={() => setIsOpen(false)}
            >
              Área Privada
            </NavLink>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="text-base font-heading uppercase tracking-[0.2em] text-red-400/70 hover:text-red-400 transition-colors mt-8"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-8 mt-4">
            <NavLink
              to="/login"
              className="text-xl font-heading uppercase tracking-[0.1em] text-gray-500 hover:text-gray-900 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Acceso Privado
            </NavLink>
            <NavLink
              to="/register"
              className="text-xs font-body uppercase tracking-[4px] border border-primary px-10 py-4 text-primary hover:bg-primary hover:text-black transition-all"
              onClick={() => setIsOpen(false)}
            >
              Solicitar Registro
            </NavLink>
          </div>
        )}

        <NavLink
          to="/cart"
          className="mt-12 group flex items-center justify-center text-gray-900 relative hover:text-primary transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <div className="flex items-center border border-gray-200 px-8 py-4 rounded-full bg-white/5 backdrop-blur-md">
            <span className="text-xs uppercase tracking-[4px] mr-4 font-bold">
              Su Selección
            </span>
            <span className="text-xl">🛒</span>
            {totalItems() > 0 && (
              <span className="ml-3 bg-primary text-black rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                {totalItems()}
              </span>
            )}
          </div>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
