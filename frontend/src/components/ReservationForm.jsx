import { useState } from 'react';
import { AnimatePresence, useReducedMotion, FadeIn, Toast } from '@/motion';
import { useAuthStore } from '@/store/auth';
import axios from '@/services/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// Formulario de reserva de mesa
const ReservationForm = ({ compact = false }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Estado principal que guarda los datos introducidos en el formulario
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    people: '',
    date: '',
    time: '',
    comments: '',
  });

  // Estados para controlar si está cargando y si se envió con éxito
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Horarios disponibles para reservar
  const availableTimes = ['13:00', '13:30', '14:00', '14:30', '20:00', '20:30', '21:00', '21:30'];
  const today = new Date().toISOString().split('T')[0];

  // Enviar reserva (conexión real con API)
  const handleSubmit = async e => {
    e.preventDefault();

    // Comprobar que el usuario ha iniciado sesión antes de reservar
    if (!user) {
      Swal.fire({
        title: 'Atención',
        text: 'Debe iniciar sesión para realizar una reserva.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Ir al Login',
        cancelButtonText: 'Cerrar',
        confirmButtonColor: '#c5a059',
      }).then(result => {
        if (result.isConfirmed) navigate('/login');
      });
      return;
    }

    setLoading(true);

    try {
      // Unir fecha y hora para enviarlo correctamente a la base de datos
      const reservationTime = `${form.date}T${form.time}:00`;

      await axios.post('/reservations', {
        reservation_time: reservationTime,
        people: parseInt(form.people),
        special_requests: form.comments,
        experience_type: 'a_la_carte', // Default
      });

      // Mostrar mensaje de confirmación y vaciar el formulario
      setSuccess(true);
      setForm(prev => ({
        ...prev,
        people: '',
        date: '',
        time: '',
        comments: '',
      }));

      setTimeout(() => setSuccess(false), 8000);
    } catch (err) {
      // Si hay error, lo mostramos por pantalla
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'No se pudo procesar la reserva',
        confirmButtonColor: '#c5a059',
      });
    } finally {
      setLoading(false);
    }
  };

  // Actualizar campo del formulario
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    // Contenedor principal con efecto de aparición
    <FadeIn className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-md p-10 md:p-14 border border-gray-200 shadow-[0_0_50px_rgba(0,0,0,0.6)] rounded-sm relative overflow-hidden">
      {/* Línea decorativa superior */}
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
            placeholder="Ej. Marqués de Salamanca"
            className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-gray-900/20 text-lg font-light"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
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
              className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-gray-900/20 text-lg font-light"
            />
          </div>
          <div className="relative group">
            {/* Desplegable: Número de comensales */}
            <label className="text-[12px] uppercase tracking-[2px] text-primary block mb-2 transition-colors group-focus-within:text-primary font-bold">
              Comensales (Máx. 8)
            </label>
            <select
              name="people"
              value={form.people}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 [&>option]:bg-[#fdfaf6] text-lg font-light appearance-none cursor-pointer">
              <option value="" disabled>
                Seleccione número
              </option>
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} persona{i + 1 > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
          <div className="relative group">
            {/* Campo: Fecha para la reserva */}
            <label className="text-[12px] uppercase tracking-[2px] text-primary block mb-2 transition-colors group-focus-within:text-primary font-bold">
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
            {/* Desplegable: Turnos disponibles */}
            <label className="text-[12px] uppercase tracking-[2px] text-primary block mb-2 transition-colors group-focus-within:text-primary font-bold">
              Turno
            </label>
            <select
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 [&>option]:bg-[#fdfaf6] text-lg font-light appearance-none cursor-pointer">
              <option value="" disabled>
                Seleccione horario
              </option>
              {availableTimes.map(time => (
                <option key={time} value={time}>
                  Servicio de las {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-12 relative group">
          {/* Campo opcional para alergias o comentarios */}
          <label className="text-[12px] uppercase tracking-[2px] text-primary block mb-2 transition-colors group-focus-within:text-primary font-bold">
            Preferencias / Restricciones
          </label>
          <textarea
            name="comments"
            value={form.comments}
            onChange={handleChange}
            rows="2"
            placeholder="Alergias, celebraciones u otros detalles importantes para nuestro Maître..."
            className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 resize-none placeholder:text-gray-900/20 text-lg font-light"></textarea>
        </div>

        {/* Botón para enviar el formulario de reserva */}
        <div className="mt-10 flex justify-center">
          <motion.button
            type="submit"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            className="group relative px-16 py-5 bg-transparent border border-primary text-primary font-body text-xs uppercase tracking-[4px] overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(197,160,89,0.5)] w-full md:w-auto min-w-[300px]"
            disabled={loading}>
            <div className="absolute inset-0 w-0 bg-primary transition-all duration-[400ms] ease-out group-hover:w-full"></div>
            <span className="relative z-10 group-hover:text-black font-bold transition-colors duration-300">
              {loading ? 'PROCESANDO...' : 'SOLICITAR MESA'}
            </span>
          </motion.button>
        </div>

        {/* Mensaje de éxito con animación */}
        <AnimatePresence>
          {success && (
            <Toast className="mt-8 p-6 bg-white/90 border border-primary/40 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-2xl">
              <span className="text-primary text-2xl mb-2">✦</span>
              <p className="text-gray-900 font-light tracking-wide leading-relaxed">
                Su petición de reserva ha sido recibida con éxito.
                <br />
                <span className="text-gray-500 text-sm mt-2 block">
                  Nuestro equipo de recepción le contactará en breve para confirmar la disponibilidad.
                </span>
              </p>
            </Toast>
          )}
        </AnimatePresence>
      </form>
    </FadeIn>
  );
};

export default ReservationForm;
