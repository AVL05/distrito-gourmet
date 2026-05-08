import { HiTrash } from "react-icons/hi";

// Tarjeta visual para la gestión y asignación de mesas en las reservas
const ReservationCard = ({
  res,
  handleUpdateReservation,
  handleDeleteItem,
}) => {
  return (
    <div
      key={res.id}
      // Aplica estilos visuales según si la reserva está pendiente, confirmada o cancelada
      className={`bg-bg-surface/90 border p-5 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
        res.estado === "Pendiente"
          ? "border-primary/50 shadow-[0_0_20px_rgba(197,160,89,0.1)]"
          : res.estado === "Confirmada"
            ? "border-[#22c55e]/30 shadow-[0_0_20px_rgba(34,197,94,0.05)]"
            : res.estado === "Cancelada"
              ? "border-[#ef4444]/30 shadow-[0_0_20px_rgba(239,68,68,0.05)]"
              : "border-text-main/5 hover:border-text-main/20"
      }`}
    >
      {res.estado === "Pendiente" && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl -mr-8 -mt-8"></div>
      )}

      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-primary text-[9px] uppercase tracking-[3px] font-bold">
            Reserva #{res.codigo_reserva || res.id}
          </span>
          <div
            className={`w-2 h-2 rounded-full ${
              res.estado === "Pendiente"
                ? "bg-primary animate-pulse"
                : res.estado === "Confirmada"
                  ? "bg-[#22c55e]"
                  : "bg-[#ef4444]"
            }`}
          ></div>
        </div>
        <p className="text-text-main font-heading text-lg mb-1">
          {res.usuario?.nombre || `ID: ${res.usuario_id}`}
        </p>
        <p className="text-text-muted text-[11px] mb-4 opacity-70">
          Registrado: {new Date(res.creado_a).toLocaleDateString()}
        </p>

        <div className="space-y-2 bg-black/5 p-3 rounded-sm border border-text-main/5">
          <div className="flex items-center gap-3">
            <span className="text-text-main text-xs font-bold uppercase tracking-widest opacity-40">
              FECHA:
            </span>
            <span className="text-text-main text-sm font-normal">
              {new Date(res.fecha_reserva + "T00:00:00").toLocaleDateString(
                "es-ES",
                {
                  day: "2-digit",
                  month: "long",
                },
              )}{" "}
              - {res.hora_reserva ? res.hora_reserva.slice(0, 5) : ""}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-text-main text-xs font-bold uppercase tracking-widest opacity-40">
              COMENSALES:
            </span>
            <span className="text-text-main text-sm font-normal">
              {res.comensales} comensales
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2 pt-2 border-t border-text-main/5">
            <span className="text-primary text-[10px] font-bold uppercase tracking-widest">
              MESA:
            </span>
            {/* Permite asignar un ID de mesa directamente desde la tarjeta */}
            <input
              type="text"
              placeholder="Sin asignar"
              defaultValue={res.mesa_id || ""}
              onBlur={(e) =>
                handleUpdateReservation(res.id, { mesa_id: e.target.value })
              }
              className="bg-transparent border-0 border-b border-primary/20 text-text-main text-xs p-0 focus:ring-0 focus:border-primary transition-all w-full placeholder:text-text-muted/30"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-text-main/5 gap-2">
        <span className="text-[10px] uppercase tracking-widest text-text-muted">
          Estado
        </span>
        <div className="flex items-center gap-2">
          <select
            value={res.estado}
            onChange={(e) =>
              handleUpdateReservation(res.id, { estado: e.target.value })
            }
            // Cambia el borde a dorado si está pendiente para llamar la atención del admin
            className={`bg-bg-surface border border-text-main/10 text-text-main rounded p-1.5 pr-8 text-[11px] uppercase tracking-widest outline-none transition-all ${
              res.estado === "Pendiente" ? "border-primary/40 text-primary" : ""
            }`}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Confirmada">Confirmada</option>
            <option value="Cancelada">Cancelada</option>
          </select>

          {res.estado === "Cancelada" && (
            <button
              onClick={() =>
                handleDeleteItem(
                  "reservations",
                  res.id,
                  `Reserva de ${res.usuario?.nombre || "ID: " + res.usuario_id}`,
                )
              }
              className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded transition-all duration-300 shadow-md group/del"
              title="Eliminar Reserva"
            >
              <HiTrash className="text-base group-hover/del:scale-110 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationCard;
