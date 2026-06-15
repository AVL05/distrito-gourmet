import { useState } from "react";
import {
  AnimatePresence,
  useReducedMotion,
  PageTransition,
  FadeIn,
  Toast,
  ScrollReveal,
  TextReveal,
  LineReveal,
  motion,
} from "@/motion";

// Vista de contacto: presenta la ubicación del local, información de comunicación y formulario de consultas
const ContactView = () => {
  const MESSAGE_MAX_LENGTH = 500;
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});
  const shouldReduceMotion = useReducedMotion();
  const subjectOptions = [
    "Reserva",
    "Evento privado",
    "Alergias",
    "Prensa / colaboración",
    "Otra consulta",
  ];

  const validateForm = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Introduzca su nombre.";
    if (!form.email.trim()) {
      nextErrors.email = "Introduzca su correo.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Introduzca un correo válido.";
    }
    if (!form.subject) nextErrors.subject = "Seleccione el motivo.";
    if (!form.message.trim()) {
      nextErrors.message = "Escriba su consulta.";
    } else if (form.message.length > MESSAGE_MAX_LENGTH) {
      nextErrors.message = `Máximo ${MESSAGE_MAX_LENGTH} caracteres.`;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const { [field]: _removed, ...rest } = current;
      return rest;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSending(true);
    window.setTimeout(() => {
      setSent(true);
      setSending(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    }, 500);
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
          <LineReveal
            className="bg-text-main/10 mx-auto"
            style={{ maxWidth: "4rem" }}
          />
        </ScrollReveal>

        <FadeIn
          delay={0.15}
          className="grid grid-cols-1 lg:grid-cols-5 gap-0 border border-text-main/10 bg-bg-surface"
        >
          {/* Info - Takes 2 cols */}
          <div className="lg:col-span-2 flex flex-col justify-start space-y-12 sm:space-y-16 p-8 sm:p-12 md:p-16 border-b lg:border-b-0 lg:border-r border-text-main/10">
            <div>
              <h3 className="font-heading text-2xl text-text-main mb-6">
                Ubicación
              </h3>
              <div>
                <p className="text-text-muted font-body font-normal leading-relaxed text-[15px] tracking-wide mb-6">
                  Ciutat Vella
                  <br />
                  Calle del Mercado, 18
                  <br />
                  46000, Valencia
                </p>
                <span className="font-body text-[10px] uppercase tracking-[3px] text-text-main/50">
                  Zona centro · Acceso peatonal recomendado
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-2xl text-text-main mb-6">
                Comunicación
              </h3>
              <div className="text-text-muted font-body font-normal leading-relaxed text-[14px]">
                <p className="mb-4">
                  <span className="block text-[10px] uppercase tracking-[3px] text-text-main/50 mb-1">
                    Mesa y Reservas
                  </span>
                  <span>+34 960 00 00 00</span>
                </p>
                <p className="mb-4">
                  <span className="block text-[10px] uppercase tracking-[3px] text-text-main/50 mb-1">
                    Privados & Eventos
                  </span>
                  <span>eventos@distritogourmet.es</span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-2xl text-text-main mb-6">
                Horario
              </h3>
              <div className="grid grid-cols-2 gap-8 text-text-muted font-body font-normal text-[14px] tracking-wide">
                <div>
                  <span className="block text-primary uppercase text-[10px] tracking-[3px] mb-2 font-bold">
                    Comidas
                  </span>
                  <span className="block mb-1">Martes a Domingo</span>
                  <span className="block text-text-main">13:30 - 15:30</span>
                </div>
                <div>
                  <span className="block text-primary uppercase text-[10px] tracking-[3px] mb-2 font-bold">
                    Cenas
                  </span>
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
                Atención{" "}
                <span className="italic text-primary">Personalizada</span>
              </h3>
              <p className="text-text-muted text-[13px] sm:text-[14px] font-body font-normal tracking-wide mb-10 sm:mb-12">
                Cuéntenos el motivo de su consulta y el equipo de sala le
                responderá con la mayor brevedad posible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
                <div className="relative group">
                  <label
                    htmlFor="contact-name"
                    className="text-[10px] uppercase tracking-[3px] text-text-muted block mb-2 font-body"
                  >
                    Nombre y Apellidos
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    required
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    className={`w-full bg-transparent border-0 border-b text-text-main py-2 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-transparent text-lg font-heading ${
                      errors.name ? "border-red-700" : "border-text-main/20"
                    }`}
                    placeholder="Escriba su nombre"
                  />
                  {errors.name && (
                    <p id="contact-name-error" className="mt-2 text-[12px] text-red-800">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="relative group">
                  <label
                    htmlFor="contact-email"
                    className="text-[10px] uppercase tracking-[3px] text-text-muted block mb-2 font-body"
                  >
                    Correo Electrónico
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    required
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={
                      errors.email ? "contact-email-error" : undefined
                    }
                    className={`w-full bg-transparent border-0 border-b text-text-main py-2 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-transparent text-lg font-heading ${
                      errors.email ? "border-red-700" : "border-text-main/20"
                    }`}
                    placeholder="contacto@ejemplo.com"
                  />
                  {errors.email && (
                    <p id="contact-email-error" className="mt-2 text-[12px] text-red-800">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="relative group">
                  <label
                    htmlFor="contact-subject"
                    className="text-[10px] uppercase tracking-[3px] text-text-muted block mb-2 font-body"
                  >
                    Motivo
                  </label>
                  <select
                    id="contact-subject"
                    value={form.subject}
                    onChange={(e) => updateField("subject", e.target.value)}
                    required
                    aria-invalid={!!errors.subject}
                    aria-describedby={
                      errors.subject ? "contact-subject-error" : undefined
                    }
                    className={`w-full bg-transparent border-0 border-b text-text-main py-2 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 text-lg font-heading ${
                      errors.subject ? "border-red-700" : "border-text-main/20"
                    }`}
                  >
                    <option value="" disabled>
                      Seleccione motivo
                    </option>
                    {subjectOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p id="contact-subject-error" className="mt-2 text-[12px] text-red-800">
                      {errors.subject}
                    </p>
                  )}
                </div>
                <div className="relative group">
                  <label
                    htmlFor="contact-message"
                    className="text-[10px] uppercase tracking-[3px] text-text-muted block mb-2 font-body"
                  >
                    Mensaje / Consulta
                  </label>
                  <textarea
                    id="contact-message"
                    rows="4"
                    value={form.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    required
                    maxLength={MESSAGE_MAX_LENGTH}
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message ? "contact-message-error" : undefined
                    }
                    className={`w-full bg-transparent border-0 border-b text-text-main py-2 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 resize-none placeholder:text-transparent text-lg font-heading ${
                      errors.message ? "border-red-700" : "border-text-main/20"
                    }`}
                    placeholder="¿En qué podemos ayudarle?"
                  ></textarea>
                  <div className="mt-2 flex items-start justify-between gap-4 text-[11px] leading-relaxed text-text-muted">
                    <p>Incluya fecha, horario o número de personas si procede.</p>
                    <span className="shrink-0">
                      {form.message.length}/{MESSAGE_MAX_LENGTH}
                    </span>
                  </div>
                  {errors.message && (
                    <p id="contact-message-error" className="mt-2 text-[12px] text-red-800">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="pt-8">
                  <motion.button
                    type="submit"
                    whileHover={
                      shouldReduceMotion ? undefined : { scale: 1.02 }
                    }
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                    className="group relative w-full py-4 bg-transparent border border-text-main text-text-main font-body text-[10px] uppercase tracking-[4px] overflow-hidden transition-all hover:border-text-main"
                    disabled={sending}
                  >
                    <div className="absolute inset-0 w-0 bg-text-main transition-all duration-[400ms] ease-out group-hover:w-full z-0"></div>
                    <span className="relative z-10 font-bold group-hover:text-bg-body transition-colors duration-300">
                      {sending ? "ENVIANDO..." : "ENVIAR MENSAJE"}
                    </span>
                  </motion.button>
                </div>

                <AnimatePresence>
                  {sent && (
                    <Toast className="p-4 bg-primary/5 border border-primary/20 text-primary text-center text-[12px] sm:text-[13px] font-normal tracking-wide mt-6 font-body">
                      Su mensaje ha sido enviado. Le responderemos con la mayor
                      brevedad posible.
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
