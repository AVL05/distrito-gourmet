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
    title: "Responsable del tratamiento",
    body: [
      "Distrito Gourmet es un proyecto académico ficticio. No corresponde a un restaurante real ni presta servicios comerciales.",
      "Los datos de contacto publicados, incluido info@distrito-gourmet.test, son inventados y se muestran únicamente para completar la experiencia de interfaz.",
    ],
  },
  {
    title: "Datos personales tratados",
    body: [
      "La aplicación puede solicitar datos en formularios de registro, login, reserva, contacto o pedido para simular una experiencia completa de restaurante digital.",
      "No deben introducirse datos personales reales. Se recomienda usar nombres, correos, teléfonos y credenciales ficticias durante cualquier prueba.",
      "También puede almacenarse información técnica local, como token de sesión de prueba, usuario simulado, carrito y preferencias necesarias para el funcionamiento de la SPA.",
    ],
  },
  {
    title: "Finalidades",
    body: [
      "Los datos se utilizan únicamente para demostrar flujos funcionales: autenticación, reservas, pedidos, panel de cliente, panel de administración y formularios.",
      "Las alergias, preferencias o comentarios introducidos tienen finalidad demostrativa y no serán atendidos por un equipo real de sala o cocina.",
    ],
  },
  {
    title: "Base jurídica",
    body: [
      "Al tratarse de un proyecto académico, la base del tratamiento es la ejecución técnica de una demostración solicitada por el propio usuario evaluador.",
      "Si el proyecto se desplegara públicamente con persistencia real de datos, debería revisarse y adaptarse esta política antes de admitir usuarios reales.",
    ],
  },
  {
    title: "Conservación",
    body: [
      "Los datos de prueba pueden conservarse en almacenamiento local del navegador o en una base de datos de desarrollo mientras dure la evaluación del proyecto.",
      "El usuario puede borrar el almacenamiento local desde su navegador. En entornos de desarrollo, los datos de prueba pueden eliminarse reiniciando o limpiando la base de datos.",
    ],
  },
  {
    title: "Comunicación de datos",
    body: [
      "No se venden datos ni se comparten con un restaurante real. La aplicación puede depender de servicios técnicos de hosting, repositorio o despliegue propios del entorno académico.",
      "Los enlaces externos o herramientas de terceros, si se usan, quedan sujetos a sus propias condiciones.",
    ],
  },
  {
    title: "Derechos del usuario",
    body: [
      "En una evaluación académica, el usuario puede eliminar los datos locales desde el navegador o solicitar al responsable del proyecto que limpie los datos de prueba persistidos.",
      "No deben introducirse datos de terceros ni información sensible en ningún formulario de la aplicación.",
    ],
  },
  {
    title: "Seguridad",
    body: [
      "El proyecto incorpora patrones básicos de autenticación, rutas protegidas y consumo de API con finalidad formativa.",
      "No debe considerarse un entorno productivo para gestionar información real sin una auditoría previa de seguridad, privacidad y despliegue.",
    ],
  },
];

const PrivacyPolicyView = () => (
  <PageTransition className="bg-bg-body min-h-screen pt-32 sm:pt-40 pb-32 px-4 relative overflow-hidden">
    <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-text-main/5 -translate-x-1/2 z-0 hidden md:block" />

    <div className="container max-w-4xl relative z-10">
      <ScrollReveal className="text-center mb-16 sm:mb-20">
        <span className="block text-text-muted text-[10px] uppercase tracking-[4px] mb-6 sm:mb-8 font-body">
          / Privacidad
        </span>
        <TextReveal
          text="Política de Privacidad"
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
            to="/legal"
            className="font-body text-[11px] uppercase tracking-[2px] text-text-main border-b border-text-main pb-1 hover:text-primary hover:border-primary transition-colors font-medium"
          >
            Aviso legal
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

export default PrivacyPolicyView;
