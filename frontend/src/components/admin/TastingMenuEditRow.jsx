import { useState } from "react";
import axios from "@/services/api";
import { HiTrash } from "react-icons/hi";
import {
  adminEditInputClass,
  showAdminErrorToast,
  showAdminToast,
} from "@/utils/adminFeedback";

// Componente para la edición detallada de la secuencia y precio de menús degustación
const TastingMenuEditRow = ({
  item,
  fetchData,
  handleDelete,
  allAvailableDishes,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState({ ...item, platos: item.platos || [] });

  const handleUpdate = async () => {
    try {
      await axios.put(`/admin/tasting-menus/${item.id}`, edit);
      showAdminToast("Menú actualizado");
      setIsEditing(false);
      fetchData();
    } catch (err) {
      showAdminErrorToast(err, "No se pudo actualizar el menú.");
    }
  };

  const addDishToMenu = (dishId) => {
    if (!dishId) return;
    const plato = allAvailableDishes.find((d) => d.id === parseInt(dishId));
    if (!plato) return;

    setEdit({
      ...edit,
      platos: [
        ...edit.platos,
        // Añade un nuevo plato a la secuencia del menú con sus valores por defecto
        { ...plato, pivot: { numero_paso: edit.platos.length + 1, notas: "" } },
      ],
    });
  };

  const removeDishFromMenu = (index) => {
    const newPlatos = [...edit.platos];
    newPlatos.splice(index, 1);
    setEdit({
      ...edit,
      platos: newPlatos,
    });
  };

  if (isEditing) {
    return (
      <div className="lg:col-span-2 bg-bg-surface border border-primary/30 p-10 flex flex-col gap-10 shadow-[0_40px_80px_rgba(0,0,0,0.4)] relative z-20">
        <div className="flex justify-between items-start">
          <h4 className="text-primary font-heading text-xl uppercase tracking-widest">
            Configurando Menú Degustación
          </h4>
          <span className="text-[10px] text-text-muted font-bold tracking-[3px]">
            ID #{item.id}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="group/field relative">
              <label className="text-primary text-[11px] uppercase tracking-[3px] block mb-2 font-bold transition-all group-focus-within/field:text-primary">
                Título del Menú
              </label>
              <input
                type="text"
                value={edit.nombre}
                onChange={(e) => setEdit({ ...edit, nombre: e.target.value })}
                className={`${adminEditInputClass} text-2xl font-heading`}
                placeholder="Nombre del menú..."
              />
            </div>
            <div className="group/field relative">
              <label className="text-primary text-[11px] uppercase tracking-[3px] block mb-2 font-bold transition-all group-focus-within/field:text-primary">
                Relato / Descripción
              </label>
              <textarea
                rows="4"
                value={edit.descripcion}
                onChange={(e) =>
                  setEdit({ ...edit, descripcion: e.target.value })
                }
                className={`${adminEditInputClass} resize-none p-4 text-base italic leading-relaxed`}
                placeholder="Describa la experiencia gastronómica..."
              />
            </div>
          </div>

          <div className="space-y-10 bg-black/5 p-6 rounded-sm border border-text-main/5">
            <div className="space-y-8">
              <div className="group/field">
                <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-2 font-bold opacity-60">
                  Precio Persona (€)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={edit.precio}
                    onChange={(e) =>
                      setEdit({ ...edit, precio: e.target.value })
                    }
                    className={`${adminEditInputClass} pr-8 text-2xl font-heading`}
                  />
                  <span className="absolute right-0 bottom-2 text-text-muted opacity-30 font-heading text-xl">
                    €
                  </span>
                </div>
              </div>
              <div className="group/field">
                <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-2 font-bold opacity-60">
                  Número de Pasos
                </label>
                <input
                  type="number"
                  value={edit.pasos}
                  onChange={(e) => setEdit({ ...edit, pasos: e.target.value })}
                  className={`${adminEditInputClass} text-xl`}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-text-main/5 space-y-8">
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="mt-0.5">
                  <div
                    className={`w-5 h-5 border-2 flex items-center justify-center transition-all ${edit._hasMaridaje || !!edit.precio_maridaje ? "bg-primary border-primary" : "bg-transparent border-text-main/20"}`}
                  >
                    {(edit._hasMaridaje || !!edit.precio_maridaje) && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={edit._hasMaridaje || !!edit.precio_maridaje}
                      onChange={(e) => {
                        const hasM = e.target.checked;
                        // Activa o desactiva el maridaje y gestiona su precio
                        setEdit({
                          ...edit,
                          _hasMaridaje: hasM,
                          precio_maridaje: hasM
                            ? edit.precio_maridaje || 0
                            : null,
                        });
                      }}
                    />
                  </div>
                </div>
                <span
                  className={`text-[11px] uppercase tracking-[2px] font-bold leading-tight transition-colors ${edit._hasMaridaje || !!edit.precio_maridaje ? "text-primary" : "text-text-muted group-hover:text-text-main"}`}
                >
                  Maridaje opcional
                </span>
              </label>

              <div className="space-y-6">
                <div>
                  <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-2 font-bold opacity-60">
                    Duración (min)
                  </label>
                  <input
                    type="number"
                    value={edit.duracion_estimada_minutos || 60}
                    onChange={(e) =>
                      setEdit({
                        ...edit,
                        duracion_estimada_minutos: e.target.value,
                      })
                    }
                    className={`${adminEditInputClass} text-base font-bold`}
                  />
                </div>
                {!!(edit._hasMaridaje || edit.precio_maridaje) && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-primary text-[9px] uppercase tracking-[2px] block mb-2 font-bold opacity-80">
                      Precio Maridaje (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={edit.precio_maridaje || ""}
                      onChange={(e) =>
                        setEdit({ ...edit, precio_maridaje: e.target.value })
                      }
                      className={`${adminEditInputClass} text-xl font-heading font-bold text-primary`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-text-main/10 pt-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <span className="w-1 h-6 bg-primary"></span>
              <h5 className="text-text-main text-[12px] uppercase tracking-[4px] font-bold">
                Secuencia de Pases
              </h5>
            </div>

            <div className="relative w-full sm:max-w-md">
              <select
                value=""
                onChange={(e) => {
                  addDishToMenu(e.target.value);
                  e.target.value = "";
                }}
                className="w-full bg-primary/5 hover:bg-primary/10 border-2 border-primary/20 text-primary text-[10px] p-3 px-5 outline-none focus:border-primary transition-all appearance-none cursor-pointer uppercase tracking-[3px] font-bold"
              >
                <option value="" className="bg-bg-surface text-text-muted">
                  + Añadir pase al menú
                </option>
                {allAvailableDishes.map((d) => (
                  <option
                    key={d.id}
                    value={d.id}
                    className="bg-bg-surface text-text-main font-sans"
                  >
                    {d.nombre} — {d.categoria?.nombre}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/50">
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L5 5L9 1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {edit.platos.length === 0 && (
              <p className="text-center py-8 text-text-muted italic text-sm opacity-50 border-2 border-dashed border-text-main/5">
                No hay platos asignados a este menú todavía.
              </p>
            )}
            {edit.platos.map((plato, idx) => (
              <div
                key={`${plato.id}-${idx}`}
                className="bg-bg-surface/60 backdrop-blur-sm p-5 group/item hover:bg-bg-surface transition-all border border-text-main/5 hover:border-primary/30 shadow-sm hover:shadow-md relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/10 group-hover/item:bg-primary transition-colors"></div>

                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-4">
                    <span className="text-primary font-heading text-2xl opacity-20 w-8 tabular-nums">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <div className="w-[2px] h-8 bg-text-main/5"></div>
                  </div>

                  <div className="flex-grow min-w-[200px]">
                    <p className="text-text-main text-[11px] uppercase tracking-[2px] font-bold mb-1 opacity-50">
                      {plato.categoria?.nombre}
                    </p>
                    <p className="text-text-main text-base font-heading tracking-wide uppercase">
                      {plato.nombre}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-8 ml-auto">
                    <div className="w-16">
                      <label className="text-[7px] uppercase text-text-muted block mb-1 tracking-[2px] font-bold opacity-60">
                        Pase №
                      </label>
                      <input
                        type="number"
                        value={plato.pivot?.numero_paso || idx + 1}
                        onChange={(e) => {
                          const newPlatos = [...edit.platos];
                          newPlatos[idx] = {
                            ...plato,
                            pivot: {
                              ...plato.pivot,
                              numero_paso: e.target.value,
                            },
                          };
                          // Sincroniza el orden del plato en el estado local
                          setEdit({ ...edit, platos: newPlatos });
                        }}
                        className="bg-transparent border-b-2 border-text-main/10 text-text-main text-sm w-full outline-none focus:border-primary pb-1 font-bold transition-colors text-center"
                      />
                    </div>
                    <div className="min-w-[240px]">
                      <label className="text-[7px] uppercase text-text-muted block mb-1 tracking-[2px] font-bold opacity-60">
                        Anotación del Chef
                      </label>
                      <input
                        type="text"
                        placeholder="Nota especial..."
                        value={plato.pivot?.notas || ""}
                        onChange={(e) => {
                          const newPlatos = [...edit.platos];
                          newPlatos[idx] = {
                            ...plato,
                            pivot: { ...plato.pivot, notas: e.target.value },
                          };
                          setEdit({ ...edit, platos: newPlatos });
                        }}
                        className="bg-transparent border-b-2 border-text-main/10 text-text-main text-xs w-full outline-none focus:border-primary pb-1 italic transition-colors"
                      />
                    </div>
                    <button
                      onClick={() => removeDishFromMenu(idx)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500/5 text-red-500/40 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <HiTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-8 mt-4 pt-6 border-t border-text-main/10">
          <button
            onClick={() => setIsEditing(false)}
            className="text-text-muted hover:text-text-main text-[11px] uppercase tracking-[3px] font-bold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpdate}
            className="bg-primary px-12 py-4 font-bold text-[11px] uppercase tracking-[4px] text-white transition-all shadow-[0_15px_30px_rgba(197,160,89,0.2)] hover:bg-primary-hover"
          >
            Guardar Configuración
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-bg-surface border border-text-main/5 p-10 flex flex-col lg:flex-row gap-10 transition-all duration-700 relative overflow-hidden h-full hover:border-primary/30 hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)]">
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-primary/10 transition-all duration-1000"></div>

      <div className="flex-grow flex flex-col justify-between lg:w-2/3">
        <div>
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-[4px] font-bold px-4 py-1.5 rounded-full">
                {item.pasos} Pasos
              </span>
              <span className="w-1 h-1 bg-text-main/20 rounded-full"></span>
              <span className="text-text-muted text-[10px] uppercase tracking-[4px] font-medium opacity-60">
                Gastronomía
              </span>
            </div>
          </div>

          <h4 className="text-text-main font-heading text-5xl mb-8 leading-tight group-hover:text-primary transition-colors duration-700">
            {item.nombre}
          </h4>

          <div className="relative mb-10">
            <p className="text-text-muted text-lg font-normal italic leading-relaxed border-l-4 border-primary/20 pl-8 opacity-80 line-clamp-3">
              "{item.descripcion}"
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mb-10 min-h-[44px]">
            {item.platos?.slice(0, 6).map((d) => (
              <span
                key={d.id}
                className="text-[11px] bg-bg-body text-text-main/60 px-4 py-2 uppercase tracking-[2px] border border-text-main/5 font-medium hover:border-primary/30 hover:text-primary transition-all cursor-default"
              >
                {d.nombre}
              </span>
            ))}
            {item.platos?.length > 6 && (
              <span className="text-[11px] text-primary bg-primary/5 px-4 py-2 uppercase tracking-[2px] font-bold border border-primary/10">
                + {item.platos.length - 6} más
              </span>
            )}
          </div>
        </div>

        <div className="pt-10 border-t border-text-main/5 flex justify-between items-end">
          <div className="flex gap-12">
            <div className="flex flex-col">
              <span className="text-text-muted text-[10px] uppercase tracking-[3px] mb-3 font-bold opacity-30">
                Menú Completo
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-text-main font-heading text-5xl leading-none">
                  {parseFloat(item.precio).toFixed(0)}
                </span>
                <span className="text-text-main font-heading text-2xl opacity-40">
                  €
                </span>
              </div>
            </div>
            {!!item.precio_maridaje && (
              <div className="flex flex-col relative pl-12">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-10 bg-text-main/10"></div>
                <span className="text-primary text-[10px] uppercase tracking-[3px] mb-3 font-bold">
                  Maridaje sugerido
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-primary font-heading text-3xl leading-none">
                    +{parseFloat(item.precio_maridaje).toFixed(0)}
                  </span>
                  <span className="text-primary font-heading text-lg opacity-40">
                    €
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:w-1/3 flex flex-col justify-between items-end border-l border-text-main/5 lg:pl-10 pt-8 lg:pt-0">
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

        <div className="text-right flex flex-col items-end w-full mt-auto pb-4">
          <span className="text-text-muted text-[11px] uppercase tracking-[5px] opacity-40 block mb-4 font-bold">
            Reserva Exclusiva
          </span>
          <div className="w-20 h-[3px] bg-primary/20 group-hover:w-full transition-all duration-1000 group-hover:bg-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default TastingMenuEditRow;
