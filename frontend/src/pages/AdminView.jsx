import { useAuthStore } from "@/store/auth";
import { useMemo, useState } from "react";
import axios from "@/services/api";
import Swal from "sweetalert2";
import { AnimatePresence, motion, useReducedMotion } from "@/motion";
import { DURATION, EASING } from "@/motion";
import { USE_STATIC_DEMO_DATA } from "@/config/demo";
import { useAdminData } from "@/hooks/useAdminData";
import {
  HiBeaker,
  HiCalendar,
  HiCash,
  HiCheckCircle,
  HiClipboardList,
  HiCollection,
  HiLogout,
  HiOutlineClock,
  HiSparkles,
  HiUserGroup,
  HiViewGrid,
} from "react-icons/hi";

import BeverageEditRow from "@/components/admin/BeverageEditRow";
import DishEditRow from "@/components/admin/DishEditRow";
import TastingMenuEditRow from "@/components/admin/TastingMenuEditRow";
import UserEditRow from "@/components/admin/UserEditRow";
import WineEditRow from "@/components/admin/WineEditRow";

const inputClass =
  "w-full border border-text-main/10 bg-bg-surface px-3 py-2.5 text-sm text-text-main outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";
const labelClass =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-text-muted";
const adminFormClass =
  "border border-text-main/10 bg-bg-surface p-5 shadow-sm sm:p-6";
const adminFormHeaderClass = "mb-5 border-b border-text-main/10 pb-4";
const adminFormGridClass = "grid grid-cols-1 gap-4 lg:grid-cols-6";
const adminSubmitClass =
  "w-full bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary-hover sm:w-auto";
const adminSecondaryButtonClass =
  "whitespace-nowrap border border-text-main/10 bg-bg-surface px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-text-muted transition hover:border-primary/40 hover:text-text-main";
const adminActiveButtonClass =
  "whitespace-nowrap border border-text-main bg-text-main px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-bg-body";

const money = (value) => {
  const parsed = Number.parseFloat(value || 0);
  return Number.isFinite(parsed) ? `${parsed.toFixed(2)}€` : "0.00€";
};

const time = (value) => (value ? value.slice(0, 5) : "Sin hora");

const dateShort = (value) => {
  if (!value) return "Sin fecha";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Sin fecha";
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
  });
};

const todayIso = () => new Date().toISOString().slice(0, 10);

const matchesText = (value, query) =>
  String(value || "")
    .toLowerCase()
    .includes(query.trim().toLowerCase());

const orderItemsText = (order) =>
  order.detalles
    ?.map((item) => {
      const name =
        item.plato?.nombre ||
        item.vino?.nombre ||
        item.bebida?.nombre ||
        item.menu_degustacion?.nombre ||
        "Producto";
      return `${item.cantidad}x ${name}`;
    })
    .join(", ") || "Sin detalle";

const statusTone = {
  Pendiente: "border-primary/30 bg-primary/10 text-primary",
  Preparando: "border-amber-500/30 bg-amber-500/10 text-amber-700",
  Listo: "border-emerald-700/25 bg-emerald-700/10 text-emerald-800",
  Entregado: "border-text-main/15 bg-text-main/5 text-text-muted",
  Cancelado: "border-red-300 bg-red-50 text-red-800",
  Confirmada: "border-emerald-700/25 bg-emerald-700/10 text-emerald-800",
  Cancelada: "border-red-300 bg-red-50 text-red-800",
};

const EmptyState = ({ children }) => (
  <div className="border border-dashed border-text-main/15 bg-bg-surface px-4 py-10 text-center text-sm leading-relaxed text-text-muted">
    {children}
  </div>
);

const CreateToggle = ({ isOpen, label, onClick }) => (
  <div className="flex justify-end">
    <button
      type="button"
      onClick={onClick}
      className={isOpen ? adminActiveButtonClass : adminSecondaryButtonClass}
    >
      {isOpen ? "Cerrar formulario" : label}
    </button>
  </div>
);

const ToggleField = ({ checked, label, onChange }) => (
  <label className="flex items-center justify-between gap-4 border border-text-main/10 bg-bg-body px-3 py-2.5">
    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
      {label}
    </span>
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="h-4 w-4 accent-primary"
    />
  </label>
);

