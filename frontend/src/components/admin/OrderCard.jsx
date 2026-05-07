import { HiTrash } from "react-icons/hi";

const OrderCard = ({ order, handleUpdateOrderStatus, handleDeleteItem }) => {
  return (
    <div
      key={order.id}
      className={`bg-bg-surface/90 border p-5 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
        order.estado === "Pendiente"
          ? "border-primary/50 shadow-[0_0_20px_rgba(197,160,89,0.1)]"
          : order.estado === "Preparando"
            ? "border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.05)]"
            : order.estado === "Listo"
              ? "border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.05)]"
              : order.estado === "Cancelado"
                ? "border-[#ef4444]/30 shadow-[0_0_20px_rgba(239,68,68,0.05)]"
                : "border-text-main/5 hover:border-text-main/20 shadow-sm"
      }`}
    >
      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <span className="text-primary text-[11px] uppercase tracking-[3px] font-bold">
              #{order.numero_pedido || order.id}
            </span>
          </div>
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              order.estado === "Pendiente"
                ? "bg-primary animate-pulse"
                : order.estado === "Preparando"
                  ? "bg-amber-500"
                  : order.estado === "Listo"
                    ? "bg-[#22c55e]"
                    : order.estado === "Cancelado"
                      ? "bg-[#ef4444]"
                      : "bg-text-muted/30"
            }`}
          ></div>
        </div>
        <p className="text-text-main font-heading text-xl mb-1">
          {order.usuario?.nombre || `ID: ${order.usuario_id}`}
        </p>
        <p className="text-text-muted text-[13px] mb-4 opacity-70 font-medium">
          Total: {parseFloat(order.total).toFixed(2)}€
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <div className="bg-primary/10 px-3 py-1.5 rounded-sm border border-primary/20 flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-primary font-bold">
              Recogida:
            </span>
            <span className="text-sm font-heading text-primary">
              {order.fecha_recogida
                ? new Date(order.fecha_recogida).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                  })
                : "Hoy"}{" "}
              - {order.hora_recogida?.substring(0, 5) || "Sin hora"}
            </span>
          </div>
          <div className="bg-black/5 px-3 py-1.5 rounded-sm border border-text-main/5 flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-text-muted font-bold">
              Pago:
            </span>
            <span className="text-sm font-body text-text-main uppercase tracking-tighter font-medium">
              {order.metodo_pago === "card"
                ? "Tarjeta"
                : order.metodo_pago === "cash"
                  ? "Efectivo"
                  : order.metodo_pago || "Pendiente"}
            </span>
          </div>
        </div>

        <div className="bg-black/5 p-4 rounded-sm border border-text-main/5">
          <p className="text-text-main text-[14px] font-normal leading-relaxed italic opacity-90">
            {order.detalles
              ?.map((i) => {
                const nombre =
                  i.plato?.nombre ||
                  i.vino?.nombre ||
                  i.bebida?.nombre ||
                  i.menu_degustacion?.nombre ||
                  "Producto";
                return `${i.cantidad}x ${nombre}`;
              })
              .join(", ")}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-text-main/5 gap-4">
        <span className="text-[12px] uppercase tracking-widest text-text-muted hidden sm:block font-bold">
          Logística
        </span>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={order.estado}
            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
            className="bg-bg-surface border border-text-main/10 text-text-main rounded p-2 pr-8 text-[13px] uppercase tracking-widest outline-none flex-grow sm:flex-initial font-medium"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Preparando">Preparando</option>
            <option value="Listo">Listo</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>

          {order.estado === "Cancelado" && (
            <button
              onClick={() =>
                handleDeleteItem(
                  "orders",
                  order.id,
                  `Pedido #${order.numero_pedido || order.id}`,
                )
              }
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all duration-300 shadow-md group/del"
              title="Eliminar Pedido"
            >
              <HiTrash className="text-lg group-hover/del:scale-110 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
