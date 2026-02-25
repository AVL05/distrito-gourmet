import { useState } from "react";

const ContactView = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="bg-bg-body min-h-screen pt-40 pb-32 px-4 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none translate-y-1/2 -translate-x-1/3"></div>

      <div className="container max-w-6xl relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <span className="block text-primary text-xs uppercase tracking-[6px] mb-4 font-body opacity-90">
            Estamos aquí
          </span>
          <h1 className="font-heading text-5xl uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-hover to-white mb-6">
            Contacto
          </h1>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 animate-fade-in delay-100">
          {/* Info - Takes 2 cols */}
          <div className="lg:col-span-2 flex flex-col justify-center space-y-16">
            <div>
              <h3 className="font-heading text-2xl text-gray-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-primary block"></span> Ubicación
              </h3>
              <div className="pl-12">
                <p className="text-gray-500 font-light leading-loose text-lg mb-6">
                  Distrito Financiero
                  <br />
                  Avenida de la Alta Gastronomía, 8
                  <br />
                  46004, Valencia, España
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-xs uppercase tracking-[3px] text-primary border-b border-primary/30 hover:border-primary transition-all pb-1 hover:-translate-y-1"
                >
                  Abrir en el mapa <span className="text-lg">↗</span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-2xl text-gray-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-primary block"></span> Comunicación
              </h3>
              <div className="pl-12 text-gray-500 font-light leading-loose text-lg">
                <p className="mb-4">
                  <span className="block text-xs uppercase tracking-[2px] text-gray-900/40 mb-1">Mesa y Reservas</span>
                  <a href="tel:+34900000000" className="hover:text-primary transition-colors">+34 900 000 000</a>
                </p>
                <p className="mb-4">
                  <span className="block text-xs uppercase tracking-[2px] text-gray-900/40 mb-1">Privados & Eventos</span>
                  <a href="mailto:eventos@distritogourmet.com" className="hover:text-primary transition-colors">eventos@distritogourmet.com</a>
                </p>
                <p>
                  <span className="block text-xs uppercase tracking-[2px] text-gray-900/40 mb-1">Prensa</span>
                  <a href="mailto:press@distritogourmet.com" className="hover:text-primary transition-colors">press@distritogourmet.com</a>
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-2xl text-gray-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-primary block"></span> Horario
              </h3>
              <div className="pl-12 grid grid-cols-2 gap-8 text-gray-500 font-light text-base tracking-wide">
                <div>
                  <span className="block text-primary uppercase text-[10px] tracking-[3px] mb-2 font-bold">Comidas</span>
                  <span className="block mb-1">Martes a Domingo</span>
                  <span className="block text-gray-900">13:30 - 15:30</span>
                </div>
                <div>
                  <span className="block text-primary uppercase text-[10px] tracking-[3px] mb-2 font-bold">Cenas</span>
                  <span className="block mb-1">Martes a Sábado</span>
                  <span className="block text-gray-900">20:30 - 22:30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form - Takes 3 cols */}
          <div className="lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-12 md:p-16 rounded-sm relative">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/50"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/50"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary/50"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-primary/50"></div>

              <h3 className="font-heading text-3xl text-gray-900 mb-2 font-light">
                Atención <span className="italic text-primary-hover">Personalizada</span>
              </h3>
              <p className="text-gray-500 text-sm font-light tracking-wide mb-10">
                Nuestro equipo de Guest Relations le atenderá con la mayor brevedad posible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="relative group">
                  <label className="text-[10px] uppercase tracking-[3px] text-primary/80 block mb-2 transition-colors group-focus-within:text-primary">
                    Nombre y Apellidos
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-gray-900/20 text-lg font-light"
                    placeholder="Escriba su nombre"
                  />
                </div>
                <div className="relative group">
                  <label className="text-[10px] uppercase tracking-[3px] text-primary/80 block mb-2 transition-colors group-focus-within:text-primary">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-gray-900/20 text-lg font-light"
                    placeholder="contacto@ejemplo.com"
                  />
                </div>
                <div className="relative group">
                  <label className="text-[10px] uppercase tracking-[3px] text-primary/80 block mb-2 transition-colors group-focus-within:text-primary">
                    Mensaje / Consulta
                  </label>
                  <textarea
                    rows="4"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    required
                    className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 resize-none placeholder:text-gray-900/20 text-lg font-light"
                    placeholder="¿En qué podemos ayudarle?"
                  ></textarea>
                </div>

                <div className="pt-6">
                  <button type="submit" className="group relative w-full py-5 bg-transparent border border-primary text-primary font-body text-xs uppercase tracking-[4px] overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(197,160,89,0.5)]">
                    <div className="absolute inset-0 w-0 bg-primary transition-all duration-[400ms] ease-out group-hover:w-full"></div>
                    <span className="relative z-10 font-bold tracking-[5px] group-hover:text-black transition-colors duration-300">ENVIAR MENSAJE</span>
                  </button>
                </div>

                {sent && (
                  <div className="p-4 bg-primary/10 border border-primary/30 text-primary text-center text-sm font-light tracking-wide animate-fade-in mt-6">
                    Su mensaje ha sido enviado a nuestras oficinas. Le responderemos en un plazo máximo de 24 horas.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
