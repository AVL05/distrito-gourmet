import { useAuthStore } from '@/store/auth';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion, useReducedMotion, PageTransition, FadeIn } from '@/motion';

const ProfileView = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });
  const shouldReduceMotion = useReducedMotion();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.put('/profile', formData);
      Swal.fire({
        icon: 'success',
        title: 'Perfil Actualizado',
        background: '#fdfaf6',
        color: '#2c302e',
        confirmButtonColor: '#e76f51',
      });

      // Actualizar localStorage y contexto si cambia email/nombre
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      useAuthStore.setState({ user: updatedUser });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al actualizar',
        background: '#fdfaf6',
        color: '#2c302e',
        confirmButtonColor: '#e76f51',
      });
    }
  };

  return (
    <PageTransition className="min-h-screen bg-bg-body relative overflow-hidden flex items-center justify-center py-32 px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

      <FadeIn className="w-full max-w-2xl bg-white/90 backdrop-blur-xl p-10 md:p-16 border border-gray-200 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-12">
          <span className="text-primary text-3xl mb-4 opacity-80 block font-light">✧</span>
          <h2 className="text-3xl md:text-4xl font-heading text-gray-900 tracking-[0.2em] mb-4">
            Datos <span className="italic text-primary-hover font-light">Personales</span>
          </h2>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
          <p className="text-gray-500 text-sm tracking-wide font-light">
            Gestione su información de contacto y credenciales.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative group">
            <label className="text-[10px] uppercase tracking-[3px] text-primary/80 block mb-2 transition-colors group-focus-within:text-primary">
              Nombre Completo
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-gray-900/20 text-lg font-light"
            />
          </div>

          <div className="relative group">
            <label className="text-[10px] uppercase tracking-[3px] text-primary/80 block mb-2 transition-colors group-focus-within:text-primary">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-gray-900/20 text-lg font-light"
            />
          </div>

          <div className="relative group">
            <label className="text-[10px] uppercase tracking-[3px] text-primary/80 block mb-2 transition-colors group-focus-within:text-primary">
              Nueva Contraseña (Opcional)
            </label>
            <input
              type="password"
              placeholder="Deje en blanco para mantener la actual"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-gray-900/20 text-lg font-light"
            />
          </div>

          <div className="pt-8">
            <motion.button
              type="submit"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              className="group relative w-full py-5 bg-transparent border border-primary text-primary font-body text-xs uppercase tracking-[4px] overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(197,160,89,0.5)]">
              <div className="absolute inset-0 w-0 bg-primary transition-all duration-[400ms] ease-out group-hover:w-full"></div>
              <span className="relative z-10 font-bold tracking-[5px] group-hover:text-black transition-colors duration-300">
                GUARDAR CAMBIOS
              </span>
            </motion.button>
          </div>
        </form>
      </FadeIn>
    </PageTransition>
  );
};

export default ProfileView;
