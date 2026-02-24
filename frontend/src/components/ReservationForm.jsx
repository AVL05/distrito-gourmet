import { useState } from "react";

const ReservationForm = ({ compact = false }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    people: "",
    date: "",
    time: "",
    comments: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const availableTimes = [
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
  ];
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // Simulation
    setTimeout(() => {
      const reservations =
        JSON.parse(localStorage.getItem("reservations")) || [];
      reservations.push({ ...form, id: Date.now(), status: "pendiente" });
      localStorage.setItem("reservations", JSON.stringify(reservations));

      setLoading(false);
      setSuccess(true);
      setForm({
        name: "",
        phone: "",
        people: "",
        date: "",
        time: "",
        comments: "",
      });

      setTimeout(() => setSuccess(false), 8000);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="animate-fade-in w-full max-w-3xl mx-auto bg-white/90 shadow-sm border-gray-100 backdrop-blur-md p-10 md:p-14 border border-gray-200 shadow-[0_0_50px_rgba(0,0,0,0.6)] rounded-sm relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

      <form onSubmit={handleSubmit} className="relative z-10">
        {!compact && (
          <div className="text-center mb-12">
            <h3 className="font-heading text-3xl md:text-4xl text-gray-900 tracking-[0.2em] mb-4 drop-shadow-lg font-light">
              Su <span className="italic font-light text-primary-hover">Reserva</span>
            </h3>
            <div className="w-16 h-[1px] bg-primary mx-auto opacity-70"></div>
          </div>
        )}

        <div className="mb-8 relative group">
          <label className="text-[10px] uppercase tracking-[3px] text-primary/80 block mb-2 transition-colors group-focus-within:text-primary">
            Nombre Completo
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Ej. Marqués de Salamanca"
            className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-gray-900/20 text-lg font-light"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
          <div className="relative group">
            <label className="text-[10px] uppercase tracking-[3px] text-primary/80 block mb-2 transition-colors group-focus-within:text-primary">
              Teléfono
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="+34 000 000 000"
              className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-gray-900/20 text-lg font-light"
            />
          </div>
          <div className="relative group">
            <label className="text-[10px] uppercase tracking-[3px] text-primary/80 block mb-2 transition-colors group-focus-within:text-primary">
              Comensales (Máx. 8)
            </label>
            <select
              name="people"
              value={form.people}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 [&>option]:bg-[#fdfaf6] text-lg font-light appearance-none cursor-pointer"
            >
              <option value="" disabled>Seleccione número</option>
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} persona{i + 1 > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
          <div className="relative group">
            <label className="text-[10px] uppercase tracking-[3px] text-primary/80 block mb-2 transition-colors group-focus-within:text-primary">
              Fecha de la Experiencia
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              min={today}
              className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 [color-scheme:dark] text-lg font-light cursor-pointer"
            />
          </div>
          <div className="relative group">
            <label className="text-[10px] uppercase tracking-[3px] text-primary/80 block mb-2 transition-colors group-focus-within:text-primary">
              Turno
            </label>
            <select
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 [&>option]:bg-[#fdfaf6] text-lg font-light appearance-none cursor-pointer"
            >
              <option value="" disabled>Seleccione horario</option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  Servicio de las {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-12 relative group">
          <label className="text-[10px] uppercase tracking-[3px] text-primary/80 block mb-2 transition-colors group-focus-within:text-primary">
            Preferencias / Restricciones
          </label>
          <textarea
            name="comments"
            value={form.comments}
            onChange={handleChange}
            rows="2"
            placeholder="Alergias, celebraciones u otros detalles importantes para nuestro Maître..."
            className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 resize-none placeholder:text-gray-900/20 text-lg font-light"
          ></textarea>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="submit"
            className="group relative px-16 py-5 bg-transparent border border-primary text-primary font-body text-xs uppercase tracking-[4px] overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(197,160,89,0.5)] w-full md:w-auto min-w-[300px]"
            disabled={loading}
          >
            <div className="absolute inset-0 w-0 bg-primary transition-all duration-[400ms] ease-out group-hover:w-full"></div>
            <span className="relative z-10 group-hover:text-black font-semibold transition-colors duration-300">
              {loading ? "PROCESANDO..." : "SOLICITAR MESA"}
            </span>
          </button>
        </div>

        {success && (
          <div className="mt-8 p-6 bg-white/90 shadow-sm border-gray-100 border border-primary/40 backdrop-blur-md flex flex-col items-center justify-center text-center animate-fade-in shadow-2xl">
            <span className="text-primary text-2xl mb-2">✦</span>
            <p className="text-gray-900 font-light tracking-wide leading-relaxed">
              Su petición de reserva ha sido recibida con éxito.<br/>
              <span className="text-gray-500 text-sm mt-2 block">Nuestro equipo de recepción le contactará en breve para confirmar la disponibilidad.</span>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ReservationForm;
