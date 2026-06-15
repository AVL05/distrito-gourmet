import { useState } from "react";
import axios from "@/services/api";
import Swal from "sweetalert2";
import { USE_STATIC_DEMO_DATA } from "@/config/demo";
import {
  adminEditInputClass,
  showAdminErrorToast,
  showAdminToast,
} from "@/utils/adminFeedback";

// Fila editable para la gestión de usuarios y roles en el panel de administración
const UserEditRow = ({ user, fetchData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState({
    nombre: user.nombre,
    rol: user.rol,
    email: user.email,
    telefono: user.telefono || "",
    password: "",
  });

  // Actualiza los datos del usuario en la base de datos
  const handleUpdate = async () => {
    // Validación local de contraseña
    if (editUser.password && editUser.password.length < 8) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña demasiado corta",
        text: "La nueva contraseña debe tener al menos 8 caracteres para ser segura.",
        background: "#fdfaf6",
        color: "#2c302e",
        confirmButtonColor: "#e76f51",
      });
      return;
    }

    try {
      // Filtrar la contraseña si está vacía para evitar errores de validación (min:8)
      const dataToSend = { ...editUser };
      if (!dataToSend.password) {
        delete dataToSend.password;
      }

      await axios.put(`/admin/users/${user.id}`, dataToSend);
      showAdminToast("Usuario actualizado");
      setIsEditing(false);
      fetchData();
    } catch (err) {
      showAdminErrorToast(err, "No se pudo actualizar el usuario.");
    }
  };

  const handleDelete = async () => {
    if (USE_STATIC_DEMO_DATA) {
      Swal.fire({
        icon: "info",
        title: "Eliminación desactivada",
        text: `En la demo no se puede eliminar a ${user.nombre}.`,
        background: "#fdfaf6",
        color: "#2c302e",
        confirmButtonColor: "#e76f51",
      });
      return;
    }

    const result = await Swal.fire({
      title: `Opciones de Eliminación`,
      text: `¿Seguro que quiere eliminar permanentemente a ${user.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Eliminar Usuario",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/admin/users/${user.id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-bg-surface border border-primary/30 p-6 flex flex-col gap-6 shadow-[0_30px_60px_rgba(0,0,0,0.2)] relative h-full rounded-sm">
        <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 scrollbar-thin">
          <div className="text-left">
            <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-1 font-bold">
              Nombre Completo
            </label>
            <input
              type="text"
              value={editUser.nombre}
              onChange={(e) =>
                setEditUser({ ...editUser, nombre: e.target.value })
              }
              className={`${adminEditInputClass} font-heading`}
            />
          </div>

          <div className="text-left">
            <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-1 font-bold">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
              className={adminEditInputClass}
            />
          </div>

          <div className="text-left">
            <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-1 font-bold">
              Teléfono
            </label>
            <input
              type="text"
              value={editUser.telefono}
              onChange={(e) =>
                setEditUser({ ...editUser, telefono: e.target.value })
              }
              className={adminEditInputClass}
            />
          </div>

          <div className="text-left">
            <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-1 font-bold">
              Rol
            </label>
            <select
              value={editUser.rol}
              onChange={(e) =>
                setEditUser({ ...editUser, rol: e.target.value })
              }
              className={`${adminEditInputClass} appearance-none cursor-pointer`}
            >
              <option value="Cliente">Cliente</option>
              <option value="Staff">Staff</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>

          <div className="text-left">
            <label className="text-text-muted text-[11px] uppercase tracking-[2px] block mb-1 font-bold">
              Contraseña (Opcional)
            </label>
            <input
              type="password"
              placeholder="Nueva contraseña..."
              value={editUser.password}
              onChange={(e) =>
                setEditUser({ ...editUser, password: e.target.value })
              }
              className={adminEditInputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-text-main/5 mt-auto">
          <button
            onClick={handleUpdate}
            className="w-full bg-primary hover:bg-primary-hover text-white py-3 font-bold text-[10px] uppercase tracking-[3px] transition-all shadow-md"
          >
            Guardar Cambios
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="w-full text-text-muted hover:text-text-main text-[10px] uppercase tracking-[2px] font-bold transition-colors py-1"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-bg-surface/40 backdrop-blur-md border border-text-main/10 p-6 flex flex-col items-center text-center transition-all duration-700 relative overflow-hidden hover:border-primary/40 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] rounded-sm h-full">
      <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-1000"></div>

      <div className="relative mb-6">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center font-heading text-xl transition-all duration-500 ${
            user.rol === "Administrador"
              ? "bg-primary text-black shadow-[0_8px_20px_rgba(166,138,86,0.3)] ring-4 ring-primary/5"
              : "bg-text-main/5 text-text-muted border border-text-main/10"
          }`}
        >
          {user.nombre.charAt(0)}
        </div>
        {/* Marca visual para diferenciar a los administradores del resto */}
        {user.rol === "Administrador" && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-bg-surface rounded-full flex items-center justify-center shadow-sm border border-primary/20">
            <span className="text-[8px]">✦</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 mb-6 w-full">
        <h4 className="text-text-main font-heading text-xl tracking-wide line-clamp-1">
          {user.nombre}
        </h4>

        <span
          className={`text-[8px] uppercase tracking-[2px] px-3 py-1 rounded-full font-bold border mb-2 ${
            user.rol === "Administrador"
              ? "bg-primary/10 text-primary border-primary/20"
              : "bg-text-main/5 text-text-muted border-text-main/10"
          }`}
        >
          {user.rol}
        </span>

        <div className="space-y-1 w-full px-2">
          <p className="text-text-muted/80 text-[11px] font-medium tracking-tight truncate">
            {user.email}
          </p>
          {user.telefono && (
            <p className="text-text-muted/60 text-[11px] font-medium tracking-tight">
              {user.telefono}
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-text-main/5 w-full flex items-center justify-center gap-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0">
        <button
          onClick={() => setIsEditing(true)}
          className="text-text-main hover:text-primary text-[9px] uppercase tracking-[2px] font-bold transition-colors"
        >
          Editar
        </button>
        {/* Evita que el admin principal se elimine a sí mismo por accidente */}
        {user.id !== 1 && (
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-[9px] uppercase tracking-[2px] font-bold transition-colors"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default UserEditRow;
