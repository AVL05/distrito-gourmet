import ReservationForm from '@/components/ReservationForm';
import { useEffect, useState } from 'react';

const ReservationsView = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const storedReservations = JSON.parse(localStorage.getItem('reservations')) || [];
    // Sort by date desc (mock)
    setReservations(storedReservations.reverse());
  }, []);

  const getStatusColor = status => {
    switch (status) {
      case 'confirmada':
        return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'pendiente':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'cancelada':
        return 'text-red-400 bg-red-900/20 border-red-500/30';
      default:
        return 'text-gray-900 border-gray-200';
    }
  };

  return (
    <div className="bg-bg-body min-h-screen pt-32 sm:pt-40 pb-32 px-4 relative overflow-hidden">
      {/* Gucci ambient lines */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-text-main/5 -translate-x-1/2 z-0 hidden md:block"></div>

      <div className="container max-w-5xl relative z-10">
        <div className="text-center mb-16 sm:mb-24 animate-fade-in relative">
          <span className="block text-text-muted text-[10px] uppercase tracking-[4px] mb-6 sm:mb-8 font-body">
            / 06 Sus Reservas
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl text-text-main mb-8 leading-tight">
            Gestión <span className="italic text-primary">Personal</span>
          </h1>
          <div className="w-16 h-[1px] bg-text-main/10 mx-auto"></div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-8 sm:gap-12 mb-16 sm:mb-20">
          <button
            onClick={() => setActiveTab('new')}
            className={`pb-2 px-2 text-[10px] sm:text-[11px] uppercase tracking-[3px] sm:tracking-[4px] transition-all relative font-body ${
              activeTab === 'new'
                ? 'text-text-main font-bold border-b border-text-main'
                : 'text-text-muted hover:text-text-main'
            }`}>
            Nueva Reserva
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2 px-2 text-[10px] sm:text-[11px] uppercase tracking-[3px] sm:tracking-[4px] transition-all relative font-body ${
              activeTab === 'history'
                ? 'text-text-main font-bold border-b border-text-main'
                : 'text-text-muted hover:text-text-main'
            }`}>
            Historial
          </button>
        </div>

        <div className="animate-fade-in relative">
          {activeTab === 'new' ? (
            <div className="bg-transparent border-0 shadow-none p-0 max-w-4xl mx-auto">
              {/* Inherits ReservationForm's new Michelin styling automatically since it's an imported component! */}
              <ReservationForm compact={false} />
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto font-body">
              {reservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 px-4 sm:px-8 border border-text-main/10 bg-bg-surface">
                  <span className="text-text-muted text-4xl mb-6 font-light">✦</span>
                  <p className="text-text-muted font-light tracking-wide text-sm">
                    Aún no constan reservas en su historial.
                  </p>
                </div>
              ) : (
                reservations.map(res => (
                  <div
                    key={res.id}
                    className="bg-bg-surface border border-text-main/10 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sm:gap-8 hover:bg-text-main/5 transition-colors duration-500">
                    <div>
                      <div className="flex items-end gap-6 mb-4">
                        <span className="font-heading text-3xl text-text-main">
                          {new Date(res.date)
                            .toLocaleDateString('es-ES', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                            })
                            .replace(/^\w/, c => c.toUpperCase())}
                        </span>
                        <span className="text-primary font-body text-xl font-light tracking-widest relative top-[-4px]">
                          {res.time}
                        </span>
                      </div>
                      <div className="flex gap-8 text-[12px] text-text-muted font-light uppercase tracking-widest mt-4">
                        <span className="flex items-center gap-2">
                          <span className="text-text-main/40">COMENSALES</span> {res.people}
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="text-text-main/40">TELF</span> {res.phone}
                        </span>
                      </div>
                      {res.comments && (
                        <p className="mt-4 text-[13px] text-text-muted italic flex items-start gap-2">
                          <span className="text-primary text-xl leading-none">"</span>
                          {res.comments}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <div
                        className={`text-[10px] uppercase tracking-[3px] font-bold ${res.status === 'confirmada' ? 'text-primary' : res.status === 'cancelada' ? 'text-red-800' : 'text-text-main'}`}>
                        {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                      </div>
                      <span className="text-text-muted/50 text-[10px] uppercase tracking-[2px]">
                        REF: #{res.id.toString().slice(-6)}
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
