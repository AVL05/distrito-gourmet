import { useState } from "react";
import axios from "@/services/api";
import {
  adminEditInputClass,
  showAdminErrorToast,
  showAdminToast,
} from "@/utils/adminFeedback";

// Fila editable para la gestión individual de platos en el panel de administración
const DishEditRow = ({ item, fetchData, handleDelete, categories }) => {
  const price = Number.parseFloat(item.precio || 0);

  const [isEditing, setIsEditing] = useState(false);
  const [editDish, setEditDish] = useState({
    ...item,
    disponible: !!item.disponible,
    maximo_por_pedido: item.maximo_por_pedido || "",
    es_por_unidad: !!item.es_por_unidad,
  });

  // Actualiza los datos del plato y limpia los campos que no deben enviarse
  const handleUpdate = async () => {
    try {
      const payload = { ...editDish };
      delete payload.categoria;
      delete payload.creado_a;
      delete payload.actualizado_a;

      await axios.put(`/admin/dishes/${item.id}`, payload);
      showAdminToast("Plato actualizado");
      setIsEditing(false);
      fetchData();
    } catch (err) {
      showAdminErrorToast(err, "No se pudo actualizar el plato.");
    }
  };

  if (isEditing) {
    return (
      <div className="bg-bg-surface border border-primary/30 p-8 flex flex-col gap-8 shadow-[0_30px_60px_rgba(0,0,0,0.2)] relative h-full rounded-sm transition-all">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-primary font-heading text-xl uppercase tracking-widest">
            Editando Plato
          </h4>
          <span className="text-[10px] text-text-muted font-bold opacity-40">
            #{item.id}
          </span>
        </div>

        <div className="space-y-6 overflow-y-auto max-h-[500px] pr-3 scrollbar-thin">
          <div className="text-left">
            <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-2 font-bold opacity-70">
              Nombre del Manjar
            </label>
            <input
              type="text"
              value={editDish.nombre}
              onChange={(e) =>
                setEditDish({ ...editDish, nombre: e.target.value })
              }
              className={`${adminEditInputClass} text-base font-heading`}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="text-left">
              <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-2 font-bold opacity-70">
                Precio (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={editDish.precio}
                onChange={(e) =>
                  setEditDish({ ...editDish, precio: e.target.value })
                }
                className={`${adminEditInputClass} text-base font-bold`}
              />
            </div>
            <div className="text-left">
              <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-2 font-bold opacity-70">
                Máx. Pedido
              </label>
              <input
                type="number"
                value={editDish.maximo_por_pedido || ""}
                onChange={(e) =>
                  setEditDish({
                    ...editDish,
                    maximo_por_pedido: e.target.value,
                  })
                }
                className={`${adminEditInputClass} text-base`}
                placeholder="Sin límite"
              />
            </div>
          </div>

          <div className="text-left">
            <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-2 font-bold opacity-70">
              Categoría
            </label>
            <select
              value={editDish.categoria_menu_id}
              onChange={(e) =>
                setEditDish({ ...editDish, categoria_menu_id: e.target.value })
              }
              className={`${adminEditInputClass} appearance-none cursor-pointer`}
            >
              {categories?.map((c) => (
                <option key={c.id} value={c.id} className="bg-bg-surface">
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="text-left">
            <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-2 font-bold opacity-70">
              Descripción
            </label>
            <textarea
              value={editDish.descripcion || ""}
              onChange={(e) =>
                setEditDish({ ...editDish, descripcion: e.target.value })
              }
              className={`${adminEditInputClass} min-h-[80px] resize-none italic`}
              placeholder="¿Qué lleva este plato?"
            />
          </div>

          <div className="text-left">
            <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-2 font-bold opacity-70">
              Alérgenos
            </label>
            <input
              type="text"
              value={editDish.alergenos || ""}
              onChange={(e) =>
                setEditDish({ ...editDish, alergenos: e.target.value })
              }
              className={adminEditInputClass}
              placeholder="Gluten, Lácteos..."
            />
          </div>

          <div className="grid grid-cols-2 gap-y-4 pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={editDish.es_por_unidad}
                onChange={(e) =>
                  setEditDish({ ...editDish, es_por_unidad: e.target.checked })
                }
                className="w-4 h-4 accent-primary"
              />
              <span className="text-[11px] uppercase tracking-[1px] text-text-muted group-hover:text-primary transition-colors">
                P/ Unidad
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={editDish.disponible}
                onChange={(e) =>
                  setEditDish({ ...editDish, disponible: e.target.checked })
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
    <div
      className={`group bg-bg-surface/90 border border-text-main/10 p-7 flex flex-col justify-between transition-all duration-500 relative overflow-hidden h-full hover:border-primary/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] ${!item.disponible ? "opacity-80" : ""}`}
    >
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-2">
            <span className="text-primary text-[10px] uppercase tracking-[4px] font-bold opacity-60 group-hover:opacity-100 transition-opacity">
              {item.categoria?.nombre}
            </span>
            {!item.disponible && (
              <div className="bg-primary/10 text-primary text-[7px] px-2 py-0.5 uppercase tracking-widest font-bold border border-primary/20 w-fit">
                Solo en Menús
              </div>
            )}
          </div>
          <div className="flex gap-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform translate-y-0 md:translate-y-2 md:group-hover:translate-y-0">
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

        <h4 className="text-text-main font-heading text-2xl mb-3 leading-tight group-hover:text-primary transition-colors">
          {item.nombre}
        </h4>
      </div>

      <div className="pt-6 border-t border-text-main/5 flex justify-between items-end">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-text-main font-heading text-2xl">
              {Number.isFinite(price) ? price.toFixed(2) : "0.00"}€
            </span>
            {!!item.es_por_unidad && (
              <span className="text-text-muted text-[10px] uppercase tracking-widest ml-1">
                / UD.
              </span>
            )}
          </div>
          {!!item.maximo_por_pedido && (
            <p className="text-[9px] text-primary/60 uppercase tracking-[2px] mt-1 font-bold">
              Máx. {item.maximo_por_pedido} p/ pedido
            </p>
          )}
        </div>
        {item.alergenos && (
          <div className="flex flex-wrap gap-1 justify-end max-w-[120px]">
            {item.alergenos.split(",").map((a) => (
              <span
                key={a}
                className="text-[8px] bg-text-main/5 text-text-muted px-2 py-0.5 uppercase tracking-tighter rounded-sm"
              >
                {a.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para editar los platos directamente desde el panel
export default DishEditRow;