const AdminView = () => {
  const { logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState("orders");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("active");
  const [reservationSearch, setReservationSearch] = useState("");
  const [reservationFilter, setReservationFilter] = useState("active");
  const [savingKey, setSavingKey] = useState("");
  const [notice, setNotice] = useState("");
  const [openCreateForm, setOpenCreateForm] = useState({
    menu: false,
    tasting_menus: false,
    wines: false,
    beverages: false,
  });
  const shouldReduceMotion = useReducedMotion();

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

  const { data, setData, loading, fetchData } = useAdminData({
    activeSection,
    newDishCategoryId: newDish.categoria_menu_id,
    setNewDish,
  });

  const sections = [
    {
      id: "orders",
      label: "Pedidos",
      icon: HiClipboardList,
      description: "Recogida y preparación",
    },
    {
      id: "reservations",
      label: "Reservas",
      icon: HiCalendar,
      description: "Agenda de sala",
    },
    {
      id: "menu",
      label: "Carta",
      icon: HiCollection,
      description: "Platos y disponibilidad",
    },
    {
      id: "tasting_menus",
      label: "Degustación",
      icon: HiViewGrid,
      description: "Menús por pases",
    },
    {
      id: "wines",
      label: "Bodega",
      icon: HiSparkles,
      description: "Vinos y precios",
    },
    {
      id: "beverages",
      label: "Bar",
      icon: HiBeaker,
      description: "Bebidas y cócteles",
    },
    {
      id: "users",
      label: "Equipo",
      icon: HiUserGroup,
      description: "Usuarios y permisos",
    },
  ];

  const activeMeta = sections.find((section) => section.id === activeSection);
  const ActiveIcon = activeMeta?.icon || HiClipboardList;
  const today = todayIso();
  const adminMetrics = useMemo(() => {
    const activeOrders = data.orders.filter(
      (order) => !["Entregado", "Cancelado"].includes(order.estado),
    ).length;
    const todayReservations = data.reservations.filter(
      (reservation) => reservation.fecha_reserva === today,
    );
    const confirmedSeats = todayReservations
      .filter((reservation) => reservation.estado !== "Cancelada")
      .reduce(
        (total, reservation) => total + Number(reservation.comensales || 0),
        0,
      );
    const estimatedRevenue = data.orders.reduce(
      (total, order) => total + Number.parseFloat(order.total || 0),
      0,
    );

    return [
      { label: "Pedidos activos", value: activeOrders },
      { label: "Reservas hoy", value: todayReservations.length },
      { label: "Cubiertos hoy", value: `${confirmedSeats}/44` },
      { label: "Venta simulada", value: money(estimatedRevenue) },
    ];
  }, [data.orders, data.reservations, today]);

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 1800);
  };

  const toggleCreateForm = (sectionId) => {
    setOpenCreateForm((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }));
  };

  const filteredOrders = useMemo(() => {
    const query = orderSearch.trim();

    return data.orders.filter((order) => {
      const statusMatch =
        orderFilter === "all" ||
        (orderFilter === "active" &&
          !["Entregado", "Cancelado"].includes(order.estado)) ||
        (orderFilter === "today" && order.fecha_recogida === today) ||
        order.estado === orderFilter;

      const textMatch =
        !query ||
        matchesText(order.numero_pedido, query) ||
        matchesText(order.usuario?.nombre, query) ||
        matchesText(orderItemsText(order), query);

      return statusMatch && textMatch;
    });
  }, [data.orders, orderFilter, orderSearch, today]);

  const filteredReservations = useMemo(() => {
    const query = reservationSearch.trim();

    return data.reservations.filter((reservation) => {
      const statusMatch =
        reservationFilter === "all" ||
        (reservationFilter === "active" &&
          reservation.estado !== "Cancelada") ||
        (reservationFilter === "today" &&
          reservation.fecha_reserva === today) ||
        reservation.estado === reservationFilter;

      const textMatch =
        !query ||
        matchesText(reservation.codigo_reserva, query) ||
        matchesText(reservation.usuario?.nombre, query) ||
        matchesText(reservation.mesa_id, query);

      return statusMatch && textMatch;
    });
  }, [data.reservations, reservationFilter, reservationSearch, today]);

  const orderFilterCopy = {
    active: "No hay pedidos activos en este momento.",
    today: "No hay pedidos previstos para hoy.",
    Pendiente: "No hay pedidos pendientes.",
    Preparando: "No hay pedidos en cocina.",
    Listo: "No hay pedidos listos para entregar.",
    Cancelado: "No hay pedidos cancelados.",
    all: "No hay pedidos registrados.",
  };

  const reservationFilterCopy = {
    active: "No hay reservas activas.",
    today: "No hay reservas para hoy.",
    Pendiente: "No hay reservas por confirmar.",
    Confirmada: "No hay reservas confirmadas.",
    Cancelada: "No hay reservas canceladas.",
    all: "No hay reservas registradas.",
  };

  const noOrderResultsCopy = orderSearch.trim()
    ? "No hay pedidos que coincidan con la búsqueda."
    : orderFilterCopy[orderFilter] || "No hay pedidos para este filtro.";

  const noReservationResultsCopy = reservationSearch.trim()
    ? "No hay reservas que coincidan con la búsqueda."
    : reservationFilterCopy[reservationFilter] ||
      "No hay reservas para este filtro.";

  const sectionContentVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.normal, ease: EASING.decelerate },
    },
    exit: {
      opacity: 0,
      y: -6,
      transition: { duration: DURATION.fast, ease: EASING.accelerate },
    },
  };

  const handleAddItem = async (endpoint, itemData, resetState, successMsg) => {
    if (USE_STATIC_DEMO_DATA) {
      Swal.fire({
        icon: "info",
        title: "Demo pública",
        text: "Las altas están desactivadas y no se guardan cambios reales.",
        background: "#fdfaf6",
        color: "#2c302e",
        confirmButtonColor: "#A68A56",
      });
      return;
    }

    try {
      await axios.post(`/admin/${endpoint}`, itemData);
      resetState();
      fetchData();
      Swal.fire({
        icon: "success",
        title: successMsg,
        background: "#fdfaf6",
        color: "#2c302e",
        confirmButtonColor: "#A68A56",
        timer: 1400,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "No se pudo guardar",
        text:
          err.response?.data?.message ||
          "Revise los campos e inténtelo de nuevo.",
        background: "#fdfaf6",
        color: "#2c302e",
      });
    }
  };

  const handleDeleteItem = async (endpoint, id, itemName = "elemento") => {
    if (USE_STATIC_DEMO_DATA) {
      Swal.fire({
        icon: "info",
        title: "Eliminación desactivada",
        text: `En la demo no se puede eliminar: ${itemName}`,
        background: "#fdfaf6",
        color: "#2c302e",
        confirmButtonColor: "#A68A56",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Confirmar eliminación",
      text: `Esta acción no se puede deshacer: ${itemName}`,
      icon: "warning",
      showCancelButton: true,
      background: "#fdfaf6",
      color: "#2c302e",
      confirmButtonColor: "#b91c1c",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/admin/${endpoint}/${id}`);
      fetchData();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el elemento.",
        background: "#fdfaf6",
        color: "#2c302e",
      });
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    setSavingKey(`order-${id}`);

    if (USE_STATIC_DEMO_DATA) {
      setData((current) => ({
        ...current,
        orders: current.orders.map((order) =>
          order.id === id ? { ...order, estado: status } : order,
        ),
      }));
      setSavingKey("");
      showNotice(`Pedido marcado como ${status.toLowerCase()}.`);
      return;
    }

    try {
      await axios.patch(`/admin/orders/${id}`, { estado: status });
      fetchData();
      showNotice(`Pedido marcado como ${status.toLowerCase()}.`);
    } catch {
      Swal.fire({
        icon: "error",
        title: "No se pudo actualizar el pedido",
        background: "#fdfaf6",
        color: "#2c302e",
      });
    } finally {
      setSavingKey("");
    }
  };

  const handleUpdateReservation = async (id, updateData) => {
    setSavingKey(`reservation-${id}`);

    if (USE_STATIC_DEMO_DATA) {
      setData((current) => ({
        ...current,
        reservations: current.reservations.map((reservation) =>
          reservation.id === id
            ? { ...reservation, ...updateData }
            : reservation,
        ),
      }));
      setSavingKey("");
      showNotice("Reserva actualizada.");
      return;
    }

    try {
      await axios.patch(`/admin/reservations/${id}`, updateData);
      fetchData();
      showNotice("Reserva actualizada.");
    } catch {
      Swal.fire({
        icon: "error",
        title: "No se pudo actualizar la reserva",
        background: "#fdfaf6",
        color: "#2c302e",
      });
    } finally {
      setSavingKey("");
    }
  };

  const renderOrderCard = (order) => (
    <article
      key={order.id}
      className="border border-text-main/10 bg-bg-surface p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted/70">
            #{order.numero_pedido || order.id}
          </p>
          <h3 className="mt-1 font-heading text-xl font-normal text-text-main">
            {order.usuario?.nombre || `Cliente #${order.usuario_id}`}
          </h3>
        </div>
        <span
          className={`border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
            statusTone[order.estado] || "border-text-main/10 bg-text-main/5"
          }`}
        >
          {order.estado}
        </span>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <div className="border border-text-main/10 bg-bg-body p-3">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted/70">
            Recogida
          </span>
          <span className="mt-1 block font-medium text-text-main">
            {dateShort(order.fecha_recogida)} · {time(order.hora_recogida)}
          </span>
        </div>
        <div className="border border-text-main/10 bg-bg-body p-3">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted/70">
            Total
          </span>
          <span className="mt-1 block font-medium text-text-main">
            {money(order.total)}
          </span>
        </div>
      </div>

      <p className="mb-4 min-h-[48px] border border-text-main/10 bg-bg-body p-3 text-sm leading-relaxed text-text-muted">
        {orderItemsText(order)}
      </p>

      <div className="flex flex-col gap-3 border-t border-text-main/10 pt-3">
        <div className="flex flex-wrap gap-2">
          {order.estado === "Pendiente" && (
            <button
              type="button"
              disabled={savingKey === `order-${order.id}`}
              onClick={() => handleUpdateOrderStatus(order.id, "Preparando")}
              className="border border-primary/30 bg-primary/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary transition hover:bg-primary hover:text-white disabled:opacity-50"
            >
              Preparar
            </button>
          )}
          {order.estado === "Preparando" && (
            <button
              type="button"
              disabled={savingKey === `order-${order.id}`}
              onClick={() => handleUpdateOrderStatus(order.id, "Listo")}
              className="border border-emerald-700/25 bg-emerald-700/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-800 transition hover:bg-emerald-700 hover:text-white disabled:opacity-50"
            >
              Listo
            </button>
          )}
          {order.estado === "Listo" && (
            <button
              type="button"
              disabled={savingKey === `order-${order.id}`}
              onClick={() => handleUpdateOrderStatus(order.id, "Entregado")}
              className="border border-text-main/15 bg-text-main/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-main transition hover:bg-text-main hover:text-bg-body disabled:opacity-50"
            >
              Entregar
            </button>
          )}
          {!["Entregado", "Cancelado"].includes(order.estado) && (
            <button
              type="button"
              disabled={savingKey === `order-${order.id}`}
              onClick={() => handleUpdateOrderStatus(order.id, "Cancelado")}
              className="border border-red-200 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-700 transition hover:bg-red-50 disabled:opacity-50"
            >
              Cancelar
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={order.estado}
            disabled={savingKey === `order-${order.id}`}
            onChange={(event) =>
              handleUpdateOrderStatus(order.id, event.target.value)
            }
            className="min-w-0 flex-1 border border-text-main/10 bg-bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-text-main outline-none focus:border-primary disabled:opacity-50"
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
              className="border border-red-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-red-700 hover:bg-red-50"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </article>
  );

  const renderReservationCard = (reservation) => (
    <article
      key={reservation.id}
      className="border border-text-main/10 bg-bg-surface p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted/70">
            {reservation.codigo_reserva || `Reserva #${reservation.id}`}
          </p>
          <h3 className="mt-1 font-heading text-xl font-normal text-text-main">
            {reservation.usuario?.nombre ||
              `Cliente #${reservation.usuario_id}`}
          </h3>
        </div>
        <span
          className={`border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
            statusTone[reservation.estado] ||
            "border-text-main/10 bg-text-main/5"
          }`}
        >
          {reservation.estado}
        </span>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="border border-text-main/10 bg-bg-body p-3">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted/70">
            Fecha
          </span>
          <span className="mt-1 block text-sm font-medium text-text-main">
            {dateShort(reservation.fecha_reserva)}
          </span>
        </div>
        <div className="border border-text-main/10 bg-bg-body p-3">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted/70">
            Hora
          </span>
          <span className="mt-1 block text-sm font-medium text-text-main">
            {time(reservation.hora_reserva)}
          </span>
        </div>
        <div className="border border-text-main/10 bg-bg-body p-3">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted/70">
            Pax
          </span>
          <span className="mt-1 block text-sm font-medium text-text-main">
            {reservation.comensales || 0}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <label className={labelClass}>Mesa asignada</label>
        <input
          type="text"
          placeholder="Sin mesa"
          defaultValue={reservation.mesa_id || ""}
          disabled={savingKey === `reservation-${reservation.id}`}
          onBlur={(event) =>
            handleUpdateReservation(reservation.id, {
              mesa_id: event.target.value,
            })
          }
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-text-main/10 pt-3">
        <div className="flex flex-wrap gap-2">
          {reservation.estado === "Pendiente" && (
            <button
              type="button"
              disabled={savingKey === `reservation-${reservation.id}`}
              onClick={() =>
                handleUpdateReservation(reservation.id, {
                  estado: "Confirmada",
                })
              }
              className="border border-emerald-700/25 bg-emerald-700/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-800 transition hover:bg-emerald-700 hover:text-white disabled:opacity-50"
            >
              Confirmar
            </button>
          )}
          {reservation.estado !== "Cancelada" && (
            <button
              type="button"
              disabled={savingKey === `reservation-${reservation.id}`}
              onClick={() =>
                handleUpdateReservation(reservation.id, {
                  estado: "Cancelada",
                })
              }
              className="border border-red-200 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-700 transition hover:bg-red-50 disabled:opacity-50"
            >
              Cancelar
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={reservation.estado}
            disabled={savingKey === `reservation-${reservation.id}`}
            onChange={(event) =>
              handleUpdateReservation(reservation.id, {
                estado: event.target.value,
              })
            }
            className="min-w-0 flex-1 border border-text-main/10 bg-bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-text-main outline-none focus:border-primary disabled:opacity-50"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Confirmada">Confirmada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
          {reservation.estado === "Cancelada" && (
            <button
              onClick={() =>
                handleDeleteItem(
                  "reservations",
                  reservation.id,
                  `Reserva de ${reservation.usuario?.nombre || "cliente"}`,
                )
              }
              className="border border-red-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-red-700 hover:bg-red-50"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </article>
  );

  const renderOrders = () => {
    const columns = [
      {
        id: "Pendiente",
        title: "Entrada",
        icon: HiOutlineClock,
        empty: "No hay pedidos pendientes.",
      },
      {
        id: "Preparando",
        title: "En cocina",
        icon: HiCash,
        empty: "No hay pedidos en cocina.",
      },
      {
        id: "Listo",
        title: "Listo",
        icon: HiCheckCircle,
        empty: "No hay pedidos listos.",
      },
      {
        id: "Entregado",
        title: "Entregado",
        icon: HiCheckCircle,
        empty: "No hay pedidos entregados.",
      },
      {
        id: "Cancelado",
        title: "Cancelado",
        icon: HiOutlineClock,
        empty: "No hay pedidos cancelados.",
      },
    ];
    const visibleColumns = columns.filter((column) => {
      if (orderFilter === "active") {
        return ["Pendiente", "Preparando", "Listo"].includes(column.id);
      }
      if (["all", "today"].includes(orderFilter)) return true;
      return column.id === orderFilter;
    });

    return (
      <div className="space-y-5">
        <div className="flex flex-col gap-3 border border-text-main/10 bg-bg-surface p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap sm:overflow-visible sm:pb-0">
            {[
              ["active", "Activos"],
              ["today", "Hoy"],
              ["Pendiente", "Pendientes"],
              ["Preparando", "Cocina"],
              ["Listo", "Listos"],
              ["Cancelado", "Cancelados"],
              ["all", "Todos"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setOrderFilter(value)}
                className={
                  orderFilter === value
                    ? adminActiveButtonClass
                    : adminSecondaryButtonClass
                }
              >
                {label}
              </button>
            ))}
          </div>
          <input
            type="search"
            value={orderSearch}
            onChange={(event) => setOrderSearch(event.target.value)}
            className={`${inputClass} lg:max-w-sm`}
            placeholder="Buscar pedido, cliente o plato"
          />
        </div>
        {filteredOrders.length > 0 ? (
          <div className="space-y-4 xl:hidden">
            {filteredOrders.map(renderOrderCard)}
          </div>
        ) : (
          <div className="xl:hidden">
            <EmptyState>{noOrderResultsCopy}</EmptyState>
          </div>
        )}

        {filteredOrders.length > 0 && (
          <div className="hidden grid-cols-1 gap-5 xl:grid xl:grid-cols-2 2xl:grid-cols-3">
            {visibleColumns.map((column) => {
              const Icon = column.icon;
              const orders = filteredOrders.filter(
                (order) => order.estado === column.id,
              );

              return (
                <section
                  key={column.id}
                  className="min-h-[240px] border border-text-main/10 bg-bg-body"
                >
                  <header className="flex items-center justify-between border-b border-text-main/10 bg-bg-surface px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Icon className="text-primary" />
                      <h3 className="text-sm font-semibold text-text-main">
                        {column.title}
                      </h3>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                      {orders.length}
                    </span>
                  </header>
                  <div className="space-y-4 p-4">
                    {orders.length > 0 ? (
                      orders.map(renderOrderCard)
                    ) : (
                      <p className="px-2 py-8 text-center text-sm text-text-muted">
                        {column.empty}
                      </p>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
        {filteredOrders.length === 0 && (
          <div className="hidden xl:block">
            <EmptyState>{noOrderResultsCopy}</EmptyState>
          </div>
        )}
      </div>
    );
  };

  const renderReservations = () => {
    const groups = [
      {
        id: "Pendiente",
        title: "Por confirmar",
        empty: "No hay reservas pendientes de confirmar.",
      },
      {
        id: "Confirmada",
        title: "Confirmadas",
        empty: "No hay reservas confirmadas.",
      },
      {
        id: "Cancelada",
        title: "Canceladas",
        empty: "No hay reservas canceladas.",
      },
    ];
    const visibleGroups = groups.filter((group) => {
      if (reservationFilter === "active") {
        return ["Pendiente", "Confirmada"].includes(group.id);
      }
      if (["all", "today"].includes(reservationFilter)) return true;
      return group.id === reservationFilter;
    });

    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-3 border border-text-main/10 bg-bg-surface p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap sm:overflow-visible sm:pb-0">
            {[
              ["active", "Activas"],
              ["today", "Hoy"],
              ["Pendiente", "Por confirmar"],
              ["Confirmada", "Confirmadas"],
              ["Cancelada", "Canceladas"],
              ["all", "Todas"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setReservationFilter(value)}
                className={
                  reservationFilter === value
                    ? adminActiveButtonClass
                    : adminSecondaryButtonClass
                }
              >
                {label}
              </button>
            ))}
          </div>
          <input
            type="search"
            value={reservationSearch}
            onChange={(event) => setReservationSearch(event.target.value)}
            className={`${inputClass} lg:max-w-sm`}
            placeholder="Buscar reserva, cliente o mesa"
          />
        </div>
        {filteredReservations.length === 0 ? (
          <EmptyState>{noReservationResultsCopy}</EmptyState>
        ) : (
          visibleGroups.map((group) => {
            const reservations = filteredReservations.filter(
              (reservation) => reservation.estado === group.id,
            );

            return (
              <section key={group.id}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-text-muted">
                    {group.title}
                  </h3>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                    {reservations.length}
                  </span>
                </div>
                {reservations.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                    {reservations.map(renderReservationCard)}
                  </div>
                ) : (
                  <EmptyState>{group.empty}</EmptyState>
                )}
              </section>
            );
          })
        )}
      </div>
    );
  };

  const renderDishForm = () => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleAddItem(
          "dishes",
          newDish,
          () =>
            setNewDish({
              nombre: "",
              descripcion: "",
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
      className={adminFormClass}
    >
      <div className={adminFormHeaderClass}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Alta rápida
        </p>
        <h3 className="mt-1 font-heading text-2xl font-normal tracking-[0.08em] text-text-main">
          Nuevo plato
        </h3>
      </div>
      <div className={adminFormGridClass}>
        <div className="lg:col-span-3">
          <label className={labelClass}>Nombre</label>
          <input
            required
            value={newDish.nombre}
            onChange={(event) =>
              setNewDish({ ...newDish, nombre: event.target.value })
            }
            className={inputClass}
            placeholder="Croquetas de jamón"
          />
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>Categoría</label>
          <select
            required
            value={newDish.categoria_menu_id}
            onChange={(event) =>
              setNewDish({ ...newDish, categoria_menu_id: event.target.value })
            }
            className={inputClass}
          >
            <option value="" disabled>
              Seleccionar
            </option>
            {data.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="lg:col-span-1">
          <label className={labelClass}>Precio</label>
          <input
            required
            type="number"
            step="0.01"
            value={newDish.precio}
            onChange={(event) =>
              setNewDish({ ...newDish, precio: event.target.value })
            }
            className={inputClass}
            placeholder="0.00"
          />
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>Alérgenos</label>
          <input
            value={newDish.alergenos}
            onChange={(event) =>
              setNewDish({ ...newDish, alergenos: event.target.value })
            }
            className={inputClass}
            placeholder="gluten, leche"
          />
        </div>
        <div className="lg:col-span-4">
          <label className={labelClass}>Descripción</label>
          <textarea
            value={newDish.descripcion}
            onChange={(event) =>
              setNewDish({ ...newDish, descripcion: event.target.value })
            }
            className={inputClass}
            rows="3"
            placeholder="Ingredientes, guarnición y notas de servicio"
          />
        </div>
        <div className="grid grid-cols-1 gap-3 lg:col-span-6 md:grid-cols-2 xl:grid-cols-4">
          <ToggleField
            label="Disponible"
            checked={newDish.disponible}
            onChange={(checked) =>
              setNewDish({ ...newDish, disponible: checked })
            }
          />
          <ToggleField
            label="Visible carta"
            checked={newDish.visible_en_carta}
            onChange={(checked) =>
              setNewDish({ ...newDish, visible_en_carta: checked })
            }
          />
          <ToggleField
            label="Degustación"
            checked={newDish.visible_en_degustacion}
            onChange={(checked) =>
              setNewDish({ ...newDish, visible_en_degustacion: checked })
            }
          />
          <ToggleField
            label="Para llevar"
            checked={newDish.disponible_para_llevar}
            onChange={(checked) =>
              setNewDish({ ...newDish, disponible_para_llevar: checked })
            }
          />
        </div>
      </div>
      <div className="mt-5 flex justify-end border-t border-text-main/10 pt-4">
        <button className={adminSubmitClass}>Crear plato</button>
      </div>
    </form>
  );

  const renderMenu = () => (
    <div className="space-y-6">
      <CreateToggle
        isOpen={openCreateForm.menu}
        label="Crear plato"
        onClick={() => toggleCreateForm("menu")}
      />
      {openCreateForm.menu && renderDishForm()}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {data.menu.map((item) => (
          <DishEditRow
            key={item.id}
            item={item}
            categories={data.categories}
            fetchData={fetchData}
            handleDelete={() =>
              handleDeleteItem("dishes", item.id, item.nombre)
            }
          />
        ))}
      </div>
    </div>
  );

  const renderTastingMenus = () => (
    <div className="space-y-6">
      <CreateToggle
        isOpen={openCreateForm.tasting_menus}
        label="Crear menú"
        onClick={() => toggleCreateForm("tasting_menus")}
      />
      {openCreateForm.tasting_menus && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleAddItem(
              "tasting-menus",
              newTastingMenu,
              () =>
                setNewTastingMenu({
                  nombre: "",
                  descripcion: "",
                  precio: "",
                  precio_maridaje: "",
                  pasos: 1,
                  duracion_estimada_minutos: 60,
                  disponible: true,
                }),
              "Menú añadido",
            );
          }}
          className={adminFormClass}
        >
          <div className={adminFormHeaderClass}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Alta rápida
            </p>
            <h3 className="mt-1 font-heading text-2xl font-normal tracking-[0.08em] text-text-main">
              Nuevo menú degustación
            </h3>
          </div>
          <div className={adminFormGridClass}>
            <div className="lg:col-span-3">
              <label className={labelClass}>Nombre</label>
              <input
                required
                value={newTastingMenu.nombre}
                onChange={(event) =>
                  setNewTastingMenu({
                    ...newTastingMenu,
                    nombre: event.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            <div className="lg:col-span-1">
              <label className={labelClass}>Precio</label>
              <input
                required
                type="number"
                step="0.01"
                value={newTastingMenu.precio}
                onChange={(event) =>
                  setNewTastingMenu({
                    ...newTastingMenu,
                    precio: event.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            <div className="lg:col-span-1">
              <label className={labelClass}>Maridaje</label>
              <input
                type="number"
                step="0.01"
                value={newTastingMenu.precio_maridaje}
                onChange={(event) =>
                  setNewTastingMenu({
                    ...newTastingMenu,
                    precio_maridaje: event.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            <div className="lg:col-span-1">
              <label className={labelClass}>Pases</label>
              <input
                type="number"
                value={newTastingMenu.pasos}
                onChange={(event) =>
                  setNewTastingMenu({
                    ...newTastingMenu,
                    pasos: event.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            <div className="lg:col-span-6">
              <label className={labelClass}>Descripción</label>
              <textarea
                value={newTastingMenu.descripcion}
                onChange={(event) =>
                  setNewTastingMenu({
                    ...newTastingMenu,
                    descripcion: event.target.value,
                  })
                }
                className={inputClass}
                rows="3"
              />
            </div>
            <div className="lg:col-span-2">
              <ToggleField
                label="Disponible"
                checked={newTastingMenu.disponible}
                onChange={(checked) =>
                  setNewTastingMenu({ ...newTastingMenu, disponible: checked })
                }
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end border-t border-text-main/10 pt-4">
            <button className={adminSubmitClass}>Crear menú</button>
          </div>
        </form>
      )}
      <div className="space-y-4">
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
  );

  const renderWines = () => (
    <div className="space-y-6">
      <CreateToggle
        isOpen={openCreateForm.wines}
        label="Crear referencia"
        onClick={() => toggleCreateForm("wines")}
      />
      {openCreateForm.wines && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
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
          className={adminFormClass}
        >
          <div className={adminFormHeaderClass}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Alta rápida
            </p>
            <h3 className="mt-1 font-heading text-2xl font-normal tracking-[0.08em] text-text-main">
              Nueva referencia
            </h3>
          </div>
          <div className={adminFormGridClass}>
            <div className="lg:col-span-2">
              <label className={labelClass}>Nombre</label>
              <input
                required
                value={newWine.nombre}
                onChange={(event) =>
                  setNewWine({ ...newWine, nombre: event.target.value })
                }
                className={inputClass}
              />
            </div>
            <div className="lg:col-span-2">
              <label className={labelClass}>Región</label>
              <input
                required
                value={newWine.region}
                onChange={(event) =>
                  setNewWine({ ...newWine, region: event.target.value })
                }
                className={inputClass}
              />
            </div>
            <div className="lg:col-span-2">
              <label className={labelClass}>Tipo</label>
              <select
                value={newWine.tipo}
                onChange={(event) =>
                  setNewWine({ ...newWine, tipo: event.target.value })
                }
                className={inputClass}
              >
                <option value="Tinto">Tinto</option>
                <option value="Blanco">Blanco</option>
                <option value="Rosado">Rosado</option>
                <option value="Espumoso">Espumoso</option>
                <option value="Dulce">Dulce</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className={labelClass}>Botella</label>
              <input
                required
                type="number"
                step="0.01"
                value={newWine.precio_botella}
                onChange={(event) =>
                  setNewWine({ ...newWine, precio_botella: event.target.value })
                }
                className={inputClass}
              />
            </div>
            <div className="lg:col-span-2">
              <label className={labelClass}>Copa</label>
              <input
                type="number"
                step="0.01"
                value={newWine.precio_copa}
                onChange={(event) =>
                  setNewWine({ ...newWine, precio_copa: event.target.value })
                }
                className={inputClass}
              />
            </div>
            <div className="lg:col-span-2">
              <ToggleField
                label="Disponible"
                checked={newWine.disponible}
                onChange={(checked) =>
                  setNewWine({ ...newWine, disponible: checked })
                }
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end border-t border-text-main/10 pt-4">
            <button className={adminSubmitClass}>Crear referencia</button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {data.wines.map((item) => (
          <WineEditRow
            key={item.id}
            item={item}
            fetchData={fetchData}
            handleDelete={() =>
              handleDeleteItem("wines", item.id, item.nombre || item.name)
            }
          />
        ))}
      </div>
    </div>
  );

  const renderBeverages = () => (
    <div className="space-y-6">
      <CreateToggle
        isOpen={openCreateForm.beverages}
        label="Crear bebida"
        onClick={() => toggleCreateForm("beverages")}
      />
      {openCreateForm.beverages && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
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
                  destacado: false,
                }),
              "Bebida añadida",
            );
          }}
          className={adminFormClass}
        >
          <div className={adminFormHeaderClass}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Alta rápida
            </p>
            <h3 className="mt-1 font-heading text-2xl font-normal tracking-[0.08em] text-text-main">
              Nueva bebida
            </h3>
          </div>
          <div className={adminFormGridClass}>
            <div className="lg:col-span-2">
              <label className={labelClass}>Nombre</label>
              <input
                required
                value={newBeverage.nombre}
                onChange={(event) =>
                  setNewBeverage({ ...newBeverage, nombre: event.target.value })
                }
                className={inputClass}
              />
            </div>
            <div className="lg:col-span-2">
              <label className={labelClass}>Tipo</label>
              <select
                value={newBeverage.tipo}
                onChange={(event) =>
                  setNewBeverage({ ...newBeverage, tipo: event.target.value })
                }
                className={inputClass}
              >
                <option value="agua">Agua</option>
                <option value="refresco">Refresco</option>
                <option value="cocktail">Cóctel</option>
                <option value="cafe">Café</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className={labelClass}>Precio</label>
              <input
                required
                type="number"
                step="0.01"
                value={newBeverage.precio}
                onChange={(event) =>
                  setNewBeverage({ ...newBeverage, precio: event.target.value })
                }
                className={inputClass}
              />
            </div>
            <div className="lg:col-span-6">
              <label className={labelClass}>Descripción</label>
              <input
                required
                value={newBeverage.descripcion}
                onChange={(event) =>
                  setNewBeverage({
                    ...newBeverage,
                    descripcion: event.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 lg:col-span-4 sm:grid-cols-2">
              <ToggleField
                label="Disponible"
                checked={newBeverage.disponible}
                onChange={(checked) =>
                  setNewBeverage({ ...newBeverage, disponible: checked })
                }
              />
              <ToggleField
                label="Destacada"
                checked={newBeverage.destacado}
                onChange={(checked) =>
                  setNewBeverage({ ...newBeverage, destacado: checked })
                }
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end border-t border-text-main/10 pt-4">
            <button className={adminSubmitClass}>Crear bebida</button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {data.beverages.map((item) => (
          <BeverageEditRow
            key={item.id}
            item={item}
            fetchData={fetchData}
            handleDelete={() =>
              handleDeleteItem("beverages", item.id, item.nombre || item.name)
            }
          />
        ))}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {data.users?.length ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
          {data.users.map((user) => (
            <UserEditRow key={user.id} user={user} fetchData={fetchData} />
          ))}
        </div>
      ) : (
        <EmptyState>No hay usuarios registrados.</EmptyState>
      )}
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="border border-text-main/10 bg-bg-surface p-6 animate-pulse"
            >
              <div className="h-5 w-1/3 bg-text-main/10 mb-4" />
              <div className="h-4 w-full bg-text-main/10 mb-2" />
              <div className="h-4 w-2/3 bg-text-main/10" />
            </div>
          ))}
        </div>
      );
    }

    if (activeSection === "orders") return renderOrders();
    if (activeSection === "reservations") return renderReservations();
    if (activeSection === "menu") return renderMenu();
    if (activeSection === "tasting_menus") return renderTastingMenus();
    if (activeSection === "wines") return renderWines();
    if (activeSection === "beverages") return renderBeverages();
    if (activeSection === "users") return renderUsers();
    return null;
  };

  return (
    <div className="min-h-screen bg-bg-body font-body text-text-main">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-text-main/10 bg-text-main text-bg-body lg:flex lg:flex-col">
          <div className="border-b border-bg-body/10 px-6 py-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
              Distrito Gourmet
            </p>
            <h1 className="mt-3 font-heading text-3xl font-normal tracking-[0.12em] text-bg-body">
              Panel de trabajo
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-bg-body/65">
              Operativa diaria para sala, cocina, barra y dirección.
            </p>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex w-full items-center gap-3 px-3 py-3 text-left transition ${
                    isActive
                      ? "bg-bg-body text-text-main"
                      : "text-bg-body/70 hover:bg-bg-body/5 hover:text-bg-body"
                  }`}
                >
                  <Icon
                    className={`text-lg ${
                      isActive ? "text-primary" : "text-bg-body/45"
                    }`}
                  />
                  <span>
                    <span className="block text-sm font-semibold">
                      {section.label}
                    </span>
                    <span
                      className={`block text-xs ${
                        isActive ? "text-text-muted" : "text-bg-body/45"
                      }`}
                    >
                      {section.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="border-t border-bg-body/10 p-4">
            <button
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 border border-bg-body/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-bg-body/70 transition hover:border-bg-body/40 hover:text-bg-body"
            >
              <HiLogout />
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-text-main/10 bg-bg-body/95 backdrop-blur">
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    <ActiveIcon />
                    {activeMeta?.description}
                  </div>
                  <h2 className="mt-1 font-heading text-3xl font-normal tracking-[0.12em] text-text-main">
                    {activeMeta?.label}
                  </h2>
                </div>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 border border-text-main/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted lg:hidden"
                >
                  <HiLogout />
                  Salir
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar lg:hidden">
                {sections.map((section) => {
                  const Icon = section.icon;

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`inline-flex shrink-0 items-center gap-2 border px-3 py-2 text-xs font-semibold ${
                        activeSection === section.id
                          ? "border-text-main bg-text-main text-bg-body"
                          : "border-text-main/10 bg-bg-surface text-text-muted"
                      }`}
                    >
                      <Icon />
                      {section.label}
                    </button>
                  );
                })}
              </div>

              {notice && (
                <div className="border border-emerald-700/20 bg-emerald-700/10 px-3 py-2 text-sm text-emerald-800">
                  {notice}
                </div>
              )}
            </div>
          </header>

          {USE_STATIC_DEMO_DATA && (
            <div className="border-b border-primary/20 bg-primary/10 px-4 py-3 text-sm text-text-main sm:px-6 lg:px-8">
              Modo demo: puedes navegar y cambiar estados en memoria, pero no se
              guardan altas ni eliminaciones reales.
            </div>
          )}

          <section className="px-4 py-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
              {adminMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="border border-text-main/10 bg-bg-surface p-4"
                >
                  <span className="block text-[10px] uppercase tracking-[3px] text-text-muted mb-2">
                    {metric.label}
                  </span>
                  <span className="font-heading text-3xl text-text-main">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                variants={
                  shouldReduceMotion ? undefined : sectionContentVariants
                }
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminView;
