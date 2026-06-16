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
import { Link, useNavigate } from "react-router-dom";
import { IS_PUBLIC_DEMO } from "@/config/demo";

// Formulario de reserva de mesa
const ReservationForm = ({ compact = false }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const COMMENTS_MAX_LENGTH = 300;

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
  const [errors, setErrors] = useState({});
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const formatShortReservationDate = (date) =>
    date.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  const formatFullReservationDate = (date) =>
    date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });

  const reservationDateOptions = (() => {
    const dates = [];
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setMonth(end.getMonth() + 2);
    end.setHours(0, 0, 0, 0);

    while (cursor <= end) {
      dates.push({
        value: cursor.toLocaleDateString("en-CA"),
        label: formatShortReservationDate(cursor),
        fullLabel: formatFullReservationDate(cursor),
        day: cursor.toLocaleDateString("es-ES", { day: "2-digit" }),
        month: cursor.toLocaleDateString("es-ES", { month: "short" }),
        weekday: cursor.toLocaleDateString("es-ES", { weekday: "short" }),
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    return dates;
  })();
  const selectedDate = reservationDateOptions.find(
    (option) => option.value === form.date,
  );
  const baseAvailableTimes = [
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
  ];
  const demoAvailability = baseAvailableTimes.map((time, index) => {
    const occupied = index === 6 ? 36 : index === 2 ? 18 : 0;
    const availableSeats = Math.max(44 - occupied, 0);

    return {
      time,
      occupied,
      available_seats: availableSeats,
      capacity: 44,
      status:
        availableSeats === 0
          ? "complete"
          : availableSeats <= 8
            ? "limited"
            : "available",
    };
  });
  const availabilityTurns = form.date
    ? availability.length > 0
      ? availability
      : demoAvailability
    : [];
  const selectedTurn = availabilityTurns.find(
    (turn) => turn.time === form.time,
  );
  const reservationSummary = [
    ["Fecha", selectedDate?.fullLabel || "Sin seleccionar"],
    ["Hora", form.time || "Sin seleccionar"],
    [
      "Comensales",
      form.guests
        ? `${form.guests} ${Number(form.guests) === 1 ? "persona" : "personas"}`
        : "Sin seleccionar",
    ],
    [
      "Preferencias",
      form.comments.trim() ? form.comments.trim() : "Sin indicaciones",
    ],
  ];

  // Horarios disponibles para reservar
  const availableTimes =
    availabilityTurns.length > 0
      ? availabilityTurns
      : baseAvailableTimes.map((time) => ({ time }));
  const phonePattern = /^\+?\d[\d\s]{8,17}$/;

  useEffect(() => {
    if (!form.date || IS_PUBLIC_DEMO) {
      setAvailability([]);
      return;
    }

    let cancelled = false;
    const fetchAvailability = async () => {
      setAvailabilityLoading(true);
      try {
        const response = await axios.get("/reservation-availability", {
          params: { date: form.date },
        });
        if (!cancelled) setAvailability(response.data?.turns || []);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("No se pudo cargar disponibilidad", error);
        }
        if (!cancelled) setAvailability([]);
      } finally {
        if (!cancelled) setAvailabilityLoading(false);
      }
    };

    fetchAvailability();
    return () => {
      cancelled = true;
    };
  }, [form.date]);

  const validateForm = () => {
    const nextErrors = {};
    const normalizedPhone = form.phone.trim();

    if (!form.name.trim()) nextErrors.name = "Introduzca su nombre.";
    if (!normalizedPhone) {
      nextErrors.phone = "Introduzca un teléfono de contacto.";
    } else if (!phonePattern.test(normalizedPhone)) {
      nextErrors.phone = "Use un teléfono válido, por ejemplo +34 600 000 000.";
    }
    if (!form.guests) nextErrors.guests = "Seleccione el número de comensales.";
    if (!form.date) nextErrors.date = "Seleccione una fecha.";
    if (!form.time) nextErrors.time = "Seleccione un turno.";
    if (
      selectedTurn?.available_seats !== undefined &&
      Number(form.guests || 0) > selectedTurn.available_seats
    ) {
      nextErrors.time = "El turno seleccionado no tiene plazas suficientes.";
    }
    if (form.comments.length > COMMENTS_MAX_LENGTH) {
      nextErrors.comments = `Máximo ${COMMENTS_MAX_LENGTH} caracteres.`;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Enviar reserva (conexión real con API)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (IS_PUBLIC_DEMO) {
      Swal.fire({
        title: "Servicio no disponible",
        text: "La reserva online no está disponible en esta vista pública.",
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
      const response = await axios.post("/reservations", {
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
      const reservation = response.data?.reserva;

      // Mostrar mensaje de confirmación mediante SweetAlert2 (estilo premium)
      Swal.fire({
        icon: "success",
        title: "Reserva Confirmada",
        html: `
          <div class="text-center font-body">
            <p class="mb-4">Hemos recibido su solicitud de mesa en <b>Distrito Gourmet</b>.</p>
            <div class="bg-primary/10 p-6 rounded-lg border border-primary/20">
              <p class="text-xs font-semibold text-primary uppercase tracking-widest mb-1 opacity-70">Código de reserva</p>
              <p class="text-3xl font-heading text-primary">${reservation?.codigo_reserva || "Pendiente"}</p>
              <p class="mt-3 text-sm">${form.date} — ${form.time} · ${form.guests} pax</p>
            </div>
            <p class="mt-4 text-[11px] text-text-muted">El equipo de sala revisará cualquier preferencia indicada.</p>
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
  const clearFieldError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const handleDateSelect = (date) => {
    setForm((prev) => ({ ...prev, date: date.value }));
    clearFieldError("date");
    setIsDatePickerOpen(false);
  };

  return (
    // Contenedor principal con efecto de aparición
    <FadeIn className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-md p-5 sm:p-8 md:p-14 border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.18)] rounded-sm relative overflow-hidden">
      {/* Línea decorativa superior */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

      <form onSubmit={handleSubmit} className="relative z-10">
        {IS_PUBLIC_DEMO && (
          <div className="mb-8 border border-primary/20 bg-primary/10 px-4 py-3 text-center text-[10px] sm:text-[11px] uppercase tracking-[1.5px] sm:tracking-[2px] text-primary font-body font-bold">
            Reserva online no disponible en esta vista
          </div>
        )}
        {!IS_PUBLIC_DEMO && !user && (
          <div className="mb-8 border border-text-main/10 bg-text-main/5 px-4 py-4 text-center text-[11px] sm:text-[12px] uppercase tracking-[1.5px] sm:tracking-[2px] text-text-main font-body font-bold">
            Para confirmar la reserva necesita{" "}
            <Link
              to="/login"
              className="text-primary border-b border-primary pb-[1px] hover:text-primary-hover hover:border-primary-hover transition-colors"
            >
              iniciar sesión
            </Link>
            .
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
          <label
            htmlFor="reservation-name"
            className="text-[12px] uppercase tracking-[2px] text-primary block mb-2 transition-colors group-focus-within:text-primary font-bold"
          >
            Nombre Completo
          </label>
          <input
            id="reservation-name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={
              errors.name ? "reservation-name-error" : undefined
            }
            placeholder="Ej. Laura Martínez"
            className={`w-full bg-transparent border-0 border-b text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-gray-900/20 text-base sm:text-lg font-normal ${
              errors.name ? "border-red-700" : "border-gray-200"
            }`}
          />
          {errors.name && (
            <p
              id="reservation-name-error"
              className="mt-2 text-[12px] text-red-800"
            >
              {errors.name}
            </p>
          )}
          <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
            Usaremos este nombre para identificar la mesa a su llegada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-10 mb-7 md:mb-8">
          <div className="relative group">
            {/* Campo: Teléfono de contacto */}
            <label
              htmlFor="reservation-phone"
              className="text-[12px] uppercase tracking-[2px] text-primary block mb-2 transition-colors group-focus-within:text-primary font-bold"
            >
              Teléfono
            </label>
            <input
              id="reservation-phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              autoComplete="tel"
              inputMode="tel"
              aria-invalid={!!errors.phone}
              aria-describedby={
                errors.phone ? "reservation-phone-error" : undefined
              }
              placeholder="+34 000 000 000"
              className={`w-full bg-transparent border-0 border-b text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-gray-900/20 text-base sm:text-lg font-normal ${
                errors.phone ? "border-red-700" : "border-gray-200"
              }`}
            />
            {errors.phone && (
              <p
                id="reservation-phone-error"
                className="mt-2 text-[12px] text-red-800"
              >
                {errors.phone}
              </p>
            )}
            <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
              Solo se utiliza para avisos relacionados con la reserva.
            </p>
          </div>
          <div className="relative group">
            {/* Desplegable: Número de comensales */}
            <label
              htmlFor="reservation-guests"
              className="text-[12px] uppercase tracking-[2px] text-primary block mb-2 transition-colors group-focus-within:text-primary font-bold"
            >
              Comensales (Máx. 8)
            </label>
            <select
              id="reservation-guests"
              name="guests"
              value={form.guests}
              onChange={handleChange}
              required
              aria-invalid={!!errors.guests}
              aria-describedby={
                errors.guests ? "reservation-guests-error" : undefined
              }
              className={`w-full bg-transparent border-0 border-b text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 [&>option]:bg-[#fdfaf6] text-base sm:text-lg font-normal appearance-none cursor-pointer ${
                errors.guests ? "border-red-700" : "border-gray-200"
              }`}
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
            {errors.guests && (
              <p
                id="reservation-guests-error"
                className="mt-2 text-[12px] text-red-800"
              >
                {errors.guests}
              </p>
            )}
            <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
              Para grupos de más de 8 personas, contacte con sala.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-10 mb-7 md:mb-8">
          <div className="relative group">
            {/* Campo: Fecha para la reserva */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-1 mb-2">
              <label
                htmlFor="reservation-date"
                className="text-[12px] uppercase tracking-[2px] text-primary transition-colors group-focus-within:text-primary font-bold mb-0"
              >
                Fecha de la Reserva
              </label>
              <span className="text-[9px] uppercase tracking-[2px] text-text-muted/60 italic">
                Agenda abierta a 2 meses
              </span>
            </div>
            <button
              id="reservation-date"
              type="button"
              onClick={() => setIsDatePickerOpen((open) => !open)}
              aria-expanded={isDatePickerOpen}
              aria-invalid={!!errors.date}
              aria-describedby={
                errors.date ? "reservation-date-error" : undefined
              }
              className={`flex min-h-12 w-full items-center justify-between border-0 border-b bg-transparent py-3 text-left text-base font-normal text-gray-900 transition-all duration-300 focus:outline-none focus:ring-0 focus:border-primary sm:text-lg ${
                errors.date ? "border-red-700" : "border-gray-200"
              }`}
            >
              <span
                className={selectedDate ? "text-gray-900" : "text-gray-900/35"}
              >
                {selectedDate?.fullLabel || "Seleccione fecha"}
              </span>
              <span
                className={`text-primary transition-transform duration-300 ${
                  isDatePickerOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              >
                ↓
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isDatePickerOpen && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
                  animate={
                    shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
                  }
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="mt-4 max-h-64 overflow-y-auto border border-text-main/10 bg-bg-body/95 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.12)]"
                >
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-3">
                    {reservationDateOptions.map((date) => {
                      const isSelected = date.value === form.date;

                      return (
                        <button
                          key={date.value}
                          type="button"
                          onClick={() => handleDateSelect(date)}
                          aria-pressed={isSelected}
                          className={`min-h-[72px] border px-2 py-3 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-body ${
                            isSelected
                              ? "border-primary bg-primary text-white"
                              : "border-text-main/10 bg-white/70 text-gray-900 hover:border-primary hover:bg-primary/10"
                          }`}
                        >
                          <span className="block text-[10px] font-bold uppercase tracking-[1.2px] opacity-70">
                            {date.weekday}
                          </span>
                          <span className="mt-1 block font-heading text-2xl leading-none">
                            {date.day}
                          </span>
                          <span className="mt-1 block text-[10px] font-bold uppercase tracking-[1px]">
                            {date.month}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {errors.date && (
              <p
                id="reservation-date-error"
                className="mt-2 text-[12px] text-red-800"
              >
                {errors.date}
              </p>
            )}
          </div>
          <div className="relative group">
            {/* Desplegable: Turnos disponibles */}
            <label
              htmlFor="reservation-time"
              className="text-[12px] uppercase tracking-[2px] text-primary block mb-2 transition-colors group-focus-within:text-primary font-bold"
            >
              Turno
            </label>
            <select
              id="reservation-time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              disabled={!form.date || availabilityLoading}
              aria-invalid={!!errors.time}
              aria-describedby={
                errors.time ? "reservation-time-error" : undefined
              }
              className={`w-full bg-transparent border-0 border-b text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 [&>option]:bg-[#fdfaf6] text-base sm:text-lg font-normal appearance-none cursor-pointer ${
                errors.time ? "border-red-700" : "border-gray-200"
              }`}
            >
              <option value="" disabled>
                {availabilityLoading
                  ? "Consultando disponibilidad"
                  : form.date
                    ? "Seleccione horario"
                    : "Seleccione primero una fecha"}
              </option>
              {availableTimes.map((turn) => {
                const guests = Number(form.guests || 1);
                const isFull =
                  turn.available_seats !== undefined &&
                  turn.available_seats < guests;

                return (
                  <option key={turn.time} value={turn.time} disabled={isFull}>
                    {turn.time} ·{" "}
                    {turn.available_seats === undefined
                      ? "Servicio disponible"
                      : isFull
                        ? "Completo"
                        : `${turn.available_seats} plazas libres`}
                  </option>
                );
              })}
            </select>
            {selectedTurn?.available_seats !== undefined && (
              <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
                {selectedTurn.status === "limited"
                  ? "Últimas plazas para este turno."
                  : "Disponibilidad calculada con las reservas activas."}{" "}
                {selectedTurn.occupied}/{selectedTurn.capacity} cubiertos
                ocupados.
              </p>
            )}
            {errors.time && (
              <p
                id="reservation-time-error"
                className="mt-2 text-[12px] text-red-800"
              >
                {errors.time}
              </p>
            )}
          </div>
        </div>

        <div className="mb-10 md:mb-12 relative group">
          {/* Campo opcional para alergias o comentarios */}
          <label
            htmlFor="reservation-comments"
            className="text-[12px] uppercase tracking-[2px] text-primary block mb-2 transition-colors group-focus-within:text-primary font-bold"
          >
            Preferencias / Restricciones
          </label>
          <textarea
            id="reservation-comments"
            name="comments"
            value={form.comments}
            onChange={handleChange}
            rows="2"
            maxLength={COMMENTS_MAX_LENGTH}
            aria-invalid={!!errors.comments}
            aria-describedby={
              errors.comments ? "reservation-comments-error" : undefined
            }
            placeholder="Alergias, celebraciones u otros detalles importantes para el equipo de sala..."
            className={`w-full bg-transparent border-0 border-b text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 resize-none placeholder:text-gray-900/20 text-base sm:text-lg font-normal ${
              errors.comments ? "border-red-700" : "border-gray-200"
            }`}
          ></textarea>
          <div className="mt-2 flex items-start justify-between gap-4 text-[11px] leading-relaxed text-gray-500">
            <p>
              Indique alergias, celebraciones o necesidades de accesibilidad.
            </p>
            <span className="shrink-0">
              {form.comments.length}/{COMMENTS_MAX_LENGTH}
            </span>
          </div>
          {errors.comments && (
            <p
              id="reservation-comments-error"
              className="mt-2 text-[12px] text-red-800"
            >
              {errors.comments}
            </p>
          )}
        </div>

        <div className="mb-10 border border-text-main/10 bg-bg-body/80 p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="font-heading text-2xl text-gray-900 mb-0">
              Resumen
            </h4>
            <span className="font-body text-[10px] uppercase tracking-[1.6px] text-primary">
              Revise antes de enviar
            </span>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reservationSummary.map(([label, value]) => (
              <div key={label} className="border-t border-text-main/10 pt-3">
                <dt className="font-body text-[10px] uppercase tracking-[1.5px] text-gray-500 mb-1">
                  {label}
                </dt>
                <dd className="text-sm text-gray-900 leading-relaxed">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
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
