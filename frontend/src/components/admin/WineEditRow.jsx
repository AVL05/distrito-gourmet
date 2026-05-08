import { useState } from "react";
import axios from "@/services/api";
import Swal from "sweetalert2";

// Fila editable para la gestión individual de vinos en el panel de administración
const WineEditRow = ({ item, fetchData, handleDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState({ ...item });

  const handleUpdate = async () => {
    try {
      const payload = { ...edit };
      delete payload.creado_a;
      delete payload.actualizado_a;

      // Actualiza la información del vino y refresca la lista
      await axios.put(`/admin/wines/${item.id}`, payload);
      Swal.fire({
        icon: "success",
        title: "Vino Actualizado",
        timer: 1500,
        showConfirmButton: false,
      });
      setIsEditing(false);
      fetchData();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar",
      });
    }
  };

  if (isEditing) {
    return (
      <div className="bg-bg-surface border border-primary/30 p-8 flex flex-col gap-8 shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative h-full rounded-sm transition-all">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-primary font-heading text-xl uppercase tracking-widest">
            Editando Bodega
          </h4>
          <span className="text-[10px] text-text-muted font-bold opacity-40">
            #{item.id}
          </span>
        </div>

        <div className="space-y-6 overflow-y-auto max-h-[550px] pr-3 scrollbar-thin">
          <div className="text-left">
            <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-2 font-bold opacity-70">
              Nombre del Caldo
            </label>
            <input
              type="text"
              value={edit.nombre}
              onChange={(e) => setEdit({ ...edit, nombre: e.target.value })}
              className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-base focus:border-primary focus:ring-0 outline-none transition-all font-heading"
            />
          </div>

          <div className="text-left">
            <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-2 font-bold opacity-70">
              Tipo de Vino
            </label>
            <select
              value={edit.tipo}
              onChange={(e) => setEdit({ ...edit, tipo: e.target.value })}
              className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:ring-0 outline-none focus:border-primary appearance-none cursor-pointer"
            >
              <option value="Tinto">Tinto</option>
              <option value="Blanco">Blanco</option>
              <option value="Rosado">Rosado</option>
              <option value="Espumoso">Espumoso</option>
              <option value="Dulce">Dulce</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="text-left">
              <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-2 font-bold opacity-70">
                Región
              </label>
              <input
                type="text"
                value={edit.region || ""}
                onChange={(e) => setEdit({ ...edit, region: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary focus:ring-0 outline-none transition-all"
              />
            </div>
            <div className="text-left">
              <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-2 font-bold opacity-70">
                Uva
              </label>
              <input
                type="text"
                value={edit.uva || ""}
                onChange={(e) => setEdit({ ...edit, uva: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary focus:ring-0 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="text-left">
              <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-2 font-bold opacity-70">
                Botella (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={edit.precio_botella}
                onChange={(e) =>
                  setEdit({ ...edit, precio_botella: e.target.value })
                }
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-base focus:border-primary focus:ring-0 outline-none transition-all font-bold"
              />
            </div>
            <div className="text-left">
              <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-2 font-bold opacity-70">
                Copa (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={edit.precio_copa || ""}
                onChange={(e) =>
                  setEdit({ ...edit, precio_copa: e.target.value })
                }
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-base focus:border-primary focus:ring-0 outline-none transition-all"
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="text-left">
            <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-2 font-bold opacity-70">
              Notas de Cata
            </label>
            <textarea
              rows="3"
              value={edit.notas_maridaje || ""}
              onChange={(e) =>
                setEdit({ ...edit, notas_maridaje: e.target.value })
              }
              // Espacio para notas de cata o maridaje recomendados
              className="w-full bg-text-main/5 border border-text-main/10 text-text-main p-3 text-sm focus:border-primary focus:ring-0 outline-none transition-all resize-none italic"
              placeholder="Describa el carácter del vino..."
            />
          </div>

          <div className="grid grid-cols-2 gap-y-4 pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={edit.destacado}
                onChange={(e) =>
                  setEdit({ ...edit, destacado: e.target.checked })
                }
                className="w-4 h-4 accent-primary"
              />
              <span className="text-[11px] uppercase tracking-[1px] text-text-muted group-hover:text-primary transition-colors">
                Destacado
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={edit.disponible}
                onChange={(e) =>
                  setEdit({ ...edit, disponible: e.target.checked })
                }
                className="w-4 h-4 accent-primary"
              />
              <span className="text-[11px] uppercase tracking-[1px] text-text-muted group-hover:text-primary transition-colors">
                Disponible
              </span>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 border-t border-text-main/5 mt-auto">
          <button
            onClick={handleUpdate}
            className="w-full bg-primary hover:bg-primary-hover text-white py-4 font-bold text-[11px] uppercase tracking-[4px] transition-all shadow-lg"
          >
            Guardar Cambios
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="w-full text-text-muted hover:text-text-main text-[11px] uppercase tracking-[2px] font-bold transition-colors py-2"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-bg-surface/90 border border-text-main/10 p-7 flex flex-col justify-between transition-all duration-500 relative overflow-hidden h-full hover:border-primary/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors"></div>

      <div>
        <div className="flex justify-between items-start mb-6">
          <span className="text-primary text-[10px] uppercase tracking-[4px] font-bold opacity-60 group-hover:opacity-100 transition-opacity">
            {item.tipo} {item.añada && `• ${item.añada}`}
          </span>
          <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button
              onClick={() => setIsEditing(true)}
              className="text-text-main hover:text-primary text-[10px] uppercase tracking-[2px] font-bold"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 text-[10px] uppercase tracking-[2px] font-bold"
            >
              Eliminar
            </button>
          </div>
        </div>

        <h4 className="text-text-main font-heading text-2xl mb-1 leading-tight group-hover:text-primary transition-colors">
          {item.nombre}
        </h4>
        <p className="text-text-muted text-[10px] uppercase tracking-[2px] mb-4 font-bold opacity-50">
          {item.bodega}
        </p>

        {item.notas_maridaje && (
          <p className="text-text-muted text-sm font-normal italic leading-relaxed mb-8 opacity-70 line-clamp-2">
            "{item.notas_maridaje}"
          </p>
        )}
      </div>

      <div className="pt-6 border-t border-text-main/5 flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-1">
            {/* Muestra precios diferenciados para botella y copa si existen */}
            <span className="text-text-main font-heading text-xl">
              {parseFloat(item.precio_botella).toFixed(2)}€
            </span>
            <span className="text-text-muted text-[8px] uppercase tracking-widest ml-1 opacity-50">
              Botella
            </span>
          </div>
          {item.precio_copa && (
            <div className="flex items-baseline gap-1">
              <span className="text-text-main font-heading text-lg opacity-80">
                {parseFloat(item.precio_copa).toFixed(2)}€
              </span>
              <span className="text-text-muted text-[8px] uppercase tracking-widest ml-1 opacity-50">
                Copa
              </span>
            </div>
          )}
        </div>
        {item.maximo_por_pedido && (
          <div className="text-right">
            <p className="text-[9px] text-primary/60 uppercase tracking-[2px] font-bold">
              Máx. {item.maximo_por_pedido}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WineEditRow;
