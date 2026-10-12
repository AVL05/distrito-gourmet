import { getReturnTo } from "@/utils/authReturn";
import { useAuthStore } from "@/store/auth";
import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import { PageTransition, FadeIn } from "@/motion";
import { IS_PUBLIC_DEMO } from "@/config/demo";

const LoginView = () => {
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const returnState = location.state || {};
  const returnTo = getReturnTo(returnState.returnTo || new URLSearchParams(location.search).get("next"));
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (IS_PUBLIC_DEMO) {
      Swal.fire({
        icon: "info",
        title: "Acceso no disponible",
        text: "El acceso de usuarios no está disponible en esta vista pública.",
        background: "#fdfaf6",
        color: "#2c302e",
        confirmButtonColor: "var(--accent)",
      });
      return;
    }

    try {
      const success = await login(formData);

      if (success) {
        await Swal.fire({
          icon: "success",
          title: "Bienvenido",
          text: "Sesión iniciada correctamente",
          background: "#fdfaf6",
          color: "#2c302e",
          confirmButtonColor: "var(--accent)",
          timer: 1500,
        });
        navigate(returnTo, { replace: true, state: { reservationDraft: returnState.reservationDraft } });
      } else {
        const errorMsg = useAuthStore.getState().error;

        Swal.fire({
          icon: "error", title: "No pudimos iniciar sesión",
          text: errorMsg || "Revise el correo y la contraseña e inténtelo de nuevo.",
          background: "#FCFBF8", color: "#224032", confirmButtonColor: "var(--accent)",
          confirmButtonText: "Reintentar",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: "No se pudo conectar con el servidor. Inténtelo de nuevo.",
        background: "#fdfaf6",
        color: "#2c302e",
        confirmButtonColor: "var(--accent)",
      });
    }
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center bg-bg-body pt-20 px-4">
      <Helmet>
        <title>Iniciar Sesión | Distrito Gourmet</title>
      </Helmet>
      <FadeIn className="max-w-md w-full bg-bg-surface border border-text-main/10 p-10 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
        <div className="text-center mb-10">
          <span className="text-primary-hover text-[10px] uppercase tracking-[5px] font-body block mb-4">
            Su cuenta
          </span>
          <h1 className="font-heading text-[1.8rem] sm:text-4xl text-text-main uppercase tracking-[0.05em] sm:tracking-widest">
            Identificación
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {IS_PUBLIC_DEMO && (
            <div className="border border-primary/20 bg-primary/10 px-4 py-3 text-center text-[11px] uppercase tracking-[2px] text-primary-hover font-body font-bold">
              Acceso no disponible en esta vista
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="login-email" className="text-[12px] text-text-muted font-bold ml-1">
              Email
            </label>
            <input
              id="login-email"
              autoComplete="username"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-text-main/20 py-3 px-1 text-text-main focus-visible:outline focus:border-primary transition-colors font-body font-normal"
              placeholder="su@email.com"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label htmlFor="login-password" className="text-[12px] text-text-muted font-bold">
                Contraseña
              </label>
              <NavLink
                to="/forgot-password"
                className="text-[10px] uppercase tracking-[2px] text-text-muted hover:text-primary-hover transition-colors font-medium"
              >
                ¿Olvidó su contraseña?
              </NavLink>
            </div>
            <input
              id="login-password"
              autoComplete="current-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-text-main/20 py-3 px-1 text-text-main focus-visible:outline focus:border-primary transition-colors font-body font-normal"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || IS_PUBLIC_DEMO}
            className="group relative w-full py-5 bg-text-main text-white font-body text-[11px] uppercase tracking-[4px] overflow-hidden transition-all duration-500 hover:bg-primary-hover"
          >
            <span className="relative z-10 font-bold">{loading ? "Iniciando sesión…" : "Iniciar Sesión"}</span>
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-text-main/5 text-center">
          <p className="text-text-muted text-[11px] font-body tracking-[1px] mb-4 uppercase">
            ¿No tiene una cuenta todavía?
          </p>
          <NavLink
            to="/register"
            state={{ ...returnState, returnTo }}
            className="text-primary-hover hover:text-primary-hover font-bold text-[11px] uppercase tracking-[3px] transition-colors"
          >
            Crear cuenta
          </NavLink>
        </div>
      </FadeIn>
    </PageTransition>
  );
};

export default LoginView;
