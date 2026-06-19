import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "@/services/api";
import { PageTransition, FadeIn } from "@/motion";
import { getApiErrorMessage } from "@/utils/apiErrors";

const ForgotPasswordView = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/forgot-password", { email });
      setSubmitted(true);
    } catch (err) {
      setError(getApiErrorMessage(err, "No se pudo procesar la solicitud. Inténtelo de nuevo."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center bg-bg-body pt-20 px-4">
      <Helmet><title>Recuperar Contraseña | Distrito Gourmet</title></Helmet>
      <FadeIn className="max-w-md w-full bg-bg-surface border border-text-main/10 p-10 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

        <div className="text-center mb-10">
          <span className="text-primary text-[10px] uppercase tracking-[5px] font-body block mb-4">
            Recuperación
          </span>
          <h1 className="font-heading text-[1.8rem] sm:text-4xl text-text-main uppercase tracking-[0.05em] sm:tracking-widest">
            Contraseña
          </h1>
        </div>

        {submitted ? (
          <div className="text-center space-y-6">
            <p className="text-text-muted font-body text-sm leading-relaxed">
              Si el correo está registrado, recibirá un enlace de recuperación en breve. Revise también su carpeta de spam.
            </p>
            <NavLink
              to="/login"
              className="text-primary hover:text-primary-hover font-bold text-[11px] uppercase tracking-[3px] transition-colors"
            >
              Volver al acceso
            </NavLink>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <p className="text-text-muted font-body text-sm leading-relaxed text-center">
              Introduzca su correo electrónico y le enviaremos un enlace para restablecer su contraseña.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[3px] text-text-muted font-bold ml-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-text-main/20 py-3 px-1 text-text-main focus:outline-none focus:border-primary transition-colors font-body font-normal"
                placeholder="su@email.com"
                required
              />
            </div>

            {error && (
              <p className="text-red-700 text-sm border border-red-200 bg-red-50 px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-5 bg-text-main text-white font-body text-[11px] uppercase tracking-[4px] overflow-hidden transition-all duration-500 hover:bg-primary-hover disabled:opacity-50"
            >
              <span className="relative z-10 font-bold">
                {loading ? "Enviando..." : "Enviar Enlace"}
              </span>
            </button>
          </form>
        )}

        <div className="mt-12 pt-8 border-t border-text-main/5 text-center">
          <NavLink
            to="/login"
            className="text-text-muted hover:text-text-main font-body text-[11px] uppercase tracking-[2px] transition-colors"
          >
            Volver al acceso
          </NavLink>
        </div>
      </FadeIn>
    </PageTransition>
  );
};

export default ForgotPasswordView;
