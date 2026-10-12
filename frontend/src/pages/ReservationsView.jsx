import { Helmet } from "react-helmet-async";
import ReservationForm from "@/components/ReservationForm";
import { useSearchParams } from "react-router-dom";
import MyReservations from "@/components/MyReservations";
import {
  PageTransition,
  FadeIn,
  ScrollReveal,
  TextReveal,
  LineReveal,
} from "@/motion";

// Gestión de reservas: administra las pestañas de 'Nueva Reserva' e 'Historial'
// Coordina la comunicación con la API para recuperar las reservas del usuario autenticado.
const ReservationsView = () => {
  const [params, setParams] = useSearchParams();
  const activeTab = params.get("tab") === "history" ? "history" : "new";
  const setActiveTab = (value) => setParams(value === "history" ? { tab: "history" } : {});

  return (
    <PageTransition className="bg-bg-body min-h-screen pt-32 sm:pt-40 pb-32 relative overflow-hidden">
      <Helmet>
        <title>Reservas | Distrito Gourmet</title>
        <meta name="description" content="Reserva tu mesa en Distrito Gourmet. Elige día, hora y número de comensales." />
      </Helmet>
      {/* Líneas decorativas de fondo */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-text-main/5 -translate-x-1/2 z-0 hidden md:block"></div>

      <div className="container max-w-5xl relative z-10">
        <ScrollReveal className="text-center mb-16 sm:mb-24 relative">
          <span className="block text-text-muted text-[10px] uppercase tracking-[4px] mb-6 sm:mb-8 font-body">
            / 06 Sus Reservas
          </span>
          <TextReveal
            text={activeTab === "history" ? "Mis reservas" : "Reservar mesa"}
            splitBy="word"
            as="h1"
            staggerDelay={0.1}
            className="font-heading text-4xl sm:text-5xl md:text-7xl text-text-main mb-8 leading-tight justify-center"
          />
          <LineReveal
            className="bg-text-main/10 mx-auto"
            style={{ maxWidth: "4rem" }}
          />
          <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mt-8">
            {activeTab === "history" ? "Consulte el estado de sus reservas y cancele una próxima visita si lo necesita." : "Elija cuántas personas vendrán, el día y la hora de llegada."}
          </p>
        </ScrollReveal>

        {/* Tabs */}
        <div className="flex justify-center gap-8 sm:gap-12 mb-16 sm:mb-20">
          <button
            type="button"
            onClick={() => setActiveTab("new")}
            aria-pressed={activeTab === "new"}
            className={`pb-2 px-2 text-[10px] sm:text-[11px] uppercase tracking-[3px] sm:tracking-[4px] transition-all relative font-body ${
              activeTab === "new"
                ? "text-text-main font-bold"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            Nueva Reserva
            <div
              className={`absolute bottom-0 left-0 h-px bg-text-main transition-all duration-300 ${activeTab === "new" ? "w-full" : "w-0"}`}
            />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            aria-pressed={activeTab === "history"}
            className={`pb-2 px-2 text-[10px] sm:text-[11px] uppercase tracking-[3px] sm:tracking-[4px] transition-all relative font-body ${
              activeTab === "history"
                ? "text-text-main font-bold"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            Mis reservas
            <div
              className={`absolute bottom-0 left-0 h-px bg-text-main transition-all duration-300 ${activeTab === "history" ? "w-full" : "w-0"}`}
            />
          </button>
        </div>

        <FadeIn key={activeTab} className="relative">
            {activeTab === "new" ? (
              <div className="bg-transparent border-0 shadow-none p-0 max-w-4xl mx-auto">
                <ReservationForm compact={false} />
              </div>
            ) : (
              <section className="max-w-4xl mx-auto"><h2 className="sr-only">Mis reservas</h2><MyReservations /></section>
            )}
        </FadeIn>
      </div>
    </PageTransition>
  );
};

export default ReservationsView;
