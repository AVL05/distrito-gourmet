import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { PageTransition, FadeIn } from "@/motion";

const NotFoundView = () => (
  <PageTransition className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-bg-body relative overflow-hidden">
    <Helmet><title>Página no encontrada | Distrito Gourmet</title></Helmet>
    <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-text-main/5 -translate-x-1/2 z-0 hidden md:block" />

    <FadeIn className="bg-bg-surface border border-text-main/10 p-8 sm:p-12 md:p-24 max-w-2xl w-full relative z-10 flex flex-col items-center">
      <span className="text-text-main text-[12px] uppercase tracking-[3px] mb-8 font-body font-bold">
        / 404
      </span>
      <h1 className="text-4xl md:text-5xl font-heading text-text-main leading-tight mb-8">
        Página no <span className="italic font-normal text-primary">Encontrada</span>
      </h1>
      <div className="w-16 h-[1px] bg-text-main/10 mb-8" />
      <p className="text-text-main font-body font-medium mb-12 text-[15px] tracking-wide leading-relaxed opacity-90">
        La dirección solicitada no existe o ha cambiado. Puede volver a una de
        las secciones principales.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        <Link
          to="/"
          className="group relative px-8 py-4 bg-transparent border border-text-main text-text-main font-body text-[12px] uppercase tracking-[2px] overflow-hidden transition-all duration-300 hover:border-text-main inline-block"
        >
          <div className="absolute inset-0 w-0 bg-text-main transition-all duration-[400ms] ease-out group-hover:w-full" />
          <span className="relative z-10 group-hover:text-white font-bold transition-colors duration-300">
            Volver al Inicio
          </span>
        </Link>
        <Link
          to="/menu"
          className="font-body text-[12px] uppercase tracking-[2px] text-text-main border border-text-main/20 px-8 py-4 hover:text-primary hover:border-primary transition-colors font-medium"
        >
          Ver la carta
        </Link>
        <Link
          to="/reservations"
          className="font-body text-[12px] uppercase tracking-[2px] text-text-main border border-text-main/20 px-8 py-4 hover:text-primary hover:border-primary transition-colors font-medium"
        >
          Reservar mesa
        </Link>
        <Link
          to="/contact"
          className="font-body text-[12px] uppercase tracking-[2px] text-text-main border border-text-main/20 px-8 py-4 hover:text-primary hover:border-primary transition-colors font-medium"
        >
          Contacto
        </Link>
      </div>
    </FadeIn>
  </PageTransition>
);

export default NotFoundView;
