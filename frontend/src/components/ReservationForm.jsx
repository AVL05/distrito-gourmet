import { useState, useEffect } from "react";
import {
  AnimatePresence,
  useReducedMotion,
  FadeIn,
  Toast,
  motion,
} from "@/motion";
import { useAuthStore } from "@/store/auth";
import axios from "@/services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { IS_PUBLIC_DEMO } from "@/config/demo";

// Formulario de reserva de mesa
const ReservationForm = ({ compact = false }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Estado principal que guarda los datos introducidos en el formulario
  const [form, setForm] = useState({
    name: user?.nombre || "",
    phone: user?.telefono || "",
    guests: "",
    date: "",
    time: "",
    comments: "",
  });

  // Sincronizar con el usuario si cambia (ej: login posterior)
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.nombre || "",
        phone: prev.phone || user.telefono || "",
      }));
    }
  }, [user]);

  // Estados para controlar si está cargando
  const [loading, setLoading] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Horarios disponibles para reservar
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
  const today = new Date().toLocaleDateString("en-CA");
  const maxDate = new Date(
    new Date().setMonth(new Date().getMonth() + 2),
  ).toLocaleDateString("en-CA");

  // Enviar reserva (conexión real con API)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (IS_PUBLIC_DEMO) {
      Swal.fire({
        title: "Demo pública",
        text: "Las reservas están desactivadas para no generar datos reales.",
        icon: "info",
        confirmButtonColor: "#c5a059",
        background: "#fdfaf6",
        color: "#2c302e",
      });
      return;
    }

    // Comprobar que el usuario ha iniciado sesión antes de reservar
    if (!user) {
      Swal.fire({
        title: "Atención",
        text: "Debe iniciar sesión para realizar una reserva.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Ir al Login",
        cancelButtonText: "Cerrar",
        confirmButtonColor: "#c5a059",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post("/reservations", {
        nombre: form.name,
        telefono: form.phone,
        fecha_reserva: form.date,
        hora_reserva:
          form.time.includes(":") && form.time.split(":").length === 2
            ? `${form.time}:00`
            : form.time,
        comensales: parseInt(form.guests),
        peticiones_especiales: form.comments,
      });

      // Mostrar mensaje de confirmación mediante SweetAlert2 (estilo premium)
      Swal.fire({
        icon: "success",
        title: "Reserva Confirmada",
        html: `
          <div class="text-center font-body">
            <p class="mb-4">Hemos recibido su solicitud para una experiencia en <b>Distrito Gourmet</b>.</p>
            <div class="bg-primary/10 p-6 rounded-lg border border-primary/20">
              <p class="text-xs font-semibold text-primary uppercase tracking-widest mb-1 opacity-70">Fecha y Hora de la Cita</p>
              <p class="text-3xl font-heading text-primary">${form.date} — ${form.time}</p>
              <p class="text-[10px] text-text-muted mt-3 uppercase tracking-tighter">Le esperamos para brindarle un servicio excepcional.</p>
            </div>
            <p class="mt-4 text-[11px] text-text-muted">Recibirá un correo de confirmación en breve.</p>
          </div>
        `,
        background: "#fdfaf6",
        color: "#2c302e",
        confirmButtonColor: "#c5a059",
        confirmButtonText: "Ver mis Reservas",
      }).then(() => {
        // Redirigir al historial para que vea su nueva reserva
        window.location.href = "/reservations";
      });

      // Vaciar el formulario
      setForm((prev) => ({
        ...prev,
        guests: "",
        date: "",
        time: "",
        comments: "",
      }));
    } catch (err) {
      // Si hay error, lo mostramos por pantalla con detalle
      console.error("Error de reserva:", err);
      const errorData = err.response?.data;
      console.log("Detalle del error 422:", errorData);
      let errorMsg = "No se pudo procesar la reserva";

      if (errorData?.mensaje) {
        errorMsg = errorData.mensaje;
      } else if (errorData?.message) {
        errorMsg = errorData.message;
      } else if (errorData?.errors) {
        // Recoger el primer error de validación si existe
        const firstError = Object.values(errorData.errors)[0];
        if (Array.isArray(firstError)) errorMsg = firstError[0];
      }

      Swal.fire({
        icon: "error",
        title: "Atención",
        text: errorMsg,
        confirmButtonColor: "#c5a059",
        background: "#fdfaf6",
        color: "#2c302e",
      });
    } finally {
      setLoading(false);
    }
  };

  // Actualizar campo del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    // Contenedor principal con efecto de aparición
    <FadeIn className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-md p-5 sm:p-8 md:p-14 border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.18)] rounded-sm relative overflow-hidden">
      {/* Línea decorativa superior */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

      <form onSubmit={handleSubmit} className="relative z-10">
        {IS_PUBLIC_DEMO && (
          <div className="mb-8 border border-primary/20 bg-primary/10 px-4 py-3 text-center text-[10px] sm:text-[11px] uppercase tracking-[1.5px] sm:tracking-[2px] text-primary font-body font-bold">
            Reservas desactivadas en modo demo
          </div>
        )}

        {!compact && (
          <div className="text-center mb-10 md:mb-12">
            <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl text-gray-900 tracking-[0.14em] sm:tracking-[0.2em] mb-4 drop-shadow-lg font-normal">
              Su{" "}
              <span className="italic font-normal text-primary-hover">
                Reserva
              </span>
            </h3>
            <div className="w-16 h-[1px] bg-primary mx-auto opacity-70"></div>
          </div>
        )}

        <div className="mb-7 md:mb-8 relative group">
          {/* Campo: Nombre del cliente */}
          <label className="text-[12px] uppercase tracking-[2px] text-primary block mb-2 transition-colors group-focus-within:text-primary font-bold">
            Nombre Completo
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Ej. Laura Martínez"
            className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-gray-900/20 text-base sm:text-lg font-normal"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-10 mb-7 md:mb-8">
          <div className="relative group">
            {/* Campo: Teléfono de contacto */}
            <label className="text-[12px] uppercase tracking-[2px] text-primary block mb-2 transition-colors group-focus-within:text-primary font-bold">
              Teléfono
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="+34 000 000 000"
              className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-gray-900/20 text-base sm:text-lg font-normal"
            />
          </div>
          <div className="relative group">
            {/* Desplegable: Número de comensales */}
            <label className="text-[12px] uppercase tracking-[2px] text-primary block mb-2 transition-colors group-focus-within:text-primary font-bold">
              Comensales (Máx. 8)
            </label>
            <select
              name="guests"
              value={form.guests}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 [&>option]:bg-[#fdfaf6] text-base sm:text-lg font-normal appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Seleccione número
              </option>
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} persona{i + 1 > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-10 mb-7 md:mb-8">
          <div className="relative group">
            {/* Campo: Fecha para la reserva */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-1 mb-2">
              <label className="text-[12px] uppercase tracking-[2px] text-primary transition-colors group-focus-within:text-primary font-bold mb-0">
                Fecha de la Experiencia
              </label>
              <span className="text-[9px] uppercase tracking-[2px] text-text-muted/60 italic">
                Agenda abierta a 2 meses
              </span>
            </div>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              min={today}
              max={maxDate}
              className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 text-base sm:text-lg font-normal cursor-pointer"
            />
          </div>
          <div className="relative group">
            {/* Desplegable: Turnos disponibles */}
            <label className="text-[12px] uppercase tracking-[2px] text-primary block mb-2 transition-colors group-focus-within:text-primary font-bold">
              Turno
            </label>
            <select
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 [&>option]:bg-[#fdfaf6] text-base sm:text-lg font-normal appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Seleccione horario
              </option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  Servicio de las {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-10 md:mb-12 relative group">
          {/* Campo opcional para alergias o comentarios */}
          <label className="text-[12px] uppercase tracking-[2px] text-primary block mb-2 transition-colors group-focus-within:text-primary font-bold">
            Preferencias / Restricciones
          </label>
          <textarea
            name="comments"
            value={form.comments}
            onChange={handleChange}
            rows="2"
            placeholder="Alergias, celebraciones u otros detalles importantes para el equipo de sala..."
            className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 resize-none placeholder:text-gray-900/20 text-base sm:text-lg font-normal"
          ></textarea>
        </div>

        {/* Botón para enviar el formulario de reserva */}
        <div className="mt-10 flex justify-center">
          <motion.button
            type="submit"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            className="group relative px-6 sm:px-12 md:px-16 py-4 sm:py-5 bg-transparent border border-primary text-primary font-body text-[11px] sm:text-xs uppercase tracking-[2px] sm:tracking-[4px] overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(197,160,89,0.5)] w-full md:w-auto md:min-w-[300px]"
            disabled={loading || IS_PUBLIC_DEMO}
          >
            <div className="absolute inset-0 w-0 bg-primary transition-all duration-[400ms] ease-out group-hover:w-full"></div>
            <span className="relative z-10 group-hover:text-black font-bold transition-colors duration-300">
              {loading ? "PROCESANDO..." : "SOLICITAR RESERVA"}
            </span>
          </motion.button>
        </div>
      </form>
    </FadeIn>
  );
};

export default ReservationForm;
