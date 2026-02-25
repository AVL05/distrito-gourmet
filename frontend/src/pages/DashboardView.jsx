import { useAuthStore } from "@/store/auth";
import { Link } from "react-router-dom";

const DashboardView = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-bg-body pt-40 pb-32 px-4 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

      <div className="container max-w-5xl relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 animate-fade-in border-b border-gray-200 pb-8">
          <div>
            <span className="block text-primary text-[10px] uppercase tracking-[5px] mb-3 font-body opacity-90">
              Área Privada
            </span>
            <h1 className="font-heading text-4xl md:text-5xl text-gray-900 uppercase tracking-widest leading-tight">
              Bienvenido,<br/>
              <span className="italic text-primary-hover font-light">{user?.name || "Huésped"}</span>
            </h1>
            <p className="text-gray-500 font-light mt-4 tracking-wide text-sm">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="group relative px-8 py-3 bg-transparent border border-gray-200 text-gray-500 font-body text-[10px] uppercase tracking-[3px] overflow-hidden transition-all duration-300 hover:border-red-500/50"
          >
            <div className="absolute inset-0 w-0 bg-red-900/20 transition-all duration-[400ms] ease-out group-hover:w-full"></div>
            <span className="relative z-10 group-hover:text-red-400 transition-colors duration-300">
              Cerrar Sesión
            </span>
          </button>
        </div>

        {/* Statistics / Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in delay-100">
          {/* Reservations Card */}
          <div className="group bg-white/90 backdrop-blur-md border border-gray-100 p-10 hover:border-primary/40 hover:shadow-[0_0_40px_rgba(197,160,89,0.1)] transition-all duration-500 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <Link to="/reservations" className="block h-full relative z-10">
              <span className="text-primary text-3xl mb-6 block font-light opacity-80 group-hover:scale-110 transition-transform duration-500">
                ✦
              </span>
              <h3 className="font-heading text-2xl text-gray-900 mb-3 tracking-wide">
                Mis <span className="italic text-primary-hover">Reservas</span>
              </h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed mb-8">
                Gestione sus futuras experiencias gastronómicas y consulte el historial de visitas.
              </p>
              <span className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[3px] text-primary transition-all group-hover:text-gray-900">
                Ver Detalles <span className="w-6 h-[1px] bg-primary group-hover:bg-white transition-colors"></span>
              </span>
            </Link>
          </div>

          {/* Profile Card */}
          <div className="group bg-white/90 backdrop-blur-md border border-gray-100 p-10 hover:border-primary/40 hover:shadow-[0_0_40px_rgba(197,160,89,0.1)] transition-all duration-500 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <Link to="/profile" className="block h-full relative z-10">
              <span className="text-primary text-3xl mb-6 block font-light opacity-80 group-hover:scale-110 transition-transform duration-500">
                ✧
              </span>
              <h3 className="font-heading text-2xl text-gray-900 mb-3 tracking-wide">
                Datos <span className="italic text-primary-hover">Personales</span>
              </h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed mb-8">
                Actualice sus preferencias, alergias y configuración de contacto.
              </p>
              <span className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[3px] text-primary transition-all group-hover:text-gray-900">
                Editar Perfil <span className="w-6 h-[1px] bg-primary group-hover:bg-white transition-colors"></span>
              </span>
            </Link>
          </div>

          {/* Favorites Card */}
          <div className="group bg-white/90 backdrop-blur-md border border-gray-100 p-10 hover:border-primary/40 hover:shadow-[0_0_40px_rgba(197,160,89,0.1)] transition-all duration-500 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            {/* <Link to="/favorites" className="block h-full relative z-10"> */}
            <div className="block h-full relative z-10 opacity-50">
              <span className="text-primary text-3xl mb-6 block font-light opacity-80 group-hover:scale-110 transition-transform duration-500">
                ⋆
              </span>
              <h3 className="font-heading text-2xl text-gray-900 mb-3 tracking-wide">
                Bodega <span className="italic text-primary-hover">& Favoritos</span>
              </h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed mb-8">
                Su selección personal de vinos y platos memorables (Próximamente).
              </p>
              <span className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[3px] text-primary/50 transition-all">
                En Desarrollo <span className="w-6 h-[1px] bg-primary/50"></span>
              </span>
            </div>
            {/* </Link> */}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-16 bg-white/90 backdrop-blur-md border border-gray-100 p-10 relative overflow-hidden animate-fade-in delay-200">
          <div className="absolute left-0 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>

          <h3 className="font-heading text-xl text-gray-900 mb-8 uppercase tracking-[4px] border-b border-gray-200 pb-4 font-light">
            Actividad <span className="italic text-primary-hover">Reciente</span>
          </h3>
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-900/40 font-light text-sm tracking-wide">
            <span className="text-primary/30 text-2xl mb-4">⚲</span>
            <p>Aún no hay registros en su historial de visitas.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
