import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuthStore } from '../store/auth';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { PageTransition, FadeIn, Toast } from '@/motion';

const RegisterView = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { register, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        confirmButtonColor: '#e76f51',
        background: '#fdfaf6',
        color: '#2c302e',
      });
      return;
    }

    const success = await register({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <PageTransition className="flex flex-col items-center justify-center min-h-[85vh] bg-bg-body relative overflow-hidden py-24 px-4">
      {/* Líneas de fondo decorativas */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-text-main/5 -translate-x-1/2 z-0 hidden md:block"></div>
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-text-main/5 -translate-y-1/2 z-0 hidden md:block"></div>

      <FadeIn className="w-full max-w-xl bg-bg-surface p-12 md:p-16 border border-text-main/10 relative z-10 shadow-sm">
        <div className="text-center mb-16">
          <span className="text-text-muted text-[10px] uppercase tracking-[4px] mb-6 block font-body">
            / Unirse al Club
          </span>
          <h2 className="text-5xl font-heading text-text-main leading-tight mb-6">
            Su <span className="italic text-primary">Inscripción</span>
          </h2>
          <div className="w-16 h-[1px] bg-text-main/10 mx-auto mb-6"></div>
          <p className="text-text-muted text-[13px] tracking-widest font-body uppercase">
            Círculo Exclusivo Distrito Gourmet
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="relative group">
            <label className="text-[10px] uppercase tracking-[3px] text-text-muted block mb-2 font-body">
              Nombre Completo
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder=" "
              className="w-full bg-transparent border-0 border-b border-text-main/20 text-text-main py-2 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 text-lg font-heading"
            />
          </div>

          <div className="relative group">
            <label className="text-[10px] uppercase tracking-[3px] text-text-muted block mb-2 font-body">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder=" "
              className="w-full bg-transparent border-0 border-b border-text-main/20 text-text-main py-2 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 text-lg font-heading"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="relative group">
              <label className="text-[10px] uppercase tracking-[3px] text-text-muted block mb-2 font-body">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder=" "
                className="w-full bg-transparent border-0 border-b border-text-main/20 text-text-main py-2 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 text-lg font-heading tracking-widest"
              />
            </div>

            <div className="relative group">
              <label className="text-[10px] uppercase tracking-[3px] text-text-muted block mb-2 font-body">
                Confirmar
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder=" "
                className="w-full bg-transparent border-0 border-b border-text-main/20 text-text-main py-2 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 text-lg font-heading tracking-widest"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <Toast className="p-4 bg-red-50 text-red-800 text-center text-xs font-body tracking-wider border border-red-100">
                {error}
              </Toast>
            )}
          </AnimatePresence>

          <div className="pt-8">
            <motion.button
              type="submit"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              className="group relative w-full py-4 bg-transparent border border-text-main text-text-main font-body text-[10px] uppercase tracking-[4px] overflow-hidden transition-all hover:border-text-main"
              disabled={loading}>
              <div className="absolute inset-0 w-0 bg-text-main transition-all duration-[400ms] ease-out group-hover:w-full z-0"></div>
              <span className="relative z-10 font-bold group-hover:text-bg-body transition-colors duration-300">
                {loading ? 'PROCESANDO...' : 'SOLICITAR REGISTRO'}
              </span>
            </motion.button>
          </div>
        </form>

        <div className="text-center mt-12 pt-12 border-t border-text-main/10">
          <p className="text-text-muted text-[10px] uppercase tracking-[3px] mb-4 font-body">¿Ya dispone de cuenta?</p>
          <Link
            to="/login"
            className="text-text-main text-[10px] uppercase tracking-[3px] font-bold pb-1 group relative inline-block border-b border-text-main hover:text-primary hover:border-primary transition-colors">
            Iniciar Sesión
          </Link>
        </div>
      </FadeIn>
    </PageTransition>
  );
};

export default RegisterView;
