import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import {
  motion,
  useReducedMotion,
  FadeIn,
  StaggerList,
  StaggerItem,
} from "@/motion";
import { Link } from "react-router-dom";

// Pie de página del sitio web con animaciones sutiles
const Footer = () => {
  const shouldReduceMotion = useReducedMotion();
  const socialLinks = [
    {
      icon: FaFacebookF,
      label: "Facebook",
    },
    {
      icon: FaInstagram,
      label: "Instagram",
    },
    {
      icon: FaTiktok,
      label: "TikTok",
    },
  ];

  return (
    <footer className="bg-bg-body relative border-t border-text-main/10 pt-20 pb-10 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

      <div className="container relative z-10">
        <FadeIn className="flex flex-col md:flex-row justify-between items-start mb-20 gap-16">
          {/* Logo y descripción */}
          <div className="md:w-5/12 flex flex-col justify-start">
            <Link to="/" className="group">
              <h3 className="font-heading text-3xl md:text-3xl text-text-main tracking-[0.2em] mb-6 flex items-center gap-3 font-normal group-hover:text-primary transition-colors">
                <span className="text-primary opacity-80 text-xl">✦</span>
                DISTRITO
                <span className="italic text-primary-hover">GOURMET</span>
              </h3>
            </Link>
            <p className="text-text-main/80 text-sm leading-loose max-w-sm font-medium">
              Cocina española contemporánea, producto de temporada y una sala
              pensada para comer sin prisa.
            </p>
          </div>

          {/* Información de contacto */}
          <div className="md:w-7/12 grid grid-cols-1 sm:grid-cols-3 gap-12 w-full">
            <div className="text-left">
              <h4 className="font-heading text-[10px] text-text-main/80 uppercase tracking-[4px] mb-6 relative inline-block font-semibold">
                Ubicación
                <span className="absolute -bottom-2 left-0 w-4 h-[1px] bg-primary"></span>
              </h4>
              <p className="text-text-main/80 text-sm leading-loose font-medium">
                Calle del Mercado, 18
                <br />
                Ciutat Vella
                <br />
                46000, Valencia
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-heading text-[10px] text-text-main/80 uppercase tracking-[4px] mb-6 relative inline-block font-semibold">
                Comunicación
                <span className="absolute -bottom-2 left-0 w-4 h-[1px] bg-primary"></span>
              </h4>
              <p className="text-text-main/80 text-sm leading-loose font-medium flex flex-col">
                <span className="py-1">+34 960 00 00 00</span>
                <span className="py-1">reservas@distritogourmet.es</span>
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-heading text-[10px] text-text-main/80 uppercase tracking-[4px] mb-6 relative inline-block font-semibold">
                Servicio
                <span className="absolute -bottom-2 left-0 w-4 h-[1px] bg-primary"></span>
              </h4>
              <p className="text-text-main/80 text-sm leading-loose font-medium">
                <span className="block mb-1">
                  <span className="text-primary text-xs">M - D:</span> 13:30 a
                  15:30
                </span>
                <span className="block mb-2">
                  <span className="text-primary text-xs">M - S:</span> 20:30 a
                  22:30
                </span>
                <span className="text-text-main/75 italic">Lunes: cerrado</span>
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Barra inferior con redes sociales y links legales */}
        <div className="border-t border-text-main/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-4">
            {socialLinks.map(({ icon: Icon, label }) => (
              <motion.span
                key={label}
                aria-label={label}
                whileHover={
                  shouldReduceMotion ? undefined : { scale: 1.1, y: -2 }
                }
                whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                className="p-3 border border-text-main/20 rounded-full text-text-main/70 hover:text-text-main hover:bg-primary hover:border-primary transition-all duration-300"
              >
                <Icon size={12} />
              </motion.span>
            ))}
          </div>

          <div className="text-text-main/70 text-[10px] uppercase tracking-[3px] flex flex-wrap justify-center gap-5 sm:gap-8 font-medium">
            <Link to="/menu" className="hover:text-text-main transition-colors">
              Carta
            </Link>
            <Link
              to="/reservations"
              className="hover:text-text-main transition-colors"
            >
              Reservas
            </Link>
            <Link
              to="/legal"
              className="hover:text-text-main transition-colors"
            >
              Aviso Legal
            </Link>
            <Link
              to="/privacy"
              className="hover:text-text-main transition-colors"
            >
              Política de Privacidad
            </Link>
            <Link
              to="/cookies"
              className="hover:text-text-main transition-colors"
            >
              Cookies
            </Link>
          </div>

          <p className="text-text-main/70 text-[10px] uppercase tracking-[3px] font-medium">
            &copy; {new Date().getFullYear()} Distrito Gourmet. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
