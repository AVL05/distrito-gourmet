import ServiceHours from "@/components/ServiceHours";
import { FadeIn } from "@/motion";
import { Link } from "react-router-dom";

// Pie de página del sitio web con animaciones sutiles
const Footer = () => {
  return (
    <footer className="bg-bg-body relative border-t border-text-main/10 pt-20 pb-10 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent"></div>

      <div className="container relative z-10">
        <p className="mb-8 text-sm text-text-muted">Proyecto de portfolio. Restaurante, datos de contacto y servicios ficticios. Utilice únicamente datos de prueba.</p>
        <FadeIn className="flex flex-col md:flex-row justify-between items-start mb-20 gap-16">
          {/* Logo y descripción */}
          <div className="md:w-5/12 flex flex-col justify-start">
            <Link to="/" className="group max-w-full">
              <p className="font-heading text-[2rem] sm:text-3xl text-text-main tracking-[0.14em] sm:tracking-[0.2em] mb-6 flex max-w-full flex-wrap items-baseline gap-x-3 gap-y-1 font-normal leading-tight group-hover:text-primary-hover transition-colors">
                <span className="text-primary-hover opacity-80 text-xl shrink-0">
                  ✦
                </span>
                <span className="min-w-0">DISTRITO</span>
                <span className="italic text-primary-hover min-w-0 wrap-break-word">
                  GOURMET
                </span>
              </p>
            </Link>
            <p className="text-text-main/80 text-sm leading-loose max-w-sm font-medium">
              Cocina española contemporánea, producto de temporada y una sala
              pensada para comer sin prisa.
            </p>
          </div>

          {/* Información de contacto */}
          <div className="md:w-7/12 grid grid-cols-1 sm:grid-cols-3 gap-12 w-full">
            <div className="text-left">
              <h2 className="font-heading text-[10px] text-text-main/80 uppercase tracking-[4px] mb-6 relative inline-block font-semibold">
                Ubicación
                <span className="absolute -bottom-2 left-0 w-4 h-px bg-primary"></span>
              </h2>
              <p className="text-text-main/80 text-sm leading-loose font-medium">
                Calle del Mercado, 18
                <br />
                Ciutat Vella
                <br />
                46000, Valencia
              </p>
            </div>
            <div className="text-left">
              <h2 className="font-heading text-[10px] text-text-main/80 uppercase tracking-[4px] mb-6 relative inline-block font-semibold">
                Comunicación
                <span className="absolute -bottom-2 left-0 w-4 h-px bg-primary"></span>
              </h2>
              <p className="text-text-main/80 text-sm leading-loose font-medium flex flex-col">
                <a href="tel:+34960000000" className="py-1 underline">+34 960 00 00 00</a>
                <a href="mailto:reservas@distritogourmet.es" className="py-1 break-all underline">reservas@distritogourmet.es</a>
              </p>
            </div>
            <div className="text-left">
              <h2 className="font-heading text-[10px] text-text-main/80 uppercase tracking-[4px] mb-6 relative inline-block font-semibold">
                Servicio
                <span className="absolute -bottom-2 left-0 w-4 h-px bg-primary"></span>
              </h2>
              <ServiceHours />
            </div>
          </div>
        </FadeIn>

        {/* Barra inferior con redes sociales y links legales */}
        <div className="border-t border-text-main/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
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
