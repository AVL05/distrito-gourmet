import { useState } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  PageTransition,
  FadeIn,
  Toast,
  ScrollReveal,
  TextReveal,
  LineReveal,
} from '@/motion';

const ContactView = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <PageTransition className="bg-bg-body min-h-screen pt-32 sm:pt-40 pb-32 px-4 relative overflow-hidden">
      {/* Líneas decorativas de fondo */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-text-main/5 -translate-x-1/2 z-0 hidden md:block"></div>

      <div className="container max-w-6xl relative z-10">
        <ScrollReveal className="text-center mb-16 sm:mb-24 relative">
          <span className="block text-text-muted text-[10px] uppercase tracking-[4px] mb-6 sm:mb-8 font-body">
            / 05 Localización
          </span>
          <TextReveal
            text="Nuestra Dirección"
            splitBy="word"
            as="h1"
            staggerDelay={0.1}
            className="font-heading text-4xl sm:text-5xl md:text-7xl text-text-main mb-8 leading-tight justify-center"
          />
          <LineReveal className="bg-text-main/10 mx-auto" style={{ maxWidth: '4rem' }} />
        </ScrollReveal>

        <FadeIn delay={0.15} className="grid grid-cols-1 lg:grid-cols-5 gap-0 border border-text-main/10 bg-bg-surface">
          {/* Info - Takes 2 cols */}
          <div className="lg:col-span-2 flex flex-col justify-start space-y-12 sm:space-y-16 p-8 sm:p-12 md:p-16 border-b lg:border-b-0 lg:border-r border-text-main/10">
            <div>
              <h3 className="font-heading text-2xl text-text-main mb-6">Ubicación</h3>
              <div>
                <p className="text-text-muted font-body font-light leading-relaxed text-[15px] tracking-wide mb-6">
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
                  className="font-body text-[10px] uppercase tracking-[3px] text-text-main border-b border-text-main pb-1 hover:text-primary hover:border-primary transition-colors">
                  Abrir en el mapa
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-2xl text-text-main mb-6">Comunicación</h3>
              <div className="text-text-muted font-body font-light leading-relaxed text-[14px]">
                <p className="mb-4">
                  <span className="block text-[10px] uppercase tracking-[3px] text-text-main/50 mb-1">
                    Mesa y Reservas
                  </span>
                  <a href="tel:+34900000000" className="hover:text-primary transition-colors">
                    +34 900 000 000
                  </a>
                </p>
                <p className="mb-4">
                  <span className="block text-[10px] uppercase tracking-[3px] text-text-main/50 mb-1">
                    Privados & Eventos
                  </span>
                  <a href="mailto:eventos@distritogourmet.com" className="hover:text-primary transition-colors">
                    eventos@distritogourmet.com
                  </a>
                </p>
                <p>
                  <span className="block text-[10px] uppercase tracking-[3px] text-text-main/50 mb-1">Prensa</span>
                  <a href="mailto:press@distritogourmet.com" className="hover:text-primary transition-colors">
                    press@distritogourmet.com
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-2xl text-text-main mb-6">Horario</h3>
              <div className="grid grid-cols-2 gap-8 text-text-muted font-body font-light text-[14px] tracking-wide">
                <div>
                  <span className="block text-primary uppercase text-[10px] tracking-[3px] mb-2 font-bold">
                    Comidas
                  </span>
                  <span className="block mb-1">Martes a Domingo</span>
                  <span className="block text-text-main">13:30 - 15:30</span>
                </div>
                <div>
                  <span className="block text-primary uppercase text-[10px] tracking-[3px] mb-2 font-bold">Cenas</span>
                  <span className="block mb-1">Martes a Sábado</span>
                  <span className="block text-text-main">20:30 - 22:30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form - Takes 3 cols */}
          <div className="lg:col-span-3">
            <div className="p-8 sm:p-12 md:p-16 h-full flex flex-col justify-center relative">
              <h3 className="font-heading text-3xl sm:text-4xl text-text-main mb-4 leading-tight">
                Atención <span className="italic text-primary">Personalizada</span>
              </h3>
              <p className="text-text-muted text-[13px] sm:text-[14px] font-body font-light tracking-wide mb-10 sm:mb-12">
                Nuestro equipo de Guest Relations le atenderá con la extrema diligencia que precisa su consulta.
              </p>

              <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
                <div className="relative group">
                  <label className="text-[10px] uppercase tracking-[3px] text-text-muted block mb-2 font-body">
                    Nombre y Apellidos
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full bg-transparent border-0 border-b border-text-main/20 text-text-main py-2 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-transparent text-lg font-heading"
                    placeholder="Escriba su nombre"
                  />
                </div>
                <div className="relative group">
                  <label className="text-[10px] uppercase tracking-[3px] text-text-muted block mb-2 font-body">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full bg-transparent border-0 border-b border-text-main/20 text-text-main py-2 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-transparent text-lg font-heading"
                    placeholder="contacto@ejemplo.com"
                  />
                </div>
                <div className="relative group">
                  <label className="text-[10px] uppercase tracking-[3px] text-text-muted block mb-2 font-body">
                    Mensaje / Consulta
                  </label>
                  <textarea
                    rows="4"
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    required
                    className="w-full bg-transparent border-0 border-b border-text-main/20 text-text-main py-2 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 resize-none placeholder:text-transparent text-lg font-heading"
                    placeholder="¿En qué podemos ayudarle?"></textarea>
                </div>

                <div className="pt-8">
                  <motion.button
                    type="submit"
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                    className="group relative w-full py-4 bg-transparent border border-text-main text-text-main font-body text-[10px] uppercase tracking-[4px] overflow-hidden transition-all hover:border-text-main">
                    <div className="absolute inset-0 w-0 bg-text-main transition-all duration-[400ms] ease-out group-hover:w-full z-0"></div>
                    <span className="relative z-10 font-bold group-hover:text-bg-body transition-colors duration-300">
                      ENVIAR MENSAJE
                    </span>
                  </motion.button>
                </div>

                <AnimatePresence>
                  {sent && (
                    <Toast className="p-4 bg-primary/5 border border-primary/20 text-primary text-center text-[12px] sm:text-[13px] font-light tracking-wide mt-6 font-body">
                      Su mensaje ha sido enviado a nuestras oficinas. Le responderemos en un plazo máximo de 24 horas.
                    </Toast>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
};

export default ContactView;
