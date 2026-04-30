import { useAuthStore } from '@/store/auth';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { PageTransition, FadeIn } from '@/motion';

// Componente para la vista de inicio de sesión
const LoginView = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  // Estado local para guardar los datos del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Función para actualizar los datos mientras el usuario escribe
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Función para enviar los datos de inicio de sesión
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Intentar iniciar sesión llamando a la tienda de autenticación
      await login(formData);
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: 'Sesión iniciada correctamente',
        background: '#fdfaf6',
        color: '#2c302e',
        confirmButtonColor: '#e76f51',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error de Acceso',
        text: 'Credenciales inválidas, por favor revise sus datos.',
        background: '#fdfaf6',
        color: '#2c302e',
        confirmButtonColor: '#e76f51',
      });
    }
  };

  return (
    // Contenedor principal con animación de transición de página
    <PageTransition className="min-h-screen flex items-center justify-center bg-bg-body pt-20 px-4">
      {/* Tarjeta de inicio de sesión */}
      <FadeIn className="max-w-md w-full bg-bg-surface border border-text-main/10 p-10 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
        <div className="text-center mb-10">
          <span className="text-primary text-[10px] uppercase tracking-[5px] font-body block mb-4">Acceso Premium</span>
          <h1 className="font-heading text-4xl text-text-main uppercase tracking-widest">Identificación</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[3px] text-text-muted font-bold ml-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-text-main/20 py-3 px-1 text-text-main focus:outline-none focus:border-primary transition-colors font-body font-light"
              placeholder="su@email.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[3px] text-text-muted font-bold ml-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-text-main/20 py-3 px-1 text-text-main focus:outline-none focus:border-primary transition-colors font-body font-light"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="group relative w-full py-5 bg-text-main text-white font-body text-[11px] uppercase tracking-[4px] overflow-hidden transition-all duration-500 hover:bg-primary-hover">
            <span className="relative z-10 font-bold">Iniciar Sesión</span>
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-text-main/5 text-center">
          <p className="text-text-muted text-[11px] font-body tracking-[1px] mb-4 uppercase">
            ¿No tiene una cuenta todavía?
          </p>
          <NavLink
            to="/register"
            className="text-primary hover:text-primary-hover font-bold text-[11px] uppercase tracking-[3px] transition-colors">
            Solicitar Registro
          </NavLink>
        </div>
      </FadeIn>
    </PageTransition>
  );
};

export default LoginView;
