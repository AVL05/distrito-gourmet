import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  PageTransition,
  TextReveal,
  ScrollReveal,
  ParallaxImage,
  MagneticButton,
  LineReveal,
} from "@/motion";

const HomeView = () => {
  return (
    <PageTransition className="w-full">
      <Helmet>
        <title>Distrito Gourmet | Cocina Española Contemporánea</title>
        <meta name="description" content="Restaurante de cocina española contemporánea en Valencia. Carta de temporada, bodega seleccionada y reservas online." />
      </Helmet>

      <section className="bg-bg-body border-b border-text-main/10">
        <div className="container grid lg:grid-cols-12 gap-8 lg:gap-12 items-center py-10 sm:py-14 lg:py-16">
          <div className="lg:col-span-5">
            <p className="text-xs text-primary-hover uppercase tracking-[0.16em] mb-6">Distrito Gourmet · Cocina española</p>
            <h1 className="font-heading normal-case tracking-tight text-[clamp(2.75rem,5vw,5rem)] leading-[1.08] mb-6">
              Cocina de temporada.<br />
              <span className="italic text-primary-hover">Tiempo para disfrutar.</span>
            </h1>
            <p className="text-text-muted leading-relaxed max-w-md mb-8">
              Entrantes para compartir, cocina de raíz española y una bodega
              para acompañar la mesa. Descubra la carta y elija su próxima visita.
            </p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <Link to="/reservations" className="inline-flex min-h-12 items-center justify-center bg-text-main text-bg-body px-6 py-4 text-xs font-semibold uppercase tracking-widest hover:bg-primary-hover transition-colors">
                Reservar mesa
              </Link>
              <Link to="/menu" className="inline-flex min-h-12 items-center text-sm underline underline-offset-4 hover:text-primary-hover transition-colors">
                Descubrir la carta
              </Link>
            </div>
          </div>
          <figure className="lg:col-span-7 m-0">
            <img src="/pulpo-parmentier.webp" srcSet="/pulpo-parmentier-640.webp 640w, /pulpo-parmentier-960.webp 960w, /pulpo-parmentier.webp 1536w" sizes="(min-width: 1024px) 55vw, 100vw" width="1536" height="1024" fetchPriority="high" decoding="async" alt="Pulpo a la brasa sobre parmentier de patata, con pimentón" className="w-full h-auto aspect-3/2 object-cover" />
            <figcaption className="flex flex-wrap justify-between gap-2 pt-4 text-xs text-text-muted">
              <span>De nuestra carta</span>
              <span>Pulpo a la brasa · Parmentier trufado</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="py-16 md:py-24 border-y border-text-main/10 bg-bg-surface">
        <div className="container grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <img src="/sala-restaurante.webp" width="1536" height="1024" loading="lazy" decoding="async" alt="Sala de Distrito Gourmet, con mesas de madera e iluminación cálida" className="w-full h-auto aspect-3/2 object-cover" />
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm text-primary-hover mb-4">La sala</p>
            <h2 className="text-3xl md:text-4xl normal-case tracking-normal leading-tight">Una mesa para disfrutar sin prisas</h2>
            <p className="text-text-muted leading-relaxed mb-6">Una sala cálida y urbana, con pocas mesas y un servicio cercano. Elija día, hora y número de comensales para preparar su próxima visita.</p>
            <Link to="/reservations" className="btn btn-outline">Consultar disponibilidad</Link>
          </div>
        </div>
      </section>

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
                La casa
              </span>
              <TextReveal
                text="Una Casa de Temporada"
                splitBy="word"
                as="h2"
                staggerDelay={0.08}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-heading text-text-main mb-7 leading-[1.1] tracking-normal"
              />

              <div className="h-px w-full bg-text-main/10 mb-7"></div>

              <p className="text-text-muted mb-4 leading-relaxed font-body font-normal text-[15px] tracking-wide">
                Distrito Gourmet nace como una cocina urbana de raíz española,
                con una carta breve, producto de temporada y un servicio de sala
                cercano.
              </p>
              <p className="text-text-muted mb-4 leading-relaxed font-body font-normal text-[15px] tracking-wide">
                La propuesta combina entrantes para compartir, arroces, carnes,
                pescados de lonja y postres de obrador, junto a una bodega
                pensada para acompañar cada momento de la comida.
              </p>
              <p className="text-text-muted mb-4 leading-relaxed font-body font-normal text-[15px] tracking-wide">
                La sala trabaja con pocas mesas para cuidar el ritmo del
                servicio, las preferencias de cada reserva y los detalles que
                hacen que una comida sea cómoda desde la llegada.
              </p>
              <Link
                to="/menu"
                className="font-body text-[12px] uppercase tracking-[2px] text-text-main border-b border-text-main pb-1 self-start hover:text-primary hover:border-primary transition-colors font-medium"
              >
                Explorar la carta
              </Link>
            </ScrollReveal>

            <ScrollReveal
              direction="right"
              distance={80}
              duration={0.9}
              delay={0.1}
              className="lg:col-span-4 flex justify-center lg:justify-end order-1 lg:order-2 px-4 md:px-0"
            >
              <div className="w-full max-w-[500px] aspect-3/4 overflow-hidden rounded-t-[250px] relative">
                <div className="absolute inset-0 border border-text-main/10 rounded-t-[250px] z-20 pointer-events-none"></div>
                <ParallaxImage
                  src="/bodega.webp"
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

      <section className="py-24 md:py-32 bg-bg-body">
        <div className="container">
          <ScrollReveal className="text-center mb-20">
            <span className="block text-text-muted text-[12px] uppercase tracking-[3px] mb-6 font-body font-medium">
              Nuestra cocina
            </span>
            <TextReveal
              text="Producto, cocina y sala"
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
                Producto de temporada como punto de partida. Preparaciones que
                respetan el sabor de cada ingrediente.
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

      <section className="py-24 md:py-32 bg-text-main text-bg-body">
        <div className="container">
          <ScrollReveal className="max-w-4xl mx-auto text-center mb-16">
            <span className="block text-bg-body text-[12px] uppercase tracking-[3px] mb-6 font-body font-medium">
              Su próxima visita
            </span>
            <TextReveal
              text="Reserve su mesa"
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
            delay={0.1}
            className="flex justify-center flex-col items-center"
          >
            <MagneticButton as="div" strength={10} className="cursor-pointer">
              <div>
                <Link
                  to="/reservations"
                  className="group relative px-12 py-5 bg-transparent border border-bg-body/60 text-bg-body font-body text-[12px] uppercase tracking-[3px] overflow-hidden transition-all hover:border-primary-light focus-visible:outline w-full sm:w-auto text-center inline-block"
                >
                  <div className="absolute inset-0 w-0 bg-primary-light transition-all duration-400 ease-out group-hover:w-full"></div>
                  <span className="relative z-10 font-bold group-hover:text-text-main transition-colors duration-300">
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
