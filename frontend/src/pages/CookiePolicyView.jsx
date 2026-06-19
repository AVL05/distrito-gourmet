import { Helmet } from "react-helmet-async";
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
    title: "Qué son las cookies",
    body: [
      "Las cookies y tecnologías similares son pequeños archivos o registros que se guardan en el navegador para recordar información técnica o preferencias durante la navegación.",
      "En este proyecto se utiliza principalmente almacenamiento local del navegador para mantener sesión de prueba, carrito y datos necesarios del funcionamiento de la aplicación.",
    ],
  },
  {
    title: "Cookies técnicas necesarias",
    body: [
      "Distrito Gourmet utiliza almacenamiento técnico para simular inicio de sesión, conservar el carrito y recordar datos básicos de navegación dentro del proyecto académico.",
      "Estas tecnologías son necesarias para probar la experiencia y no persiguen una finalidad comercial.",
    ],
  },
  {
    title: "Servicios externos",
    body: [
      "La web puede cargar recursos externos necesarios para la presentación visual, como fuentes o librerías, sujetos a las condiciones del proveedor correspondiente.",
      "Los enlaces sociales y datos de contacto mostrados en la interfaz son ficticios y no representan canales comerciales reales.",
    ],
  },
  {
    title: "Gestión desde el navegador",
    body: [
      "El usuario puede configurar su navegador para bloquear, eliminar o limitar cookies y almacenamiento local.",
      "Si se bloquean las tecnologías técnicas, algunas funciones de prueba como el carrito, la sesión de usuario o determinadas preferencias pueden dejar de funcionar correctamente.",
    ],
  },
  {
    title: "Actualizaciones",
    body: [
      "Esta política podrá actualizarse si el proyecto incorpora nuevas funcionalidades, despliegues o integraciones técnicas.",
      "Si el proyecto se transformara en una web comercial real, esta política debería revisarse antes de su publicación.",
    ],
  },
];

const CookiePolicyView = () => (
  <PageTransition className="bg-bg-body min-h-screen pt-32 sm:pt-40 pb-32 px-4 relative overflow-hidden">
    <Helmet><title>Política de Cookies | Distrito Gourmet</title></Helmet>
    <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-text-main/5 -translate-x-1/2 z-0 hidden md:block" />

    <div className="container max-w-4xl relative z-10">
      <ScrollReveal className="text-center mb-16 sm:mb-20">
        <span className="block text-text-muted text-[10px] uppercase tracking-[4px] mb-6 sm:mb-8 font-body">
          / Cookies
        </span>
        <TextReveal
          text="Política de Cookies"
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
            to="/privacy"
            className="font-body text-[11px] uppercase tracking-[2px] text-text-main border-b border-text-main pb-1 hover:text-primary hover:border-primary transition-colors font-medium"
          >
            Política de privacidad
          </Link>
        </div>
      </FadeIn>
    </div>
  </PageTransition>
);

export default CookiePolicyView;
