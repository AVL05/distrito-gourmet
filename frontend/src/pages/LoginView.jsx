import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login({ email, password });

    if (success) {
      const admin = useAuthStore.getState().isAdmin();
      if (admin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-bg-body relative overflow-hidden py-24">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-lg bg-white/90 shadow-sm border-gray-100 backdrop-blur-xl p-12 md:p-16 border border-gray-200 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm relative z-10">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/50"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/50"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary/50"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-primary/50"></div>

        <div className="text-center mb-12">
          <span className="text-primary text-3xl mb-4 opacity-80 block font-light">✦</span>
          <h2 className="text-3xl md:text-4xl font-heading text-gray-900 tracking-[0.2em] mb-4 font-light">
            Su <span className="italic text-primary-hover">Acceso</span>
          </h2>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
          <p className="text-gray-500 text-sm tracking-wide font-light">
            Área privada para miembros de Distrito Gourmet
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="relative group">
            <label className="text-[10px] uppercase tracking-[3px] text-primary/80 block mb-2 transition-colors group-focus-within:text-primary">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="su@email.com"
              className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-gray-900/20 text-lg font-light"
            />
          </div>

          <div className="relative group">
            <label className="text-[10px] uppercase tracking-[3px] text-primary/80 block mb-2 transition-colors group-focus-within:text-primary">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-transparent border-0 border-b border-gray-200 text-gray-900 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-gray-900/20 text-lg font-light"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 text-center text-sm font-light tracking-wide animate-fade-in">
              {error}
            </div>
          )}

          <div className="pt-8">
            <button
              type="submit"
              className="group relative w-full py-5 bg-transparent border border-primary text-primary font-body text-xs uppercase tracking-[4px] overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(197,160,89,0.5)]"
              disabled={loading}
            >
              <div className="absolute inset-0 w-0 bg-primary transition-all duration-[400ms] ease-out group-hover:w-full"></div>
              <span className="relative z-10 font-bold tracking-[5px] group-hover:text-black transition-colors duration-300">
                {loading ? "VERIFICANDO..." : "ENTRAR"}
              </span>
            </button>
          </div>
        </form>

        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-900/40 text-[10px] uppercase tracking-[3px] mb-4">
            ¿Aún no dispone de cuenta?
          </p>
          <Link
            to="/register"
            className="text-primary text-xs uppercase tracking-[3px] font-bold hover:text-gray-900 transition-colors border-b border-transparent hover:border-gray-300 pb-1"
          >
            SOLICITAR ACCESO
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
