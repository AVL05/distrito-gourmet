import ReservationForm from "@/components/ReservationForm";
import { useEffect, useState } from "react";

const ReservationsView = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const storedReservations =
      JSON.parse(localStorage.getItem("reservations")) || [];
    // Sort by date desc (mock)
    setReservations(storedReservations.reverse());
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmada":
        return "text-green-400 bg-green-900/20 border-green-500/30";
      case "pendiente":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-500/30";
      case "cancelada":
        return "text-red-400 bg-red-900/20 border-red-500/30";
      default:
        return "text-gray-900 border-gray-200";
    }
  };

  return (
    <div className="bg-bg-body min-h-screen pt-40 pb-32 px-4 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

      <div className="container max-w-5xl relative z-10">
        <div className="mb-16 text-center animate-fade-in">
          <span className="block text-primary text-[10px] uppercase tracking-[6px] mb-4 font-body opacity-90">
            Tu Mesa
          </span>
          <h1 className="font-heading text-5xl uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-hover to-white mb-6">
            Reservas
          </h1>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-12 mb-16 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("new")}
            className={`pb-4 px-2 text-[10px] uppercase tracking-[4px] transition-all relative group ${
              activeTab === "new"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Nueva Reserva
            <div className={`absolute bottom-0 left-0 h-[1px] bg-primary transition-all duration-500 ${activeTab === "new" ? "w-full shadow-[0_0_10px_rgba(197,160,89,0.5)]" : "w-0 group-hover:w-1/2"}`}></div>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-4 px-2 text-[10px] uppercase tracking-[4px] transition-all relative group ${
              activeTab === "history"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Historial de Visitas
            <div className={`absolute bottom-0 left-0 h-[1px] bg-primary transition-all duration-500 ${activeTab === "history" ? "w-full shadow-[0_0_10px_rgba(197,160,89,0.5)]" : "w-0 group-hover:w-1/2"}`}></div>
          </button>
        </div>

        <div className="animate-fade-in relative">
          {activeTab === "new" ? (
            <div className="bg-transparent border-0 shadow-none p-0 max-w-4xl mx-auto">
              {/* Inherits ReservationForm's new Michelin styling automatically since it's an imported component! */}
              <ReservationForm compact={false} />
            </div>
          ) : (
            <div className="space-y-8 max-w-4xl mx-auto">
              {reservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 bg-white/90 backdrop-blur-md border border-gray-200 shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-sm">
                  <span className="text-primary text-4xl mb-6 opacity-50 font-light">✦</span>
                  <p className="text-gray-500 font-light tracking-wide text-lg">
                    Aún no constan reservas en su historial.
                  </p>
                </div>
              ) : (
                reservations.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white/90 backdrop-blur-md border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 hover:border-primary/30 transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(197,160,89,0.1)] relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div>
                      <div className="flex items-end gap-4 mb-3">
                        <span className="font-heading text-2xl text-gray-900 tracking-wider font-light">
                          {new Date(res.date).toLocaleDateString("es-ES", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          }).replace(/^\w/, (c) => c.toUpperCase())}
                        </span>
                        <span className="text-primary font-body text-xl font-light tracking-widest relative top-[-2px]">
                          {res.time}
                        </span>
                      </div>
                      <div className="flex gap-8 text-sm text-gray-500 font-light border-t border-gray-200 pt-3 mt-3">
                        <span className="flex items-center gap-2"><span className="text-primary opacity-50 text-xs">COMENSALES</span> {res.people}</span>
                        <span className="flex items-center gap-2"><span className="text-primary opacity-50 text-xs">TELF</span> {res.phone}</span>
                      </div>
                      {res.comments && (
                        <p className="mt-4 text-sm text-gray-900/40 italic flex items-start gap-2">
                          <span className="text-primary text-lg leading-none">"</span>
                          {res.comments}
                          <span className="text-primary text-lg leading-none self-end">"</span>
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div
                        className={`px-6 py-2 border rounded-none text-[10px] uppercase tracking-[3px] font-bold ${getStatusColor(res.status)} backdrop-blur-sm`}
                      >
                        {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                      </div>
                      <span className="text-gray-900/30 text-[10px] uppercase tracking-widest mt-2 block">
                        ID REF: #{res.id.toString().slice(-6)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationsView;
