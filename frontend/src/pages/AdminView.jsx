import { useAuthStore } from "@/store/auth";
import { useState, useEffect, useCallback } from "react";
import axios from "@/services/api";
import Swal from "sweetalert2";
import { AnimatePresence, useReducedMotion, FadeIn, motion } from "@/motion";
import { DURATION, EASING } from "@/motion";

// Componentes Administradores
import DishEditRow from "@/components/admin/DishEditRow";
import TastingMenuEditRow from "@/components/admin/TastingMenuEditRow";
import WineEditRow from "@/components/admin/WineEditRow";
import BeverageEditRow from "@/components/admin/BeverageEditRow";
import UserEditRow from "@/components/admin/UserEditRow";
import ReservationCard from "@/components/admin/ReservationCard";
import OrderCard from "@/components/admin/OrderCard";

// Panel de Control de Distrito Gourmet
// Gestión centralizada del restaurante: pedidos, reservas, carta y usuarios
const AdminView = () => {
  const { logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState("orders");
  const [loading, setLoading] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const [data, setData] = useState({
    orders: [],
    menu: [],
    reservations: [],
    users: [],
    categories: [],
    wines: [],
    beverages: [],
    tasting_menus: [],
  });

  // Configuración de las secciones disponibles en la barra lateral
  const sections = [
    { id: "orders", label: "Pedidos" },
    { id: "reservations", label: "Reservas" },
    { id: "menu", label: "Platos" },
    { id: "tasting_menus", label: "Menús" },
    { id: "wines", label: "Bodega" },
    { id: "beverages", label: "Bebidas" },
    { id: "users", label: "Usuarios" },
  ];

  // Variante para el contenido de las secciones
  const sectionContentVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.normal, ease: EASING.decelerate },
    },
    exit: {
      opacity: 0,
      y: -8,
      transition: { duration: DURATION.fast, ease: EASING.accelerate },
    },
  };

  // Estados de formularios para añadir nuevos elementos
  const [newDish, setNewDish] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria_menu_id: "",
    alergenos: "",
    disponible: true,
    visible_en_carta: true,
    visible_en_degustacion: true,
    disponible_para_llevar: true,
    es_por_unidad: false,
    maximo_por_pedido: "",
  });
  const [newWine, setNewWine] = useState({
    nombre: "",
    region: "",
    tipo: "Tinto",
    precio_botella: "",
    precio_copa: "",
    disponible: true,
  });
  const [newBeverage, setNewBeverage] = useState({
    nombre: "",
    tipo: "agua",
    precio: "",
    descripcion: "",
    disponible: true,
    destacado: false,
  });
  const [newTastingMenu, setNewTastingMenu] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    precio_maridaje: "",
    pasos: 1,
    duracion_estimada_minutos: 60,
    disponible: true,
  });

  // Funciones genéricas para el CRUD

  // Crea un nuevo registro y refresca la lista automáticamente
  const handleAddItem = async (endpoint, itemData, resetState, successMsg) => {
    try {
      await axios.post(`/admin/${endpoint}`, itemData);
      resetState();
      fetchData();
      Swal.fire({
        icon: "success",
        title: successMsg,
        background: "#fdfaf6",
        color: "#2c302e",
        confirmButtonColor: "#e76f51",
        timer: 1500,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || `Error al añadir el elemento`,
        background: "#fdfaf6",
        color: "#2c302e",
      });
    }
  };

  // Handlers genéricos para eliminar elementos
  const handleDeleteItem = async (endpoint, id, itemName = "elemento") => {
    const result = await Swal.fire({
      title: "¿Confirmar eliminación?",
      text: `Esta acción no se puede deshacer para: ${itemName}`,
      icon: "warning",
      showCancelButton: true,
      background: "#fdfaf6",
      color: "#2c302e",
      confirmButtonColor: "#e76f51",
      cancelButtonColor: "#888",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/admin/${endpoint}/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el elemento.",
        background: "#fdfaf6",
        color: "#2c302e",
      });
    }
  };

  // Trae los datos de la API según la sección donde estemos
  // Sincroniza la información cada vez que cambio de pestaña en el panel
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeSection === "orders") {
        const res = await axios.get("/admin/orders");
        setData((d) => ({ ...d, orders: res.data }));
      } else if (activeSection === "reservations") {
        const res = await axios.get("/admin/reservations");
        setData((d) => ({ ...d, reservations: res.data }));
      } else if (activeSection === "menu") {
        const res = await axios.get("/dishes");
        const sortedDishes = (res.data.platos || []).sort((a, b) => {
          const order = { entrantes: 1, principales: 2, postres: 3 };
          const orderA = order[a.categoria?.nombre.toLowerCase()] || 99;
          const orderB = order[b.categoria?.nombre.toLowerCase()] || 99;
          return orderA - orderB;
        });
        setData((d) => ({
          ...d,
          menu: sortedDishes,
          categories: res.data.categorias || [],
        }));
        if (res.data.categorias?.length > 0 && !newDish.categoria_menu_id) {
          setNewDish((prev) => ({
            ...prev,
            categoria_menu_id: res.data.categorias[0].id,
          }));
        }
      } else if (activeSection === "wines") {
        const res = await axios.get("/admin/wines");
        setData((d) => ({ ...d, wines: res.data }));
      } else if (activeSection === "beverages") {
        const res = await axios.get("/admin/beverages");
        setData((d) => ({ ...d, beverages: res.data }));
      } else if (activeSection === "tasting_menus") {
        const [menusRes, dishesRes] = await Promise.all([
          axios.get("/admin/tasting-menus"),
          axios.get("/dishes"),
        ]);
        const sortedDishes = (dishesRes.data.platos || []).sort((a, b) => {
          const order = { entrantes: 1, principales: 2, postres: 3 };
          const orderA = order[a.categoria?.nombre.toLowerCase()] || 99;
          const orderB = order[b.categoria?.nombre.toLowerCase()] || 99;
          return orderA - orderB;
        });
        setData((d) => ({
          ...d,
          tasting_menus: menusRes.data,
          menu: sortedDishes,
        }));
      } else if (activeSection === "users") {
        const res = await axios.get("/admin/users");
        setData((d) => ({ ...d, users: res.data }));
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error de carga",
        text: "No se pudieron recuperar los datos del servidor.",
        background: "#fdfaf6",
        color: "#2c302e",
      });
    } finally {
      setLoading(false);
    }
  }, [activeSection, newDish.categoria_menu_id]);

  // Recargar datos cuando cambia la sección activa
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Cambiar estado de un pedido
  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await axios.patch(`/admin/orders/${id}`, { estado: status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Actualizar datos de una reserva (estado, mesa, etc.)
  const handleUpdateReservation = async (id, updateData) => {
    try {
      await axios.patch(`/admin/reservations/${id}`, updateData);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Renderizar contenido según la sección activa
  const renderContent = () => {
    if (loading)
      return (
        <div className="text-text-muted animate-pulse">
          Cargando datos del servidor...
        </div>
      );

    if (activeSection === "orders") {
      const pendingOrders = data.orders.filter((o) => o.estado === "Pendiente");
      const preparingOrders = data.orders.filter(
        (o) => o.estado === "Preparando",
      );
      const readyOrders = data.orders.filter((o) => o.estado === "Listo");
      const deliveredOrders = data.orders.filter(
        (o) => o.estado === "Entregado",
      );
      const cancelledOrders = data.orders.filter(
        (o) => o.estado === "Cancelado",
      );

      // Renderiza una tarjeta de pedido individual
      const renderOrderCard = (order) => (
        <OrderCard
          key={order.id}
          order={order}
          handleUpdateOrderStatus={handleUpdateOrderStatus}
          handleDeleteItem={handleDeleteItem}
        />
      );

      // Renderiza una subsección de pedidos con separador visual y contador
      const renderSection = (
        title,
        orders,
        accent = "primary",
        countLabel = "PEDIDOS",
      ) => {
        if (orders.length === 0) return null;

        const colorMap = {
          primary: "#C5A059",
          "amber-500": "#f59e0b",
          "green-500": "#22c55e",
          "slate-500": "#64748b",
          "red-800": "#ef4444",
        };

        const accentColor = colorMap[accent] || colorMap["primary"];

        return (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h3
                className="font-heading text-2xl tracking-[0.1em] uppercase"
                style={{ color: accentColor }}
              >
                {title}
              </h3>
              <div
                className="h-[1.5px] flex-grow opacity-30"
                style={{
                  background: `linear-gradient(to right, ${accentColor}, ${accentColor}66, transparent)`,
                }}
              ></div>
              <span
                className="px-3 py-1 text-xs rounded-full font-bold"
                style={{
                  backgroundColor: `${accentColor}1a`,
                  color: accentColor,
                }}
              >
                {orders.length} {countLabel}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {orders.map(renderOrderCard)}
            </div>
          </section>
        );
      };

      return (
        <div className="space-y-20">
          {renderSection(
            "Nuevas Solicitudes",
            pendingOrders,
            "primary",
            "PENDIENTES",
          )}
          {renderSection(
            "En Cocina",
            preparingOrders,
            "amber-500",
            "PREPARANDO",
          )}
          {renderSection(
            "Listo para Entrega",
            readyOrders,
            "green-500",
            "LISTO",
          )}
          {renderSection(
            "Entregados recientemente",
            deliveredOrders,
            "slate-500",
            "HISTORIAL",
          )}
          {renderSection(
            "Pedidos Cancelados",
            cancelledOrders,
            "red-800",
            "CANCELADOS",
          )}

          {data.orders.length === 0 && (
            <p className="text-text-muted">
              No hay pedidos registrados en el sistema.
            </p>
          )}
        </div>
      );
    }

    if (activeSection === "reservations") {
      const pending = data.reservations.filter((r) => r.estado === "Pendiente");
      const confirmed = data.reservations.filter(
        (r) => r.estado === "Confirmada",
      );
      const cancelled = data.reservations.filter(
        (r) => r.estado === "Cancelada",
      );

      const renderCard = (res) => (
        <ReservationCard
          key={res.id}
          res={res}
          handleUpdateReservation={handleUpdateReservation}
          handleDeleteItem={handleDeleteItem}
        />
      );

      return (
        <div className="space-y-16">
          {pending.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-primary font-heading text-2xl tracking-[0.1em] uppercase">
                  Nuevas Reservas
                </h3>
                <div
                  className="h-[1.5px] flex-grow opacity-60"
                  style={{
                    background:
                      "linear-gradient(to right, #C5A059, #C5A05966, transparent)",
                  }}
                ></div>
                <span className="bg-primary/10 text-primary px-3 py-1 text-xs rounded-full font-bold">
                  {pending.length} PENDIENTES
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {pending.map(renderCard)}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-[#22c55e] font-heading text-2xl tracking-[0.1em] uppercase">
                Reservas Confirmadas
              </h3>
              <div
                className="h-[1.5px] flex-grow opacity-60"
                style={{
                  background:
                    "linear-gradient(to right, #22c55e, #22c55e66, transparent)",
                }}
              ></div>
              <span className="bg-[#22c55e]/10 text-[#22c55e] px-3 py-1 text-xs rounded-full font-bold">
                {confirmed.length} CONFIRMADAS
              </span>
            </div>
            {confirmed.length === 0 ? (
              <p className="text-text-muted">
                No hay servicios confirmados para mostrar.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {confirmed.map(renderCard)}
              </div>
            )}
          </section>

          {cancelled.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-[#ef4444] font-heading text-2xl tracking-[0.1em] uppercase">
                  Reservas Canceladas
                </h3>
                <div
                  className="h-[1.5px] flex-grow opacity-60"
                  style={{
                    background:
                      "linear-gradient(to right, #ef4444, #ef444466, transparent)",
                  }}
                ></div>
                <span className="bg-[#ef4444]/10 text-[#ef4444] px-3 py-1 text-xs rounded-full font-bold">
                  {cancelled.length} CANCELADOS
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {cancelled.map(renderCard)}
              </div>
            </section>
          )}
        </div>
      );
    }

    if (activeSection === "menu") {
      return (
        <div className="space-y-12">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddItem(
                "dishes",
                newDish,
                () =>
                  setNewDish({
                    nombre: "",
                    precio: "",
                    categoria_menu_id: data.categories[0]?.id || "",
                    alergenos: "",
                    disponible: true,
                    visible_en_carta: true,
                    visible_en_degustacion: true,
                    disponible_para_llevar: true,
                    es_por_unidad: false,
                    maximo_por_pedido: "",
                  }),
                "Plato añadido",
              );
            }}
            className="bg-bg-surface/90 border border-text-main/10 p-8 grid grid-cols-1 md:grid-cols-4 gap-8 items-end shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="col-span-full">
              <div className="flex items-center gap-4">
                <h3 className="font-heading text-primary text-2xl tracking-[0.1em] uppercase">
                  Añadir nuevo plato
                </h3>
                <div
                  className="h-[1.5px] flex-grow opacity-60"
                  style={{
                    background:
                      "linear-gradient(to right, #C5A059, #C5A05966, transparent)",
                  }}
                ></div>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Nombre del Plato
              </label>
              <input
                required
                type="text"
                placeholder="Ej: Ostras al Carbón..."
                value={newDish.nombre}
                onChange={(e) =>
                  setNewDish({ ...newDish, nombre: e.target.value })
                }
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Categoría
              </label>
              <select
                required
                value={newDish.categoria_menu_id}
                onChange={(e) =>
                  setNewDish({ ...newDish, categoria_menu_id: e.target.value })
                }
                className="w-full bg-bg-surface border-b border-text-main/10 text-text-main p-1.5 pr-8 focus:border-primary outline-none text-sm cursor-pointer appearance-none"
              >
                <option value="" disabled>
                  Seleccionar...
                </option>
                {data.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-full">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Composición del Plato (Descripción)
              </label>
              <textarea
                placeholder="Describa los ingredientes y la esencia del plato..."
                value={newDish.descripcion}
                onChange={(e) =>
                  setNewDish({ ...newDish, descripcion: e.target.value })
                }
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors min-h-[80px] resize-none"
              />
            </div>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Precio (€)
              </label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newDish.precio}
                onChange={(e) =>
                  setNewDish({ ...newDish, precio: e.target.value })
                }
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-1">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Alérgenos
              </label>
              <input
                type="text"
                placeholder="Gluten, Lácteos..."
                value={newDish.alergenos}
                onChange={(e) =>
                  setNewDish({ ...newDish, alergenos: e.target.value })
                }
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-1">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Máx. por Pedido
              </label>
              <input
                type="number"
                placeholder="Sin límite"
                value={newDish.maximo_por_pedido}
                onChange={(e) =>
                  setNewDish({ ...newDish, maximo_por_pedido: e.target.value })
                }
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div className="col-span-full flex flex-wrap gap-x-10 gap-y-6 pt-6 pb-2 border-t border-text-main/5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={newDish.es_por_unidad}
                  onChange={(e) =>
                    setNewDish({ ...newDish, es_por_unidad: e.target.checked })
                  }
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[11px] uppercase tracking-[1px] text-text-main/70 group-hover:text-primary transition-colors whitespace-nowrap">
                  P/ Unidad
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={newDish.disponible_para_llevar}
                  onChange={(e) =>
                    setNewDish({
                      ...newDish,
                      disponible_para_llevar: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[11px] uppercase tracking-[1px] text-text-main/70 group-hover:text-primary transition-colors whitespace-nowrap">
                  Takeaway
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={newDish.disponible}
                  onChange={(e) =>
                    setNewDish({ ...newDish, disponible: e.target.checked })
                  }
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[11px] uppercase tracking-[1px] text-text-main/70 group-hover:text-primary transition-colors whitespace-nowrap">
                  Disponible
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={newDish.visible_en_carta}
                  onChange={(e) =>
                    setNewDish({
                      ...newDish,
                      visible_en_carta: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[11px] uppercase tracking-[1px] text-text-main/70 group-hover:text-primary transition-colors whitespace-nowrap">
                  Ver en Carta
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={newDish.visible_en_degustacion}
                  onChange={(e) =>
                    setNewDish({
                      ...newDish,
                      visible_en_degustacion: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[11px] uppercase tracking-[1px] text-text-main/70 group-hover:text-primary transition-colors whitespace-nowrap">
                  Ver en Degustación
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-bg-surface text-black font-bold uppercase tracking-[3px] text-[10px] transition-all p-3.5 w-full shadow-[0_10px_20px_rgba(197,160,89,0.2)] hover:shadow-[0_15px_30px_rgba(197,160,89,0.4)] col-span-full"
            >
              Confirmar
            </button>
          </form>
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h3
                className="font-heading text-xl tracking-[0.1em] uppercase"
                style={{ color: "#64748b" }}
              >
                Listado de la Carta
              </h3>
              <div
                className="h-[1.5px] flex-grow opacity-30"
                style={{
                  background:
                    "linear-gradient(to right, #64748b, #64748b66, transparent)",
                }}
              ></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {data.menu.map((item) => (
                <DishEditRow
                  key={item.id}
                  item={item}
                  fetchData={fetchData}
                  handleDelete={() =>
                    handleDeleteItem("dishes", item.id, item.nombre)
                  }
                  categories={data.categories}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeSection === "tasting_menus") {
      return (
        <div className="space-y-16">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddItem(
                "tasting-menus",
                newTastingMenu,
                () =>
                  setNewTastingMenu({
                    nombre: "",
                    descripcion: "",
                    precio: "",
                    pasos: "",
                    disponible: true,
                  }),
                "Menú añadido",
              );
            }}
            className="bg-bg-surface/90 border border-text-main/10 p-8 grid grid-cols-1 md:grid-cols-4 gap-8 items-end shadow-2xl relative overflow-hidden mb-12"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="col-span-full">
              <div className="flex items-center gap-4">
                <h3 className="font-heading text-primary text-2xl tracking-[0.1em] uppercase">
                  Añadir nuevo menú
                </h3>
                <div
                  className="h-[1.5px] flex-grow opacity-60"
                  style={{
                    background:
                      "linear-gradient(to right, #C5A059, #C5A05966, transparent)",
                  }}
                ></div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Nombre del Menú
              </label>
              <input
                required
                type="text"
                placeholder="Ej: Experiencia Gourmet..."
                value={newTastingMenu.nombre}
                onChange={(e) =>
                  setNewTastingMenu({
                    ...newTastingMenu,
                    nombre: e.target.value,
                  })
                }
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Precio (€)
              </label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newTastingMenu.precio}
                onChange={(e) =>
                  setNewTastingMenu({
                    ...newTastingMenu,
                    precio: e.target.value,
                  })
                }
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Número de Pasos
              </label>
              <input
                required
                type="number"
                placeholder="Ej: 7"
                value={newTastingMenu.pasos}
                onChange={(e) =>
                  setNewTastingMenu({
                    ...newTastingMenu,
                    pasos: e.target.value,
                  })
                }
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div className="col-span-full">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Descripción
              </label>
              <textarea
                required
                rows="2"
                placeholder="Describa la experiencia del menú..."
                value={newTastingMenu.descripcion}
                onChange={(e) =>
                  setNewTastingMenu({
                    ...newTastingMenu,
                    descripcion: e.target.value,
                  })
                }
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-bg-surface text-black font-bold uppercase tracking-[3px] text-[10px] transition-all p-3.5 w-full shadow-[0_10px_20px_rgba(197,160,89,0.2)] hover:shadow-[0_15px_30px_rgba(197,160,89,0.4)] col-span-full"
            >
              Confirmar
            </button>
          </form>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h3
                className="font-heading text-xl tracking-[0.1em] uppercase"
                style={{ color: "#64748b" }}
              >
                Menús Configurados
              </h3>
              <div
                className="h-[1.5px] flex-grow opacity-30"
                style={{
                  background:
                    "linear-gradient(to right, #64748b, #64748b66, transparent)",
                }}
              ></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {data.tasting_menus.map((item) => (
                <TastingMenuEditRow
                  key={item.id}
                  item={item}
                  fetchData={fetchData}
                  handleDelete={() =>
                    handleDeleteItem("tasting-menus", item.id, item.nombre)
                  }
                  allAvailableDishes={data.menu}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeSection === "wines") {
      return (
        <div className="space-y-16">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddItem(
                "wines",
                newWine,
                () =>
                  setNewWine({
                    nombre: "",
                    region: "",
                    tipo: "Tinto",
                    precio_botella: "",
                    precio_copa: "",
                    disponible: true,
                  }),
                "Vino añadido",
              );
            }}
            className="bg-bg-surface/90 border border-text-main/10 p-8 grid grid-cols-1 md:grid-cols-4 gap-8 items-end shadow-2xl relative overflow-hidden mb-12"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="col-span-full">
              <div className="flex items-center gap-4">
                <h3 className="font-heading text-primary text-2xl tracking-[0.1em] uppercase">
                  Añadir nuevo vino
                </h3>
                <div
                  className="h-[1.5px] flex-grow opacity-60"
                  style={{
                    background:
                      "linear-gradient(to right, #C5A059, #C5A05966, transparent)",
                  }}
                ></div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Nombre del Vino
              </label>
              <input
                required
                type="text"
                placeholder="Ej: Ribera del Duero Reserva..."
                value={newWine.nombre}
                onChange={(e) =>
                  setNewWine({ ...newWine, nombre: e.target.value })
                }
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Región / D.O.
              </label>
              <input
                required
                type="text"
                placeholder="Ej: Rioja"
                value={newWine.region}
                onChange={(e) =>
                  setNewWine({ ...newWine, region: e.target.value })
                }
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Tipo
              </label>
              <select
                value={newWine.tipo}
                onChange={(e) =>
                  setNewWine({ ...newWine, tipo: e.target.value })
                }
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              >
                <option value="Tinto">Tinto</option>
                <option value="Blanco">Blanco</option>
                <option value="Rosado">Rosado</option>
                <option value="Espumoso">Espumoso</option>
                <option value="Dulce">Dulce</option>
              </select>
            </div>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Precio Botella (€)
              </label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newWine.precio_botella}
                onChange={(e) =>
                  setNewWine({ ...newWine, precio_botella: e.target.value })
                }
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Precio Copa (€)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newWine.precio_copa}
                onChange={(e) =>
                  setNewWine({ ...newWine, precio_copa: e.target.value })
                }
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-bg-surface text-black font-bold uppercase tracking-[3px] text-[10px] transition-all p-3.5 w-full shadow-[0_10px_20px_rgba(197,160,89,0.2)] hover:shadow-[0_15px_30px_rgba(197,160,89,0.4)] col-span-full"
            >
              Confirmar
            </button>
          </form>
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h3
                className="font-heading text-xl tracking-[0.1em] uppercase"
                style={{ color: "#64748b" }}
              >
                Catálogo de Bodega
              </h3>
              <div
                className="h-[1.5px] flex-grow opacity-30"
                style={{
                  background:
                    "linear-gradient(to right, #64748b, #64748b66, transparent)",
                }}
              ></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {data.wines.map((item) => (
                <WineEditRow
                  key={item.id}
                  item={item}
                  fetchData={fetchData}
                  handleDelete={() =>
                    handleDeleteItem("wines", item.id, item.name)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeSection === "beverages") {
      return (
        <div className="space-y-16">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddItem(
                "beverages",
                newBeverage,
                () =>
                  setNewBeverage({
                    nombre: "",
                    descripcion: "",
                    tipo: "agua",
                    precio: "",
                    disponible: true,
                  }),
                "Bebida añadida",
              );
            }}
            className="bg-bg-surface/90 border border-text-main/10 p-8 grid grid-cols-1 md:grid-cols-4 gap-8 items-end shadow-2xl relative overflow-hidden mb-12"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="col-span-full">
              <div className="flex items-center gap-4">
                <h3 className="font-heading text-primary text-2xl tracking-[0.1em] uppercase">
                  Añadir nueva bebida
                </h3>
                <div
                  className="h-[1.5px] flex-grow opacity-60"
                  style={{
                    background:
                      "linear-gradient(to right, #C5A059, #C5A05966, transparent)",
                  }}
                ></div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Nombre de la Bebida
              </label>
              <input
                required
                type="text"
                placeholder="Ej: Agua Mineral..."
                value={newBeverage.nombre}
                onChange={(e) =>
                  setNewBeverage({ ...newBeverage, nombre: e.target.value })
                }
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Tipo
              </label>
              <select
                value={newBeverage.tipo}
                onChange={(e) =>
                  setNewBeverage({ ...newBeverage, tipo: e.target.value })
                }
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              >
                <option value="agua">Agua</option>
                <option value="refresco">Refresco</option>
                <option value="cocktail">Cocktail</option>
                <option value="cafe">Café</option>
              </select>
            </div>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Precio (€)
              </label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newBeverage.precio}
                onChange={(e) =>
                  setNewBeverage({ ...newBeverage, precio: e.target.value })
                }
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div className="col-span-full">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Descripción
              </label>
              <textarea
                required
                rows="2"
                placeholder="Describa la bebida o cocktail..."
                value={newBeverage.descripcion}
                onChange={(e) =>
                  setNewBeverage({
                    ...newBeverage,
                    descripcion: e.target.value,
                  })
                }
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-bg-surface text-black font-bold uppercase tracking-[3px] text-[10px] transition-all p-3.5 w-full shadow-[0_10px_20px_rgba(197,160,89,0.2)] hover:shadow-[0_15px_30px_rgba(197,160,89,0.4)] col-span-full"
            >
              Confirmar
            </button>
          </form>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h3
                className="font-heading text-xl tracking-[0.1em] uppercase"
                style={{ color: "#64748b" }}
              >
                Bebidas y Coctelería
              </h3>
              <div
                className="h-[1.5px] flex-grow opacity-30"
                style={{
                  background:
                    "linear-gradient(to right, #64748b, #64748b66, transparent)",
                }}
              ></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {data.beverages.map((item) => (
                <BeverageEditRow
                  key={item.id}
                  item={item}
                  fetchData={fetchData}
                  handleDelete={() =>
                    handleDeleteItem("beverages", item.id, item.name)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeSection === "users") {
      return (
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <h3
              className="font-heading text-xl tracking-[0.1em] uppercase"
              style={{ color: "#64748b" }}
            >
              Control de Acceso
            </h3>
            <div
              className="h-[1.5px] flex-grow opacity-30"
              style={{
                background:
                  "linear-gradient(to right, #64748b, #64748b66, transparent)",
              }}
            ></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {data.users?.length === 0 ? (
              <p className="text-text-muted">No hay usuarios registrados.</p>
            ) : (
              data.users?.map((u) => (
                <UserEditRow key={u.id} user={u} fetchData={fetchData} />
              ))
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex h-screen bg-bg-body overflow-hidden font-body text-text-main selection:bg-primary/30 pt-20 md:pt-0">
      {/* Luz ambiental decorativa */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

      {/* Barra lateral (solo en desktop) */}
      <aside className="w-64 bg-bg-surface/90 backdrop-blur-xl border-r border-text-main/10 hidden md:flex flex-col sticky top-0 h-screen z-20 shadow-[10px_0_30px_rgba(0,0,0,0.5)] flex-shrink-0">
        <div className="p-8 border-b border-text-main/10 flex flex-col items-center justify-center flex-shrink-0">
          <span className="text-primary text-2xl mb-2 opacity-80 block font-normal">
            ✦
          </span>
          <span className="text-text-main font-heading tracking-[0.2em] text-lg font-normal text-center">
            DG <span className="italic text-primary">MGMT</span>
          </span>
        </div>

        <nav className="flex-grow py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-6 py-3.5 text-[10px] uppercase tracking-[4px] transition-all duration-300 relative group overflow-hidden ${
                activeSection === section.id
                  ? "text-black bg-primary"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              <div
                className={`absolute inset-0 w-0 bg-white/10 transition-all duration-[400ms] ease-out group-hover:w-full z-0 ${activeSection === section.id ? "hidden" : ""}`}
              ></div>
              <span className="relative z-10">{section.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-text-main/10 flex-shrink-0">
          <button
            onClick={logout}
            className="w-full text-left px-6 py-4 text-[10px] uppercase tracking-[4px] text-red-500 hover:text-red-600 transition-colors group relative overflow-hidden font-bold"
          >
            <div className="absolute inset-0 w-0 bg-red-900/5 transition-all duration-[400ms] ease-out group-hover:w-full z-0"></div>
            <span className="relative z-10">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Área de Visualización Principal */}
      <main className="flex-grow flex flex-col h-screen relative z-10 overflow-hidden">
        {/* Cabecera Fija (Header + Navegación móvil) */}
        <div className="p-4 md:p-12 pb-2 md:pb-6 flex-shrink-0 border-b md:border-b-0 border-text-main/5">
          {/* Cabecera móvil */}
          <div className="flex md:hidden justify-between items-center mb-6 pb-2 border-b border-text-main/5">
            <span className="text-text-main font-heading tracking-[0.2em] text-sm">
              <span className="text-primary mr-1">✦</span> DG MGMT
            </span>
            <button
              onClick={logout}
              className="text-[9px] uppercase tracking-[3px] text-red-500 hover:text-red-600 font-bold"
            >
              Salir
            </button>
          </div>

          {/* Navegación móvil */}
          <div className="md:hidden flex gap-4 overflow-x-auto mb-6 pb-3 scrollbar-hide -mx-4 px-4 sticky top-0 bg-bg-body z-30">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`whitespace-nowrap uppercase tracking-[0.2em] text-[9px] py-2 px-3 rounded-full transition-all font-bold ${activeSection === s.id ? "bg-primary text-black" : "bg-text-main/5 text-text-muted hover:text-text-main"}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <FadeIn as="header">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="block text-primary text-[8px] sm:text-[9px] uppercase tracking-[4px] mb-2 font-body opacity-90">
                  Panel de Control Central
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-text-main uppercase tracking-widest mb-3 font-normal leading-none">
                  {sections.find((s) => s.id === activeSection)?.label}
                </h1>
                <div className="w-12 h-[2px] bg-gradient-to-r from-primary to-transparent"></div>
              </div>
              <p className="text-text-muted font-normal text-[10px] sm:text-[11px] tracking-wide max-w-xs md:text-right opacity-60">
                Gestión en tiempo real de los servicios vinculados a la base de
                datos.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Zona Scrollable de Contenido */}
        <div className="flex-grow overflow-y-auto px-2 sm:px-4 md:px-12 2k:px-24 4k:px-64 ultra:px-80 pb-12 pt-2 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              variants={shouldReduceMotion ? undefined : sectionContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminView;
