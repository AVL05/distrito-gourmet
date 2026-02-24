import { Link } from "react-router-dom";
import ReservationForm from "../components/ReservationForm";

const HomeView = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/sala_de_restaurante .png')" }}
        >
        </div>

        <div className="relative z-10 px-4 max-w-5xl mx-auto animate-fade-in flex flex-col items-center justify-center h-full">
          <div className="backdrop-blur-md bg-white/90 p-12 rounded-3xl border border-gray-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col items-center">
            <span className="block text-primary text-xs md:text-sm uppercase tracking-[8px] mb-6 font-body opacity-90">
              Tres Estrellas Michelin
            </span>
            <h1 className="text-6xl md:text-8xl font-heading text-text-main mb-8 tracking-[0.1em] font-light">
              DISTRITO
              <br />
              <span className="italic text-5xl md:text-7xl text-primary font-serif">Gourmet</span>
            </h1>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mb-10"></div>
            <p className="text-lg md:text-xl text-gray-500 font-light mb-12 max-w-2xl mx-auto leading-relaxed tracking-wide">
              Donde la alta cocina abraza sus raíces. Una experiencia sensorial
              diseñada para trascender el tiempo y el espacio.
            </p>
            <div className="flex gap-6">
              <Link
                to="/reservations"
                className="group relative px-12 py-4 bg-primary text-black font-body text-xs uppercase tracking-[3px] overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(197,160,89,0.4)]"
              >
                <div className="absolute inset-0 w-0 bg-white transition-all duration-[250ms] ease-out group-hover:w-full"></div>
                <span className="relative text-black font-semibold tracking-[4px]">Reservar Mesa</span>
              </Link>
              <Link
                to="/menu"
                className="px-12 py-4 bg-transparent border border-gray-200 text-gray-900 font-body text-xs uppercase tracking-[3px] hover:border-primary hover:text-primary transition-all duration-300"
              >
                Menú Degustación
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-bg-body relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="text-left relative">
              <div className="absolute -left-10 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent hidden md:block"></div>
              <span className="block text-primary text-xs uppercase tracking-[4px] mb-4 font-body opacity-80">
                Nuestra Esencia
              </span>
              <h2 className="text-5xl font-heading text-gray-900 mb-10 leading-snug">
                El Arte de la <br/> <span className="italic font-light text-primary-hover">Paciencia</span>
              </h2>
              <p className="text-gray-500 mb-8 leading-loose font-light text-lg">
                En Distrito Gourmet, cada plato es el resultado de una búsqueda
                incansable de la perfección. No solo cocinamos ingredientes;
                narramos historias a través de texturas y aromas que evocan los
                orígenes más profundos de nuestra tierra.
              </p>
              <p className="text-gray-500 mb-12 leading-loose font-light text-lg">
                Nuestro espacio ha sido concebido matemáticamente para garantizar la acústica perfecta, desconectar del ruido
                exterior y conectar con la esencia del momento presente. Un santuario para los cinco sentidos.
              </p>
              <Link
                to="/menu"
                className="group inline-flex items-center gap-4 text-gray-900 uppercase tracking-[3px] text-xs pb-2 border-b border-primary hover:text-primary transition-colors duration-300"
              >
                <span>Descubrir La Carta</span>
                <span className="transform transition-transform group-hover:translate-x-2">→</span>
              </Link>
            </div>

            {/* Visual Placeholder */}
            <div className="relative h-[600px] w-full overflow-hidden shadow-xl group">
              <div className="absolute inset-0 bg-[url('/bodega.png')] bg-cover bg-center group-hover:scale-105 transition-transform duration-[1.5s] ease-in-out"></div>
              {/* Elegant floating badge */}
              <div className="absolute bottom-8 right-8 z-20 bg-bg-surface/80 backdrop-blur-md border border-gray-200 p-6 rounded-xl">
                <p className="font-heading text-primary text-2xl">10.000+</p>
                <p className="text-xs uppercase tracking-[2px] text-gray-500 mt-1">Botellas en Bodega</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 bg-bg-surface border-y border-gray-100">
        <div className="container text-center">
          <span className="block text-primary text-xs uppercase tracking-[2px] mb-2 font-body">
            Descubre
          </span>
          <h2 className="text-3xl md:text-4xl font-heading text-gray-900 mb-16">
            Experiencia Sensorial
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 border border-gray-100 hover:border-primary/30 transition-colors duration-300">
              <h3 className="text-xl font-heading text-gray-900 mb-4">
                Materia Prima
              </h3>
              <p className="text-text-muted font-light">
                Selección diaria de producto local de la más alta calidad.
              </p>
            </div>
            <div className="p-8 border border-gray-100 hover:border-primary/30 transition-colors duration-300">
              <h3 className="text-xl font-heading text-gray-900 mb-4">
                Vinos de Autor
              </h3>
              <p className="text-text-muted font-light">
                Maridaje exclusivo con bodegas boutique y referencias únicas.
              </p>
            </div>
            <div className="p-8 border border-gray-100 hover:border-primary/30 transition-colors duration-300">
              <h3 className="text-xl font-heading text-gray-900 mb-4">Ambiente</h3>
              <p className="text-text-muted font-light">
                Diseño acústico e iluminación tenue para garantizar la
                intimidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 z-0 origin-top-left scale-110"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading text-gray-900 mb-6">
              Reserva tu Mesa
            </h2>
            <p className="text-text-muted text-lg font-light max-w-2xl mx-auto">
              Un número limitado de comensales por servicio para garantizar la
              excelencia en cada detalle.
            </p>
          </div>

          <div className="flex justify-center">
            <ReservationForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
