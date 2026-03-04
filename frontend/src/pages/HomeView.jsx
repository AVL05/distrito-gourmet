import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { PageTransition, FadeIn, StaggerList, StaggerItem } from '@/motion';
import { fadeUpVariants, DURATION, EASING } from '@/motion';

const HomeView = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <PageTransition className="w-full">
      {/* Sección Hero - Presentación principal */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-bg-body">
        {/* Imagen de fondo con filtro */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30 grayscale"
          style={{ backgroundImage: "url('/sala_de_restaurante .png')" }}></div>

        {/* Líneas decorativas */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-text-main/5 -translate-x-1/2 z-0 hidden md:block"></div>
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-text-main/5 -translate-y-1/2 z-0 hidden md:block"></div>

        <div className="relative z-10 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center h-full">
          <FadeIn delay={0.1}>
            <span className="block text-text-main text-[12px] md:text-sm uppercase tracking-[0.3em] mb-12 font-body font-semibold">
              / 01 Inspiración Florentina
            </span>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-5xl sm:text-7xl md:text-[8rem] leading-[0.85] font-heading text-text-main mb-6 tracking-tight">
              Distrito
              <br />
              <span className="italic block mt-2 text-5xl sm:text-6xl md:text-[7rem] text-primary">Gourmet</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.35}>
            <p className="text-sm md:text-base text-text-muted font-body font-light mb-16 max-w-lg mx-auto leading-loose tracking-widest uppercase">
              Cocina Española Contemporánea
            </p>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="flex flex-col sm:flex-row gap-8 items-center">
              <Link
                to="/menu"
                className="group relative px-6 text-text-main font-body text-[13px] uppercase tracking-[3px] transition-all">
                <span className="relative z-10 font-bold group-hover:text-primary transition-colors pb-1 border-b border-text-main group-hover:border-primary">
                  Descubrir la Carta
                </span>
              </Link>
              <motion.div
                whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}>
                <Link
                  to="/reservations"
                  className="group relative px-10 py-4 bg-text-main text-bg-body font-body text-[12px] uppercase tracking-[3px] overflow-hidden transition-all hover:bg-primary w-full sm:w-auto text-center inline-block">
                  <div className="absolute inset-0 w-0 bg-primary/20 transition-all duration-[400ms] ease-out group-hover:w-full"></div>
                  <span className="relative z-10 font-semibold transition-colors duration-300">Reservar Mesa</span>
                </Link>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Sección Filosofía */}
      <section className="py-20 md:py-40 bg-bg-surface relative border-y border-text-main/5">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <FadeIn
              direction="left"
              className="lg:col-span-5 text-left relative flex flex-col justify-center order-2 lg:order-1 px-0">
              <span className="block text-text-muted text-[12px] uppercase tracking-[3px] mb-8 font-body font-medium">
                / 02 Identidad
              </span>
              <h2 className="text-5xl md:text-7xl font-heading text-text-main mb-12 leading-[0.9] tracking-tight">
                El Arte
                <br />
                <span className="italic text-primary">Contemporáneo</span>
              </h2>
              <div className="w-full h-[1px] bg-text-main/10 mb-10"></div>
              <p className="text-text-muted mb-8 leading-relaxed font-body font-light text-[15px] tracking-wide">
                En Distrito Gourmet, no solo cocinamos; curamos ingredientes. Un diálogo constante entre la tradición
                española más profunda y la audacia de la técnica moderna.
              </p>
              <p className="text-text-muted mb-12 leading-relaxed font-body font-light text-[15px] tracking-wide">
                Cada receta está deconstruida, analizada matemáticamente y ensamblada de nuevo para provocar una
                reacción emocional inesperada.
              </p>
              <Link
                to="/menu"
                className="font-body text-[12px] uppercase tracking-[2px] text-text-main border-b border-text-main pb-1 self-start hover:text-primary hover:border-primary transition-colors font-medium">
                Explorar Identidad
              </Link>
            </FadeIn>

            {/* Imagen decorativa */}
            <FadeIn
              direction="right"
              className="lg:col-span-7 flex justify-center lg:justify-end order-1 lg:order-2 px-4 md:px-0">
              <div className="w-full max-w-[500px] aspect-[3/4] overflow-hidden rounded-t-[250px] relative">
                <div className="absolute inset-0 border border-text-main/10 rounded-t-[250px] z-20 pointer-events-none"></div>
                <img
                  src="/bodega.png"
                  alt="Interior bodegón"
                  className="w-full h-full object-cover z-10 relative saturate-50 hover:saturate-100 transition-all duration-1000"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Sección Experiencia */}
      <section className="py-24 md:py-32 bg-bg-body">
        <div className="container px-4">
          <FadeIn className="text-center mb-20">
            <span className="block text-text-muted text-[12px] uppercase tracking-[3px] mb-6 font-body font-medium">
              / 03 La Visión
            </span>
            <h2 className="text-5xl md:text-6xl font-heading text-text-main leading-tight mb-4">
              Arquitectura <span className="italic text-primary">Sensorial</span>
            </h2>
          </FadeIn>

          <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Columna 1 */}
            <StaggerItem className="md:border-r border-b md:border-b-0 border-text-main/10 p-8 md:p-12 md:pl-0 flex flex-col justify-start">
              <span className="text-5xl text-text-main/45 font-heading font-semibold mb-6 block leading-none">01.</span>
              <h3 className="text-3xl font-heading text-text-main mb-6 leading-tight">Materia Prima</h3>
              <p className="text-text-muted font-body font-light text-[14px] leading-relaxed tracking-wide">
                Selección diaria de producto local de extrema calidad. Trato reverencial al productor y obsesión por la
                frescura inmaculada.
              </p>
            </StaggerItem>

            {/* Columna 2 */}
            <StaggerItem className="md:border-r border-b md:border-b-0 border-text-main/10 p-8 md:p-12 flex flex-col justify-start">
              <span className="text-5xl text-text-main/45 font-heading font-semibold mb-6 block leading-none">02.</span>
              <h3 className="text-3xl font-heading text-text-main mb-6 leading-tight">Vinos de Autor</h3>
              <p className="text-text-muted font-body font-light text-[14px] leading-relaxed tracking-wide">
                Maridaje curado artesanalmente. Más de diez mil referencias descansan en una de las bodegas más
                completas de Europa.
              </p>
            </StaggerItem>

            {/* Columna 3 */}
            <StaggerItem className="p-8 md:p-12 md:pr-0 flex flex-col justify-start border-b md:border-b-0 border-text-main/10">
              <span className="text-5xl text-text-main/45 font-heading font-semibold mb-6 block leading-none">03.</span>
              <h3 className="text-3xl font-heading text-text-main mb-6 leading-tight">Espacio</h3>
              <p className="text-text-muted font-body font-light text-[14px] leading-relaxed tracking-wide">
                Un entorno diseñado en vacío absolouto. Madera noble, lino puro e iluminación escenográfica enfocada al
                plato.
              </p>
            </StaggerItem>
          </StaggerList>
        </div>
      </section>

      {/* Sección Reserva */}
      <section className="py-24 md:py-32 bg-text-main text-bg-body">
        <div className="container px-4">
          <FadeIn className="max-w-4xl mx-auto text-center mb-16">
            <span className="block text-bg-body text-[12px] uppercase tracking-[3px] mb-6 font-body font-medium">
              / 04 Reserva
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading text-bg-body leading-tight mb-8">
              Asegure su <span className="italic font-light text-primary">Mesa</span>
            </h2>
            <div className="w-24 h-[1px] bg-bg-body/20 mx-auto mb-8"></div>
            <p className="text-bg-body/70 text-sm md:text-base font-body font-light max-w-lg mx-auto tracking-wide leading-loose">
              Cupo extremadamente estrictro y reducido por servicio para garantizar una experiencia sin interferencias.
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="flex justify-center flex-col items-center">
            <motion.div
              whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}>
              <Link
                to="/reservations"
                className="group relative px-12 py-5 bg-transparent border border-bg-body text-bg-body font-body text-[12px] uppercase tracking-[3px] overflow-hidden transition-all hover:border-transparent focus:outline-none w-full sm:w-auto text-center inline-block">
                <div className="absolute inset-0 w-0 bg-primary transition-all duration-[400ms] ease-out group-hover:w-full"></div>
                <span className="relative z-10 font-bold group-hover:text-text-main transition-colors duration-300">
                  Proceder a la Reserva
                </span>
              </Link>
            </motion.div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
};

export default HomeView;
