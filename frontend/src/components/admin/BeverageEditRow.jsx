import { useState } from "react";
import axios from "@/services/api";
import Swal from "sweetalert2";

// Fila editable para la gestión individual de bebidas en el panel de administración
const BeverageEditRow = ({ item, fetchData, handleDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState({ ...item });

  const handleUpdate = async () => {
    try {
      // Envía la actualización de la bebida al servidor
      await axios.put(`/admin/beverages/${item.id}`, edit);
      Swal.fire({
        icon: "success",
        title: "Bebida Actualizada",
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
      <div className="bg-bg-surface border border-primary/30 p-8 flex flex-col gap-8 shadow-[0_30px_60px_rgba(0,0,0,0.2)] relative h-full rounded-sm transition-all">
        <div className="space-y-6 overflow-y-auto max-h-[450px] pr-3 scrollbar-thin">
          <div className="text-left">
            <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-2 font-bold opacity-70">
              Nombre
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
              Precio (€)
            </label>
            <input
              type="number"
              step="0.01"
              value={edit.precio}
              onChange={(e) => setEdit({ ...edit, precio: e.target.value })}
              className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-base focus:border-primary focus:ring-0 outline-none transition-all font-bold"
            />
          </div>

          <div className="text-left">
            <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-2 font-bold opacity-70">
              Tipo
            </label>
            <select
              value={edit.tipo}
              onChange={(e) => setEdit({ ...edit, tipo: e.target.value })}
              className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary focus:ring-0 outline-none appearance-none cursor-pointer"
            >
              <option value="agua">Agua</option>
              <option value="refresco">Refresco</option>
              <option value="cocktail">Cóctel</option>
              <option value="cafe">Café</option>
            </select>
          </div>

          <div className="text-left">
            <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-2 font-bold opacity-70">
              Descripción
            </label>
            <input
              type="text"
              value={edit.descripcion || ""}
              onChange={(e) =>
                setEdit({ ...edit, descripcion: e.target.value })
              }
              className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary focus:ring-0 outline-none transition-all italic"
              placeholder="Ej: Con gas, sin cafeína..."
            />
          </div>

          <div className="flex flex-col gap-4 pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={edit.destacado}
                onChange={(e) =>
                  setEdit({ ...edit, destacado: e.target.checked })
                }
                className="w-4 h-4 accent-primary"
              />
              <span className="text-[11px] uppercase tracking-[2px] text-text-muted group-hover:text-primary transition-colors">
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
              <span className="text-[11px] uppercase tracking-[2px] text-text-muted group-hover:text-primary transition-colors">
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
    <div className="group bg-bg-surface/90 border border-text-main/10 p-7 flex flex-col justify-between transition-all duration-500 relative overflow-hidden h-full hover:border-primary/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
      <div>
        <div className="flex justify-between items-start mb-6">
          <span className="text-primary text-[10px] uppercase tracking-[4px] font-bold opacity-60 group-hover:opacity-100 transition-opacity">
            {item.tipo}
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
        <h4 className="text-text-main font-heading text-2xl mb-2 leading-tight group-hover:text-primary transition-colors">
          {item.nombre}
        </h4>
        {/* Muestra la descripción si el producto la tiene definida */}
        {item.descripcion && (
          <p className="text-text-muted text-sm font-normal italic leading-relaxed opacity-70 mb-4">
            "{item.descripcion}"
          </p>
        )}
      </div>
      <div className="pt-6 border-t border-text-main/5 flex justify-between items-end">
        <span className="text-text-main font-heading text-2xl">
          {parseFloat(item.precio).toFixed(2)}€
        </span>
        <div className="w-8 h-[1px] bg-primary/20 group-hover:w-12 transition-all"></div>
      </div>
    </div>
  );
};

export default BeverageEditRow;
