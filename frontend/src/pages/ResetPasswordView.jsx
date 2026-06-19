import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useSearchParams, useNavigate, NavLink } from "react-router-dom";
import axios from "@/services/api";
import Swal from "sweetalert2";
import { PageTransition, FadeIn } from "@/motion";
import { getApiErrorMessage } from "@/utils/apiErrors";

const ResetPasswordView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password_confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/reset-password", {
        token,
        email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      await Swal.fire({
        icon: "success",
        title: "Contraseña Restablecida",
        text: "Su contraseña se ha actualizado. Por favor, inicie sesión.",
        background: "#fdfaf6",
        color: "#2c302e",
        confirmButtonColor: "#e76f51",
        timer: 2500,
      });

      navigate("/login");
    } catch (err) {
      setError(getApiErrorMessage(err, "El enlace de recuperación no es válido o ha caducado."));
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <PageTransition className="min-h-screen flex items-center justify-center bg-bg-body pt-20 px-4">
        <FadeIn className="max-w-md w-full text-center space-y-6">
          <p className="text-text-muted font-body text-sm">
            Enlace de recuperación inválido o incompleto.
          </p>
          <NavLink
            to="/forgot-password"
            className="text-primary hover:text-primary-hover font-bold text-[11px] uppercase tracking-[3px] transition-colors"
          >
            Solicitar nuevo enlace
          </NavLink>
        </FadeIn>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-screen flex items-center justify-center bg-bg-body pt-20 px-4">
      <Helmet><title>Nueva Contraseña | Distrito Gourmet</title></Helmet>
      <FadeIn className="max-w-md w-full bg-bg-surface border border-text-main/10 p-10 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

        <div className="text-center mb-10">
          <span className="text-primary text-[10px] uppercase tracking-[5px] font-body block mb-4">
            Nueva Contraseña
          </span>
          <h1 className="font-heading text-[1.8rem] sm:text-4xl text-text-main uppercase tracking-[0.05em] sm:tracking-widest">
            Restablecer
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[3px] text-text-muted font-bold ml-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-text-main/20 py-3 px-1 text-text-main focus:outline-none focus:border-primary transition-colors font-body font-normal"
              placeholder="Mínimo 8 caracteres"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[3px] text-text-muted font-bold ml-1">
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-text-main/20 py-3 px-1 text-text-main focus:outline-none focus:border-primary transition-colors font-body font-normal"
              placeholder="Repita la contraseña"
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
              {loading ? "Guardando..." : "Establecer Contraseña"}
            </span>
          </button>
        </form>
      </FadeIn>
    </PageTransition>
  );
};

export default ResetPasswordView;
