import { Link } from "react-router-dom";
import {
  PageTransition,
  FadeIn,
  ScrollReveal,
  TextReveal,
  LineReveal,
} from "@/motion";

const sections = [
  {
    title: "Información del titular",
    body: [
      "Distrito Gourmet es un restaurante ficticio desarrollado como proyecto académico de final de curso por Alex Vicente López.",
      "La dirección Calle del Mercado, 18, el teléfono +34 960 00 00 00 y los correos publicados bajo distritogourmet.es son datos inventados para dar coherencia a la interfaz.",
    ],
  },
  {
    title: "Objeto del sitio web",
    body: [
      "La web simula la operativa digital de un restaurante: consulta de carta, reservas, pedidos de recogida, área de cliente y panel de administración.",
      "Ninguna reserva, pedido, precio, horario, ubicación o dato de contacto representa un servicio comercial real.",
    ],
  },
  {
    title: "Condiciones de uso",
    body: [
      "El sitio debe utilizarse únicamente con fines de evaluación, demostración técnica o uso académico.",
      "No deben introducirse datos personales reales, credenciales sensibles, información de pago real ni datos de terceros.",
      "Las funcionalidades pueden estar conectadas a datos de prueba, modo demo o backend local, por lo que su comportamiento no debe interpretarse como una contratación real.",
    ],
  },
  {
    title: "Reservas y pedidos",
    body: [
      "Las reservas y pedidos generados desde la aplicación son simulaciones destinadas a probar el flujo de usuario y la gestión administrativa.",
      "No existe una cocina, sala, equipo de reservas ni servicio de recogida asociado a esta marca ficticia.",
      "Los correos, teléfonos y mensajes mostrados en la interfaz no deben utilizarse como canales reales de comunicación.",
    ],
  },
  {
    title: "Propiedad intelectual",
    body: [
      "Los textos, diseño, código, estructura visual y contenidos creados para el proyecto pertenecen a su autor o a sus legítimos titulares.",
      "Las imágenes, iconos, librerías y recursos externos se utilizan con finalidad académica o conforme a sus licencias correspondientes.",
    ],
  },
  {
    title: "Responsabilidad",
    body: [
      "El proyecto puede contener datos simulados, limitaciones técnicas, errores o comportamientos propios de un entorno de desarrollo.",
      "El autor no asume responsabilidad por el uso de la aplicación fuera de su contexto académico o por la introducción de datos reales en un entorno de prueba.",
    ],
  },
];

const LegalNoticeView = () => (
  <PageTransition className="bg-bg-body min-h-screen pt-32 sm:pt-40 pb-32 px-4 relative overflow-hidden">
    <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-text-main/5 -translate-x-1/2 z-0 hidden md:block" />

    <div className="container max-w-4xl relative z-10">
      <ScrollReveal className="text-center mb-16 sm:mb-20">
        <span className="block text-text-muted text-[10px] uppercase tracking-[4px] mb-6 sm:mb-8 font-body">
          / Legal
        </span>
        <TextReveal
          text="Aviso Legal"
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

      <FadeIn className="border border-text-main/10 bg-bg-surface p-8 sm:p-12 md:p-16">
        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-heading text-2xl sm:text-3xl text-text-main mb-5">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-text-muted text-sm sm:text-base leading-relaxed tracking-wide"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-text-main/10 flex flex-col sm:flex-row gap-4 sm:gap-8">
          <Link
            to="/privacy"
            className="font-body text-[11px] uppercase tracking-[2px] text-text-main border-b border-text-main pb-1 hover:text-primary hover:border-primary transition-colors font-medium"
          >
            Política de privacidad
          </Link>
          <Link
            to="/cookies"
            className="font-body text-[11px] uppercase tracking-[2px] text-text-main border-b border-text-main pb-1 hover:text-primary hover:border-primary transition-colors font-medium"
          >
            Política de cookies
          </Link>
        </div>
      </FadeIn>
    </div>
  </PageTransition>
);

export default LegalNoticeView;
