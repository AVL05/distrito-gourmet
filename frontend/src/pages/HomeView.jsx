import { Link } from "react-router-dom";
import {
  PageTransition,
  FadeIn,
  TextReveal,
  ScrollReveal,
  ParallaxImage,
  Marquee,
  MagneticButton,
  LineReveal,
  ScrollProgress,
} from "@/motion";

// Página de inicio organizada en secciones visuales de alto impacto para el usuario
const HomeView = () => {
  return (
    <PageTransition className="w-full">
      {/* Barra de progreso de scroll (inspirado en sitios editoriales premium) */}
      <ScrollProgress />

      {/* Sección principal de bienvenida */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center overflow-hidden bg-bg-body">
        {/* Imagen de fondo con filtro */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30 grayscale"
          style={{ backgroundImage: "url('/sala_de_restaurante .png')" }}
        ></div>

        {/* Líneas decorativas */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-text-main/5 -translate-x-1/2 z-0 hidden md:block"></div>
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-text-main/5 -translate-y-1/2 z-0 hidden md:block"></div>

        <div className="relative z-10 px-4 max-w-5xl 2k:max-w-7xl 4k:max-w-[90rem] mx-auto flex flex-col items-center justify-center min-h-[100svh] py-28 sm:py-32">
          {/* Título con Text Reveal caracter por caracter (estilo Lucky Folks) */}
          <TextReveal
            text="Distrito"
            splitBy="char"
            as="h1"
            staggerDelay={0.04}
            delay={0.2}
            allowWrap={false}
            className="text-[clamp(2.35rem,10.5vw,7rem)] md:text-[8rem] leading-[0.9] font-heading text-text-main mb-2 tracking-normal justify-center"
          />
          <TextReveal
            text="Gourmet"
            splitBy="char"
            as="span"
            staggerDelay={0.04}
            delay={0.5}
            allowWrap={false}
            className="italic text-[clamp(2.75rem,12vw,6rem)] md:text-[7rem] text-primary font-heading mb-6 justify-center"
          />

          <FadeIn delay={0.9}>
            <p className="text-xs sm:text-sm md:text-base text-text-muted font-body font-normal mb-12 sm:mb-16 max-w-lg mx-auto leading-loose tracking-[0.18em] sm:tracking-widest uppercase">
              Cocina Española Contemporánea
            </p>
          </FadeIn>

          <FadeIn delay={1.1}>
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-center w-full sm:w-auto">
              <Link
                to="/menu"
                className="group relative px-6 text-text-main font-body text-[12px] sm:text-[13px] uppercase tracking-[2px] sm:tracking-[3px] transition-all"
              >
                <span className="relative z-10 font-bold group-hover:text-primary transition-colors pb-1 border-b border-text-main group-hover:border-primary">
                  Descubrir la Carta
                </span>
              </Link>
              {/* Botón magnético inspirado en Lucky Folks */}
              <MagneticButton as="div" strength={12} className="cursor-pointer">
                <div>
                  <Link
                    to="/reservations"
                    className="group relative px-8 sm:px-10 py-4 bg-text-main text-bg-body font-body text-[11px] sm:text-[12px] uppercase tracking-[2px] sm:tracking-[3px] overflow-hidden transition-all hover:bg-primary w-full sm:w-auto text-center inline-block"
                  >
                    <div className="absolute inset-0 w-0 bg-primary transition-all duration-[400ms] ease-out group-hover:w-full"></div>
                    <span className="relative z-10 font-semibold transition-colors duration-300 group-hover:text-white">
                      Reservar Mesa
                    </span>
                  </Link>
                </div>
              </MagneticButton>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="overflow-x-clip">
        <Marquee
          text="Cocina de Autor"
          speed={30}
          separator="✦"
          className="py-6 bg-text-main border-y border-text-main/10 md:-rotate-1 md:scale-[1.02]"
          textClassName="text-bg-body font-heading text-2xl md:text-4xl italic tracking-widest opacity-80"
        />
        <Marquee
          text="Distrito Gourmet"
          speed={35}
          reverse
          separator="—"
          className="py-4 bg-bg-body border-b border-text-main/10 md:rotate-1 md:scale-[1.02] -mt-3"
          textClassName="text-text-main/15 font-heading text-xl md:text-3xl uppercase tracking-[0.2em]"
        />
      </div>

      {/* Sección sobre la identidad del restaurante */}
      <section className="py-20 md:py-40 bg-bg-surface relative border-y border-text-main/5">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <ScrollReveal
              direction="left"
              distance={80}
              duration={0.9}
              className="lg:col-span-8 text-left relative flex flex-col justify-center order-2 lg:order-1 px-0"
            >
              <span className="block text-text-muted text-[12px] uppercase tracking-[3px] mb-8 font-body font-medium">
                / 02 Identidad
              </span>
              <TextReveal
                text="El Arte Contemporáneo"
                splitBy="word"
                as="h2"
                staggerDelay={0.08}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-heading text-text-main mb-7 leading-[1.1] tracking-normal"
              />

              <div className="h-[1px] w-full bg-text-main/10 mb-7"></div>

              <p className="text-text-muted mb-4 leading-relaxed font-body font-normal text-[15px] tracking-wide">
                En Distrito Gourmet trabajamos una cocina española contemporánea
                con producto de temporada, fondos lentos y una bodega pensada
                para acompañar cada servicio.
              </p>
              <p className="text-text-muted mb-4 leading-relaxed font-body font-normal text-[15px] tracking-wide">
                La carta cambia con el mercado: arroces, carnes maduradas,
                pescados de lonja y postres de obrador propio conviven con un
                menú degustación de formato corto.
              </p>
              <p className="text-text-muted mb-4 leading-relaxed font-body font-normal text-[15px] tracking-wide">
                Abrimos en Valencia de martes a domingo al mediodía y de martes
                a sábado por la noche. El equipo confirma cada reserva para
                cuidar el ritmo de sala.
              </p>
              <p className="text-text-muted mb-10 leading-relaxed font-body font-normal text-[15px] tracking-wide italic border-l-2 border-primary/20 pl-6">
                Precio medio a la carta: 40-55€ por persona. Menú degustación
                desde 59€, con opción de maridaje.
              </p>
              <Link
                to="/menu"
                className="font-body text-[12px] uppercase tracking-[2px] text-text-main border-b border-text-main pb-1 self-start hover:text-primary hover:border-primary transition-colors font-medium"
              >
                Explorar Identidad
              </Link>
            </ScrollReveal>

            <ScrollReveal
              direction="right"
              distance={80}
              duration={0.9}
              delay={0.2}
              className="lg:col-span-4 flex justify-center lg:justify-end order-1 lg:order-2 px-4 md:px-0"
            >
              <div className="w-full max-w-[500px] aspect-[3/4] overflow-hidden rounded-t-[250px] relative">
                <div className="absolute inset-0 border border-text-main/10 rounded-t-[250px] z-20 pointer-events-none"></div>
                <ParallaxImage
                  src="/bodega.png"
                  alt="Interior bodegón"
                  speed={40}
                  className="w-full h-full rounded-t-[250px]"
                  imageClassName="saturate-50 hover:saturate-100 transition-all duration-1000"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Los pilares que definen nuestra visión */}
      <section className="py-24 md:py-32 bg-bg-body">
        <div className="container">
          <ScrollReveal className="text-center mb-20">
            <span className="block text-text-muted text-[12px] uppercase tracking-[3px] mb-6 font-body font-medium">
              / 03 La Visión
            </span>
            <TextReveal
              text="Arquitectura Sensorial"
              splitBy="word"
              as="h2"
              staggerDelay={0.1}
              className="text-5xl md:text-6xl font-heading text-text-main leading-tight mb-4 justify-center"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Columna 1 */}
            <ScrollReveal
              direction="up"
              distance={40}
              delay={0}
              className="md:border-r border-b md:border-b-0 border-text-main/10 p-8 md:p-12 md:pl-0 flex flex-col justify-start"
            >
              <span className="text-5xl text-text-main/45 font-heading font-semibold mb-6 block leading-none">
                01.
              </span>
              <h3 className="text-3xl font-heading text-text-main mb-6 leading-tight">
                Materia Prima
              </h3>
              <p className="text-text-muted font-body font-normal text-[14px] leading-relaxed tracking-wide">
                Selección diaria de producto local de extrema calidad. Trato
                reverencial al productor y obsesión por la frescura inmaculada.
              </p>
            </ScrollReveal>

            {/* Columna 2 */}
            <ScrollReveal
              direction="up"
              distance={40}
              delay={0.15}
              className="md:border-r border-b md:border-b-0 border-text-main/10 p-8 md:p-12 flex flex-col justify-start"
            >
              <span className="text-5xl text-text-main/45 font-heading font-semibold mb-6 block leading-none">
                02.
              </span>
              <h3 className="text-3xl font-heading text-text-main mb-6 leading-tight">
                Bodega Cercana
              </h3>
              <p className="text-text-muted font-body font-normal text-[14px] leading-relaxed tracking-wide">
                Referencias nacionales y mediterráneas elegidas para acompañar
                la carta, con opciones por copa y maridaje en menú degustación.
              </p>
            </ScrollReveal>

            {/* Columna 3 */}
            <ScrollReveal
              direction="up"
              distance={40}
              delay={0.3}
              className="p-8 md:p-12 md:pr-0 flex flex-col justify-start border-b md:border-b-0 border-text-main/10"
            >
              <span className="text-5xl text-text-main/45 font-heading font-semibold mb-6 block leading-none">
                03.
              </span>
              <h3 className="text-3xl font-heading text-text-main mb-6 leading-tight">
                Sala
              </h3>
              <p className="text-text-muted font-body font-normal text-[14px] leading-relaxed tracking-wide">
                Una sala cálida y urbana, con pocas mesas, servicio cercano e
                iluminación pensada para comer sin prisas.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Invitación final para reservar mesa */}
      <section className="py-24 md:py-32 bg-text-main text-bg-body">
        <div className="container">
          <ScrollReveal className="max-w-4xl mx-auto text-center mb-16">
            <span className="block text-bg-body text-[12px] uppercase tracking-[3px] mb-6 font-body font-medium">
              / 04 Reserva
            </span>
            <TextReveal
              text="Asegure su Mesa"
              splitBy="word"
              as="h2"
              staggerDelay={0.12}
              className="text-4xl sm:text-5xl md:text-6xl font-heading text-bg-body leading-tight mb-8 justify-center"
            />
            <LineReveal
              className="bg-bg-body/20 mx-auto mb-8"
              style={{ width: "6rem" }}
            />
            <p className="text-bg-body/70 text-sm md:text-base font-body font-normal max-w-lg mx-auto tracking-wide leading-loose">
              Reserva online para comida y cena. Confirmamos disponibilidad y
              preferencias antes del servicio.
            </p>
          </ScrollReveal>

          <ScrollReveal
            delay={0.2}
            className="flex justify-center flex-col items-center"
          >
            <MagneticButton as="div" strength={10} className="cursor-pointer">
              <div>
                <Link
                  to="/reservations"
                  className="group relative px-12 py-5 bg-transparent border border-bg-body text-bg-body font-body text-[12px] uppercase tracking-[3px] overflow-hidden transition-all hover:border-primary focus:outline-none w-full sm:w-auto text-center inline-block"
                >
                  <div className="absolute inset-0 w-0 bg-primary transition-all duration-[400ms] ease-out group-hover:w-full"></div>
                  <span className="relative z-10 font-bold group-hover:text-white transition-colors duration-300">
                    Solicitar Reserva
                  </span>
                </Link>
              </div>
            </MagneticButton>
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
};

export default HomeView;
