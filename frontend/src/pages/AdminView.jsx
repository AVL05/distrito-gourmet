import { useAuthStore } from '@/store/auth';
import { useState, useEffect, useCallback } from 'react';
import axios from '@/services/api';
import Swal from 'sweetalert2';
import { AnimatePresence, useReducedMotion, FadeIn, motion } from '@/motion';
import { DURATION, EASING } from '@/motion';
import { HiTrash } from 'react-icons/hi';

// Interfaz de administración con navegación por pestañas. Gestiona la lógica de CRUD para los principales recursos del sistema.
const AdminView = () => {
  const { logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState('orders');
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

  // Secciones del panel de administración
  const sections = [
    { id: 'orders', label: 'Pedidos' },
    { id: 'reservations', label: 'Reservas' },
    { id: 'menu', label: 'Platos' },
    { id: 'tasting_menus', label: 'Menús' },
    { id: 'wines', label: 'Bodega' },
    { id: 'beverages', label: 'Bebidas' },
    { id: 'users', label: 'Usuarios' },
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
    nombre: '',
    descripcion: '',
    precio: '',
    categoria_menu_id: '',
    alergenos: '',
    disponible: true,
    visible_en_carta: true,
    visible_en_degustacion: true,
    disponible_para_llevar: true,
    es_por_unidad: false,
    maximo_por_pedido: '',
  });
  const [newWine, setNewWine] = useState({
    nombre: '',
    region: '',
    uva: '',
    tipo: 'Tinto',
    notas_maridaje: '',
    descripcion: '',
    precio_botella: '',
    precio_copa: '',
    disponible: true,
    destacado: false,
    maximo_por_pedido: '',
  });
  const [newBeverage, setNewBeverage] = useState({
    nombre: '',
    tipo: 'agua',
    precio: '',
    descripcion: '',
    disponible: true,
    destacado: false
  });
  const [newTastingMenu, setNewTastingMenu] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    precio_maridaje: '',
    pasos: 1,
    duracion_estimada_minutos: 60,
    disponible: true
  });

  // Handlers genéricos para añadir elementos
  const handleAddItem = async (endpoint, itemData, resetState, successMsg) => {
    try {
      await axios.post(`/admin/${endpoint}`, itemData);
      resetState();
      fetchData();
      Swal.fire({
        icon: 'success',
        title: successMsg,
        background: '#fdfaf6',
        color: '#2c302e',
        confirmButtonColor: '#e76f51',
        timer: 1500,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || `Error al añadir el elemento`,
        background: '#fdfaf6',
        color: '#2c302e',
      });
    }
  };

  // Handlers genéricos para eliminar elementos
  const handleDeleteItem = async (endpoint, id, itemName = 'elemento') => {
    const result = await Swal.fire({
      title: '¿Confirmar eliminación?',
      text: `Esta acción no se puede deshacer para: ${itemName}`,
      icon: 'warning',
      showCancelButton: true,
      background: '#fdfaf6',
      color: '#2c302e',
      confirmButtonColor: '#e76f51',
      cancelButtonColor: '#888',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/admin/${endpoint}/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el elemento.',
        background: '#fdfaf6',
        color: '#2c302e',
      });
    }
  };

  // Llamada a la API para obtener los datos de la sección activa
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeSection === 'orders') {
        const res = await axios.get('/admin/orders');
        setData(d => ({ ...d, orders: res.data }));
      } else if (activeSection === 'reservations') {
        const res = await axios.get('/admin/reservations');
        setData(d => ({ ...d, reservations: res.data }));
      } else if (activeSection === 'menu') {
        const res = await axios.get('/dishes');
        const sortedDishes = (res.data.platos || []).sort((a, b) => {
          const order = { 'entrantes': 1, 'principales': 2, 'postres': 3 };
          const orderA = order[a.categoria?.nombre.toLowerCase()] || 99;
          const orderB = order[b.categoria?.nombre.toLowerCase()] || 99;
          return orderA - orderB;
        });
        setData(d => ({ ...d, menu: sortedDishes, categories: res.data.categorias || [] }));
        if (res.data.categorias?.length > 0 && !newDish.categoria_menu_id) {
          setNewDish(prev => ({ ...prev, categoria_menu_id: res.data.categorias[0].id }));
        }
      } else if (activeSection === 'wines') {
        const res = await axios.get('/admin/wines');
        setData(d => ({ ...d, wines: res.data }));
      } else if (activeSection === 'beverages') {
        const res = await axios.get('/admin/beverages');
        setData(d => ({ ...d, beverages: res.data }));
      } else if (activeSection === 'tasting_menus') {
        const [menusRes, dishesRes] = await Promise.all([axios.get('/admin/tasting-menus'), axios.get('/dishes')]);
        const sortedDishes = (dishesRes.data.platos || []).sort((a, b) => {
          const order = { 'entrantes': 1, 'principales': 2, 'postres': 3 };
          const orderA = order[a.categoria?.nombre.toLowerCase()] || 99;
          const orderB = order[b.categoria?.nombre.toLowerCase()] || 99;
          return orderA - orderB;
        });
        setData(d => ({
          ...d,
          tasting_menus: menusRes.data,
          menu: sortedDishes,
        }));
      } else if (activeSection === 'users') {
        const res = await axios.get('/admin/users');
        setData(d => ({ ...d, users: res.data }));
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error de carga',
        text: 'No se pudieron recuperar los datos del servidor.',
        background: '#fdfaf6',
        color: '#2c302e',
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
      await axios.patch(`/admin/orders/${id}`, { status });
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
    if (loading) return <div className="text-text-muted animate-pulse">Cargando datos del servidor...</div>;

    if (activeSection === 'orders') {
      const activeOrders = data.orders.filter(o => !['Entregado', 'Cancelado'].includes(o.estado));
      const finishedOrders = data.orders.filter(o => ['Entregado', 'Cancelado'].includes(o.estado));

      const renderOrderCard = order => (
        <div
          key={order.id}
          className={`bg-bg-surface/90 border p-5 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
            order.estado === 'Pendiente'
              ? 'border-primary/50 shadow-[0_0_20px_rgba(197,160,89,0.1)]'
              : order.estado === 'cancelled'
                ? 'border-red-500/20 opacity-60 grayscale-[0.5]'
                : 'border-text-main/5 hover:border-text-main/20'
          }`}>
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col">
                <span className="text-primary text-[11px] uppercase tracking-[3px] font-bold">#{order.numero_pedido || order.id}</span>
              </div>
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  order.estado === 'Pendiente'
                    ? 'bg-blue-500 animate-pulse'
                    : order.estado === 'Preparando'
                      ? 'bg-amber-500'
                      : order.estado === 'Listo'
                        ? 'bg-green-500'
                        : order.estado === 'Cancelado'
                          ? 'bg-red-500'
                          : 'bg-text-muted/30'
                }`}></div>
            </div>
            <p className="text-text-main font-heading text-xl mb-1">{order.usuario?.nombre || `ID: ${order.usuario_id}`}</p>
            <p className="text-text-muted text-[13px] mb-4 opacity-70 font-medium">Total: {parseFloat(order.total).toFixed(2)}€</p>

            <div className="flex flex-wrap gap-2 mb-4">
              <div className="bg-primary/10 px-3 py-1.5 rounded-sm border border-primary/20 flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-primary font-bold">Recogida:</span>
                <span className="text-sm font-heading text-primary">
                  {order.fecha_recogida ? new Date(order.fecha_recogida).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }) : 'Hoy'} - {order.hora_recogida?.substring(0, 5) || 'Sin hora'}
                </span>
              </div>
              <div className="bg-black/5 px-3 py-1.5 rounded-sm border border-text-main/5 flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-text-muted font-bold">Pago:</span>
                <span className="text-sm font-body text-text-main uppercase tracking-tighter font-medium">{order.metodo_pago === 'card' ? 'Tarjeta' : order.metodo_pago === 'cash' ? 'Efectivo' : order.metodo_pago || 'Pendiente'}</span>
              </div>
            </div>

            <div className="bg-black/5 p-4 rounded-sm border border-text-main/5">
              <p className="text-text-main text-[14px] font-light leading-relaxed italic opacity-90">
                {order.detalles?.map(i => {
                  const nombre = i.plato?.nombre || i.vino?.nombre || i.bebida?.nombre || i.menu_degustacion?.nombre || 'Producto';
                  return `${i.cantidad}x ${nombre}`;
                }).join(', ')}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-text-main/5 gap-4">
            <span className="text-[12px] uppercase tracking-widest text-text-muted hidden sm:block font-bold">Logística</span>
            <select
              value={order.estado}
              onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
              className="bg-bg-surface border border-text-main/10 text-text-main rounded p-2 pr-8 text-[13px] uppercase tracking-widest outline-none w-full sm:w-auto font-medium">
              <option value="Pendiente">Pendiente</option>
              <option value="Preparando">Preparando</option>
              <option value="Listo">Listo</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      );

      return (
        <div className="space-y-16">
          {activeOrders.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-primary font-heading text-2xl tracking-[0.1em] uppercase">Pedidos Activos</h3>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-primary/30 to-transparent"></div>
                <span className="bg-primary/10 text-primary px-3 py-1 text-xs rounded-full font-bold">
                  {activeOrders.length} EN CURSO
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {activeOrders.map(renderOrderCard)}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-text-main font-heading text-2xl tracking-[0.1em] uppercase opacity-40">Historial</h3>
              <div className="h-[1px] flex-grow bg-gradient-to-r from-text-main/10 to-transparent"></div>
            </div>
            {finishedOrders.length === 0 && activeOrders.length === 0 ? (
              <p className="text-text-muted">No hay pedidos registrados.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 opacity-60">
                {finishedOrders.map(renderOrderCard)}
              </div>
            )}
          </section>
        </div>
      );
    }

    if (activeSection === 'reservations') {
      const pending = data.reservations.filter(r => r.estado === 'Pendiente');
      const confirmed = data.reservations.filter(r => r.estado === 'Confirmada');
      const cancelled = data.reservations.filter(r => r.estado === 'Cancelada');

      const renderCard = res => (
        <div
          key={res.id}
          className={`bg-bg-surface/90 border p-5 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
            res.estado === 'Pendiente'
              ? 'border-primary/50 shadow-[0_0_20px_rgba(197,160,89,0.1)]'
              : 'border-text-main/5 hover:border-text-main/20'
          }`}>
          {res.estado === 'Pendiente' && (
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl -mr-8 -mt-8"></div>
          )}

          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-primary text-[9px] uppercase tracking-[3px] font-bold">Reserva #{res.codigo_reserva || res.id}</span>
              <div
                className={`w-2 h-2 rounded-full ${
                  res.estado === 'Pendiente' ? 'bg-primary animate-pulse' : res.estado === 'Confirmada' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
            </div>
            <p className="text-text-main font-heading text-lg mb-1">{res.usuario?.nombre || `ID: ${res.usuario_id}`}</p>
            <p className="text-text-muted text-[11px] mb-4 opacity-70">
              Registrado: {new Date(res.creado_a).toLocaleDateString()}
            </p>

            <div className="space-y-2 bg-black/5 p-3 rounded-sm border border-text-main/5">
              <div className="flex items-center gap-3">
                <span className="text-text-main text-xs font-bold uppercase tracking-widest opacity-40">FECHA:</span>
                <span className="text-text-main text-sm font-light">
                  {new Date(res.fecha_reserva + 'T00:00:00').toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                  })} - {res.hora_reserva ? res.hora_reserva.slice(0, 5) : ''}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-text-main text-xs font-bold uppercase tracking-widest opacity-40">COMENSALES:</span>
                <span className="text-text-main text-sm font-light">{res.comensales} comensales</span>
              </div>
              <div className="flex items-center gap-3 mt-2 pt-2 border-t border-text-main/5">
                <span className="text-primary text-[10px] font-bold uppercase tracking-widest">MESA:</span>
                <input
                  type="text"
                  placeholder="Sin asignar"
                  defaultValue={res.mesa_id || ''}
                  onBlur={e => handleUpdateReservation(res.id, { mesa_id: e.target.value })}
                  className="bg-transparent border-0 border-b border-primary/20 text-text-main text-xs p-0 focus:ring-0 focus:border-primary transition-all w-full placeholder:text-text-muted/30"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-text-main/5">
            <span className="text-[10px] uppercase tracking-widest text-text-muted">Estado</span>
            <select
              value={res.estado}
              onChange={e => handleUpdateReservation(res.id, { estado: e.target.value })}
              className={`bg-bg-surface border border-text-main/10 text-text-main rounded p-1.5 pr-8 text-[11px] uppercase tracking-widest outline-none transition-all ${
                res.estado === 'Pendiente' ? 'border-primary/40 text-primary' : ''
              }`}>
              <option value="Pendiente">Pendiente</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
        </div>
      );

      return (
        <div className="space-y-16">
          {pending.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-primary font-heading text-2xl tracking-[0.1em] uppercase">Por Confirmar</h3>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-primary/30 to-transparent"></div>
                <span className="bg-primary/10 text-primary px-3 py-1 text-[10px] rounded-full font-bold">
                  {pending.length} ACCIONES
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {pending.map(renderCard)}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-text-main font-heading text-2xl tracking-[0.1em] uppercase opacity-40">Planificación</h3>
              <div className="h-[1px] flex-grow bg-gradient-to-r from-text-main/10 to-transparent"></div>
            </div>
            {confirmed.length === 0 ? (
              <p className="text-text-muted">No hay servicios confirmados para mostrar.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {confirmed.map(renderCard)}
              </div>
            )}
          </section>

          {cancelled.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-red-500/40 font-heading text-2xl tracking-[0.1em] uppercase">Canceladas</h3>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-red-500/10 to-transparent"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 opacity-50 grayscale-[0.5]">
                {cancelled.map(renderCard)}
              </div>
            </section>
          )}
        </div>
      );
    }

    if (activeSection === 'menu') {
      return (
        <div className="space-y-8">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleAddItem(
                'dishes',
                newDish,
                () =>
                  setNewDish({
                    nombre: '',
                    precio: '',
                    categoria_menu_id: data.categories[0]?.id || '',
                    alergenos: '',
                    disponible: true,
                    visible_en_carta: true,
                    visible_en_degustacion: true,
                    disponible_para_llevar: true,
                    es_por_unidad: false,
                    maximo_por_pedido: '',
                  }),
                'Plato añadido'
              );
            }}
            className="bg-bg-surface/90 border border-text-main/10 p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-end shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

            <h3 className="col-span-full font-heading text-primary text-xl mb-2 flex items-center gap-3">
              <span className="w-1 h-6 bg-primary"></span>
              Añadir Nuevo Plato a la Carta
            </h3>

            <div className="md:col-span-2">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Nombre del Plato
              </label>
              <input
                required
                type="text"
                placeholder="Ej: Ostras al Carbón..."
                value={newDish.nombre}
                onChange={e => setNewDish({ ...newDish, nombre: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Categoría</label>
              <select
                required
                value={newDish.categoria_menu_id}
                onChange={e => setNewDish({ ...newDish, categoria_menu_id: e.target.value })}
                className="w-full bg-bg-surface border-b border-text-main/10 text-text-main p-1.5 pr-8 focus:border-primary outline-none text-sm cursor-pointer appearance-none">
                <option value="" disabled>
                  Seleccionar...
                </option>
                {data.categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-full">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Composición del Plato (Descripción)</label>
              <textarea
                placeholder="Describa los ingredientes y la esencia del plato..."
                value={newDish.descripcion}
                onChange={e => setNewDish({ ...newDish, descripcion: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors min-h-[80px] resize-none"
              />
            </div>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Precio (€)</label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newDish.precio}
                onChange={e => setNewDish({ ...newDish, precio: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-1">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Alérgenos</label>
              <input
                type="text"
                placeholder="Gluten, Lácteos..."
                value={newDish.alergenos}
                onChange={e => setNewDish({ ...newDish, alergenos: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-1">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Máx. por Pedido</label>
              <input
                type="number"
                placeholder="Sin límite"
                value={newDish.maximo_por_pedido}
                onChange={e => setNewDish({ ...newDish, maximo_por_pedido: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div className="col-span-full flex flex-wrap gap-x-10 gap-y-6 pt-6 pb-2 border-t border-text-main/5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={newDish.es_por_unidad}
                  onChange={e => setNewDish({ ...newDish, es_por_unidad: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[11px] uppercase tracking-[1px] text-text-main/70 group-hover:text-primary transition-colors whitespace-nowrap">P/ Unidad</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={newDish.disponible_para_llevar}
                  onChange={e => setNewDish({ ...newDish, disponible_para_llevar: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[11px] uppercase tracking-[1px] text-text-main/70 group-hover:text-primary transition-colors whitespace-nowrap">Takeaway</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={newDish.disponible}
                  onChange={e => setNewDish({ ...newDish, disponible: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[11px] uppercase tracking-[1px] text-text-main/70 group-hover:text-primary transition-colors whitespace-nowrap">Disponible</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={newDish.visible_en_carta}
                  onChange={e => setNewDish({ ...newDish, visible_en_carta: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[11px] uppercase tracking-[1px] text-text-main/70 group-hover:text-primary transition-colors whitespace-nowrap">Ver en Carta</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={newDish.visible_en_degustacion}
                  onChange={e => setNewDish({ ...newDish, visible_en_degustacion: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[11px] uppercase tracking-[1px] text-text-main/70 group-hover:text-primary transition-colors whitespace-nowrap">Ver en Degustación</span>
              </label>
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-bg-surface text-black font-bold uppercase tracking-[3px] text-[10px] transition-all p-3.5 w-full shadow-[0_10px_20px_rgba(197,160,89,0.2)] hover:shadow-[0_15px_30px_rgba(197,160,89,0.4)] col-span-full">
              Confirmar Alta
            </button>
          </form>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {data.menu.map(item => (
              <DishEditRow
                key={item.id}
                item={item}
                fetchData={fetchData}
                handleDelete={() => handleDeleteItem('dishes', item.id, item.nombre)}
                categories={data.categories}
              />
            ))}
          </div>
        </div>
      );
    }

    if (activeSection === 'tasting_menus') {
      return (
        <div className="space-y-12">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleAddItem(
                'tasting-menus',
                newTastingMenu,
                () => setNewTastingMenu({
                  nombre: '',
                  descripcion: '',
                  precio: '',
                  precio_maridaje: '',
                  pasos: 1,
                  duracion_estimada_minutos: 60,
                  disponible: true
                }),
                'Menú añadido'
              );
            }}
            className="bg-bg-surface/90 border border-text-main/10 p-8 grid grid-cols-1 md:grid-cols-4 gap-8 items-end shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

            <h3 className="col-span-full font-heading text-primary text-xl mb-4 flex items-center gap-3">
              <span className="w-1 h-6 bg-primary"></span>
              Diseñar Nuevo Menú Degustación
            </h3>

            <div className="md:col-span-2">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Título del Menú</label>
              <input
                required
                type="text"
                placeholder="Ej: Menú Esencia..."
                value={newTastingMenu.nombre}
                onChange={e => setNewTastingMenu({ ...newTastingMenu, nombre: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Precio Persona (€)</label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newTastingMenu.precio}
                onChange={e => setNewTastingMenu({ ...newTastingMenu, precio: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Nº de Pasos</label>
              <input
                required
                type="number"
                placeholder="7"
                value={newTastingMenu.pasos}
                onChange={e => setNewTastingMenu({ ...newTastingMenu, pasos: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-1">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Duración (min)</label>
              <input
                type="number"
                placeholder="120"
                value={newTastingMenu.duracion_estimada_minutos}
                onChange={e => setNewTastingMenu({ ...newTastingMenu, duracion_estimada_minutos: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Precio Maridaje (€)</label>
              <input
                type="number"
                step="0.01"
                placeholder="45.00"
                value={newTastingMenu.precio_maridaje}
                onChange={e => setNewTastingMenu({ ...newTastingMenu, precio_maridaje: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Relato del Menú</label>
              <textarea
                rows="1"
                placeholder="Un viaje sensorial por..."
                value={newTastingMenu.descripcion}
                onChange={e => setNewTastingMenu({ ...newTastingMenu, descripcion: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-white text-black font-bold uppercase tracking-[3px] text-[10px] transition-all p-3.5 w-full shadow-[0_10px_20px_rgba(197,160,89,0.2)] hover:shadow-[0_15px_30px_rgba(197,160,89,0.4)]">
              Dar de Alta
            </button>
          </form>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {data.tasting_menus.map(item => (
              <TastingMenuEditRow
                key={item.id}
                item={item}
                fetchData={fetchData}
                handleDelete={() => handleDeleteItem('tasting-menus', item.id, item.nombre)}
                allAvailableDishes={data.menu}
              />
            ))}
          </div>
        </div>
      );
    }

    if (activeSection === 'wines') {
      return (
        <div className="space-y-12">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleAddItem(
                'wines',
                newWine,
                () => setNewWine({
                  name: '', winery: '', vintage: '', country: 'España', region: '', grape: '', type: 'Tinto', pairing_notes: '', description: '', alcohol_percentage: '', temperature_service: '', price_bottle: '', price_glass: '', available: true, featured: false, max_per_order: ''
                }),
                'Vino añadido'
              );
            }}
            className="bg-bg-surface/90 border border-text-main/10 p-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-end shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

            <h3 className="col-span-full font-heading text-primary text-xl mb-4 flex items-center gap-3">
              <span className="w-1 h-6 bg-primary"></span>
              Registrar Nueva Referencia en Bodega
            </h3>

            <div className="md:col-span-2">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Nombre del Vino</label>
              <input
                required
                type="text"
                placeholder="Ej: Vega Sicilia Único..."
                value={newWine.name}
                onChange={e => setNewWine({ ...newWine, name: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Bodega</label>
              <input
                type="text"
                placeholder="Vega Sicilia..."
                value={newWine.winery}
                onChange={e => setNewWine({ ...newWine, winery: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Tipo</label>
              <select
                value={newWine.type}
                onChange={e => setNewWine({ ...newWine, type: e.target.value })}
                className="w-full bg-bg-surface border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none text-sm appearance-none cursor-pointer">
                <option value="Tinto">Tinto</option>
                <option value="Blanco">Blanco</option>
                <option value="Rosado">Rosado</option>
                <option value="Espumoso">Espumoso</option>
                <option value="Dulce">Dulce</option>
              </select>
            </div>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Región / D.O.</label>
              <input
                type="text"
                placeholder="Ribera del Duero..."
                value={newWine.region}
                onChange={e => setNewWine({ ...newWine, region: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Uva</label>
              <input
                type="text"
                placeholder="Tempranillo..."
                value={newWine.grape}
                onChange={e => setNewWine({ ...newWine, grape: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Año</label>
              <input
                type="text"
                placeholder="2018"
                value={newWine.vintage}
                onChange={e => setNewWine({ ...newWine, vintage: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Alcohol (%)</label>
              <input
                type="number"
                step="0.1"
                placeholder="14.5"
                value={newWine.alcohol_percentage}
                onChange={e => setNewWine({ ...newWine, alcohol_percentage: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">P. Botella (€)</label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newWine.price_bottle}
                onChange={e => setNewWine({ ...newWine, price_bottle: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">P. Copa (€)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Opcional"
                value={newWine.price_glass}
                onChange={e => setNewWine({ ...newWine, price_glass: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>
            <div className="flex items-center gap-6 pb-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={newWine.featured}
                  onChange={e => setNewWine({ ...newWine, featured: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[10px] uppercase tracking-widest text-text-muted group-hover:text-primary transition-colors">Destacado</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={newWine.available}
                  onChange={e => setNewWine({ ...newWine, available: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[10px] uppercase tracking-widest text-text-muted group-hover:text-primary transition-colors">Disponible</span>
              </label>
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-white text-black font-bold uppercase tracking-[3px] text-[10px] transition-all p-3.5 w-full shadow-[0_10px_20px_rgba(197,160,89,0.2)]">
              Añadir a Bodega
            </button>
          </form>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {data.wines.map(item => (
              <WineEditRow
                key={item.id}
                item={item}
                fetchData={fetchData}
                handleDelete={() => handleDeleteItem('wines', item.id, item.name)}
              />
            ))}
          </div>
        </div>
      );
    }

    if (activeSection === 'beverages') {
      return (
        <div className="space-y-12">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleAddItem(
                'beverages',
                newBeverage,
                () => setNewBeverage({ name: '', type: 'agua', price: '' }),
                'Bebida añadida'
              );
            }}
            className="bg-bg-surface/90 border border-text-main/10 p-8 grid grid-cols-1 md:grid-cols-4 gap-8 items-end shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

            <h3 className="col-span-full font-heading text-primary text-xl mb-4 flex items-center gap-3">
              <span className="w-1 h-6 bg-primary"></span>
              Añadir Bebida o Refresco
            </h3>

            <div className="md:col-span-2">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Nombre</label>
              <input
                required
                type="text"
                placeholder="Ej: Agua de Manantial 500ml..."
                value={newBeverage.name}
                onChange={e => setNewBeverage({ ...newBeverage, name: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Categoría</label>
              <select
                value={newBeverage.type}
                onChange={e => setNewBeverage({ ...newBeverage, type: e.target.value })}
                className="w-full bg-bg-surface border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none text-sm appearance-none cursor-pointer">
                <option value="agua">Agua</option>
                <option value="refresco">Refresco</option>
                <option value="cocktail">Cóctel</option>
                <option value="cafe">Café</option>
                <option value="infusion">Infusión</option>
              </select>
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Precio (€)</label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newBeverage.price}
                onChange={e => setNewBeverage({ ...newBeverage, price: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-white text-black font-bold uppercase tracking-[3px] text-[10px] transition-all p-3.5 md:col-span-4 lg:col-span-1 w-full shadow-[0_10px_20px_rgba(197,160,89,0.2)]">
              Confirmar
            </button>
          </form>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {data.beverages.map(item => (
              <BeverageEditRow
                key={item.id}
                item={item}
                fetchData={fetchData}
                handleDelete={() => handleDeleteItem('beverages', item.id, item.name)}
              />
            ))}
          </div>
        </div>
      );
    }

    if (activeSection === 'users') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {data.users?.length === 0 ? (
            <p className="text-text-muted">No hay usuarios registrados.</p>
          ) : (
            data.users?.map(u => <UserEditRow key={u.id} user={u} fetchData={fetchData} />)
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-screen bg-bg-body flex relative overflow-hidden">
      {/* Luz ambiental decorativa */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

      {/* Barra lateral (solo en desktop) */}
      <aside className="w-64 bg-bg-surface/90 backdrop-blur-xl border-r border-text-main/10 hidden md:flex flex-col relative z-20 shadow-[10px_0_30px_rgba(0,0,0,0.5)] flex-shrink-0">
        <div className="p-8 border-b border-text-main/10 flex flex-col items-center justify-center">
          <span className="text-primary text-2xl mb-2 opacity-80 block font-light">✦</span>
          <span className="text-text-main font-heading tracking-[0.2em] text-lg font-light text-center">
            DG <span className="italic text-primary">MGMT</span>
          </span>
        </div>

        <nav className="flex-grow py-6 px-4 space-y-1 overflow-y-auto">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-6 py-3.5 text-[10px] uppercase tracking-[4px] transition-all duration-300 relative group overflow-hidden ${
                activeSection === section.id ? 'text-black bg-primary' : 'text-text-muted hover:text-text-main'
              }`}>
              <div
                className={`absolute inset-0 w-0 bg-white/10 transition-all duration-[400ms] ease-out group-hover:w-full z-0 ${activeSection === section.id ? 'hidden' : ''}`}></div>
              <span className="relative z-10">{section.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-text-main/10">
          <button
            onClick={logout}
            className="w-full text-left px-6 py-4 text-[10px] uppercase tracking-[4px] text-red-400/70 hover:text-red-400 transition-colors group relative overflow-hidden">
            <div className="absolute inset-0 w-0 bg-red-900/10 transition-all duration-[400ms] ease-out group-hover:w-full z-0"></div>
            <span className="relative z-10">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
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
              className="text-[9px] uppercase tracking-[3px] text-red-400/60 hover:text-red-400 font-bold">
              Salir
            </button>
          </div>

          {/* Navegación móvil */}
          <div className="md:hidden flex gap-4 overflow-x-auto mb-6 pb-3 scrollbar-hide -mx-4 px-4 sticky top-0 bg-bg-body z-30">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`whitespace-nowrap uppercase tracking-[0.2em] text-[9px] py-2 px-3 rounded-full transition-all font-bold ${activeSection === s.id ? 'bg-primary text-black' : 'bg-text-main/5 text-text-muted hover:text-text-main'}`}>
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
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-text-main uppercase tracking-widest mb-3 font-light leading-none">
                  {sections.find(s => s.id === activeSection)?.label}
                </h1>
                <div className="w-12 h-[2px] bg-gradient-to-r from-primary to-transparent"></div>
              </div>
              <p className="text-text-muted font-light text-[10px] sm:text-[11px] tracking-wide max-w-xs md:text-right opacity-60">
                Gestión en tiempo real de los servicios vinculados a la base de datos.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Zona Scrollable de Contenido */}
        <div className="flex-grow overflow-y-auto px-4 md:px-12 pb-12 pt-2 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              variants={shouldReduceMotion ? undefined : sectionContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-full">
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// Componente para editar/ver un plato en la lista de admin
const DishEditRow = ({ item, fetchData, handleDelete, categories }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editDish, setEditDish] = useState({
    ...item,
    disponible: !!item.disponible,
    maximo_por_pedido: item.maximo_por_pedido || '',
    es_por_unidad: !!item.es_por_unidad,
  });

  const handleUpdate = async () => {
    try {
      const payload = { ...editDish };
      delete payload.categoria;
      delete payload.creado_a;
      delete payload.actualizado_a;

      await axios.put(`/admin/dishes/${item.id}`, payload);
      Swal.fire({ icon: 'success', title: 'Plato Actualizado', timer: 1500, showConfirmButton: false });
      setIsEditing(false);
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.mensaje || 'No se pudo actualizar' });
    }
  };

  if (isEditing) {
    return (
      <div className="bg-bg-surface border border-primary/30 p-10 flex flex-col gap-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative z-20 overflow-hidden h-full">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>

        <div className="flex justify-between items-start">
          <h4 className="text-primary font-heading text-2xl uppercase tracking-[0.1em]">Editando Plato</h4>
          <span className="text-[10px] text-text-muted font-bold tracking-[3px]">ID #{item.id}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div className="space-y-6">
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-3 font-bold opacity-70">Nombre del Manjar</label>
              <input
                type="text"
                value={editDish.nombre}
                onChange={e => setEditDish({ ...editDish, nombre: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-base focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-3 font-bold opacity-70">Precio (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editDish.precio}
                  onChange={e => setEditDish({ ...editDish, precio: e.target.value })}
                  className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all font-bold"
                />
              </div>
              <div>
                <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-3 font-bold opacity-70">Máx. Pedido</label>
                <input
                  type="number"
                  value={editDish.maximo_por_pedido || ''}
                  onChange={e => setEditDish({ ...editDish, maximo_por_pedido: e.target.value })}
                  className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
                  placeholder="Sin límite"
                />
              </div>
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-3 font-bold opacity-70">Descripción / Composición</label>
              <textarea
                value={editDish.descripcion || ''}
                onChange={e => setEditDish({ ...editDish, descripcion: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all min-h-[80px] resize-none"
                placeholder="¿Qué lleva este plato?"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-3 font-bold opacity-70">Categoría</label>
              <select
                value={editDish.categoria_menu_id}
                onChange={e => setEditDish({ ...editDish, categoria_menu_id: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm outline-none focus:border-primary appearance-none cursor-pointer">
                {categories?.map(c => (
                  <option key={c.id} value={c.id} className="bg-bg-surface">{c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-3 font-bold opacity-70">Alérgenos</label>
              <input
                type="text"
                value={editDish.alergenos || ''}
                onChange={e => setEditDish({ ...editDish, alergenos: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
                placeholder="Gluten, Lácteos..."
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-wrap gap-x-10 gap-y-6 pb-2 pt-8 border-t border-text-main/5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={editDish.es_por_unidad}
              onChange={e => setEditDish({ ...editDish, es_por_unidad: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-[11px] uppercase tracking-[1px] text-text-main/70 group-hover:text-primary transition-colors whitespace-nowrap">P/ Unidad</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={editDish.disponible_para_llevar}
              onChange={e => setEditDish({ ...editDish, disponible_para_llevar: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-[11px] uppercase tracking-[1px] text-text-main/70 group-hover:text-primary transition-colors whitespace-nowrap">Takeaway</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={editDish.disponible}
              onChange={e => setEditDish({ ...editDish, disponible: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-[11px] uppercase tracking-[1px] text-text-main/70 group-hover:text-primary transition-colors whitespace-nowrap">Disponible</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={editDish.visible_en_carta}
              onChange={e => setEditDish({ ...editDish, visible_en_carta: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-[11px] uppercase tracking-[1px] text-text-main/70 group-hover:text-primary transition-colors whitespace-nowrap">Ver en Carta</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={editDish.visible_en_degustacion}
              onChange={e => setEditDish({ ...editDish, visible_en_degustacion: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-[11px] uppercase tracking-[1px] text-text-main/70 group-hover:text-primary transition-colors whitespace-nowrap">Ver en Degustación</span>
          </label>
        </div>

        <div className="flex justify-end gap-8 mt-4 pt-6 border-t border-text-main/5">
          <button
            onClick={() => setIsEditing(false)}
            className="text-text-muted hover:text-text-main text-[11px] uppercase tracking-[3px] font-bold transition-colors">
            Descartar
          </button>
          <button
            onClick={handleUpdate}
            className="bg-primary hover:bg-white text-black px-12 py-4 font-bold text-[11px] uppercase tracking-[4px] transition-all shadow-[0_10px_20px_rgba(197,160,89,0.2)] hover:shadow-[0_15px_30px_rgba(197,160,89,0.4)]">
            Guardar Cambios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`group bg-bg-surface/90 border border-text-main/10 p-7 flex flex-col justify-between transition-all duration-500 relative overflow-hidden h-full hover:border-primary/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] ${!item.disponible ? 'opacity-80' : ''}`}>
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
              className="text-text-main hover:text-primary text-[10px] uppercase tracking-[2px] font-bold">
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500/50 hover:text-red-500 text-[10px] uppercase tracking-[2px] font-bold">
              Borrar
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
            <span className="text-text-main font-heading text-2xl">{parseFloat(item.precio).toFixed(2)}€</span>
            {!!item.es_por_unidad && <span className="text-text-muted text-[10px] uppercase tracking-widest ml-1">/ UD.</span>}
          </div>
          {!!item.maximo_por_pedido && (
            <p className="text-[9px] text-primary/60 uppercase tracking-[2px] mt-1 font-bold">
              Máx. {item.maximo_por_pedido} p/ pedido
            </p>
          )}
        </div>
        {item.alergenos && (
          <div className="flex flex-wrap gap-1 justify-end max-w-[120px]">
            {item.alergenos.split(',').map(a => (
              <span key={a} className="text-[8px] bg-text-main/5 text-text-muted px-2 py-0.5 uppercase tracking-tighter rounded-sm">
                {a.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para editar Menú Degustación
const TastingMenuEditRow = ({ item, fetchData, handleDelete, allAvailableDishes }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState({ ...item, platos: item.platos || [] });

  const handleUpdate = async () => {
    try {
      await axios.put(`/admin/tasting-menus/${item.id}`, edit);
      Swal.fire({ icon: 'success', title: 'Menú Actualizado', timer: 1500, showConfirmButton: false });
      setIsEditing(false);
      fetchData();
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar' });
    }
  };

  const addDishToMenu = dishId => {
    if (!dishId) return;
    const plato = allAvailableDishes.find(d => d.id === parseInt(dishId));
    if (!plato) return;

    setEdit({
      ...edit,
      platos: [...edit.platos, { ...plato, pivot: { numero_paso: edit.platos.length + 1, notas: '' } }],
    });
  };

  const removeDishFromMenu = index => {
    const newPlatos = [...edit.platos];
    newPlatos.splice(index, 1);
    setEdit({
      ...edit,
      platos: newPlatos,
    });
  };

  if (isEditing) {
    return (
      <div className="lg:col-span-2 bg-bg-surface border border-primary/30 p-10 flex flex-col gap-10 shadow-[0_40px_80px_rgba(0,0,0,0.4)] relative z-20 animate-in fade-in zoom-in-95 duration-500">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary shadow-[0_0_20px_rgba(197,160,89,0.3)]"></div>

        <div className="flex justify-between items-start">
          <h4 className="text-primary font-heading text-xl uppercase tracking-widest">Configurando Menú Degustación</h4>
          <span className="text-[10px] text-text-muted font-bold tracking-[3px]">ID #{item.id}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="group/field relative">
              <label className="text-primary text-[9px] uppercase tracking-[3px] block mb-2 font-bold transition-all group-focus-within/field:text-primary">Título del Menú</label>
              <input
                type="text"
                value={edit.nombre}
                onChange={e => setEdit({ ...edit, nombre: e.target.value })}
                className="w-full bg-text-main/5 border-b-2 border-text-main/10 text-text-main p-3 text-2xl font-heading focus:border-primary outline-none transition-all placeholder:opacity-30"
                placeholder="Nombre del menú..."
              />
            </div>
            <div className="group/field relative">
              <label className="text-primary text-[9px] uppercase tracking-[3px] block mb-2 font-bold transition-all group-focus-within/field:text-primary">Relato / Descripción</label>
              <textarea
                rows="4"
                value={edit.descripcion}
                onChange={e => setEdit({ ...edit, descripcion: e.target.value })}
                className="w-full bg-text-main/5 border-2 border-text-main/10 text-text-main p-4 text-sm focus:border-primary outline-none transition-all resize-none italic leading-relaxed"
                placeholder="Describa la experiencia gastronómica..."
              />
            </div>
          </div>

          <div className="space-y-10 bg-black/5 p-6 rounded-sm border border-text-main/5">
            <div className="space-y-8">
              <div className="group/field">
                <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold opacity-60">Precio Persona (€)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={edit.precio}
                    onChange={e => setEdit({ ...edit, precio: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-text-main/10 text-text-main p-2 text-2xl font-heading focus:border-primary outline-none transition-all"
                  />
                  <span className="absolute right-0 bottom-2 text-text-muted opacity-30 font-heading text-xl">€</span>
                </div>
              </div>
              <div className="group/field">
                <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold opacity-60">Número de Pasos</label>
                <input
                  type="number"
                  value={edit.pasos}
                  onChange={e => setEdit({ ...edit, pasos: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-text-main/10 text-text-main p-2 text-lg focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-text-main/5 space-y-8">
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="mt-0.5">
                  <div className={`w-5 h-5 border-2 flex items-center justify-center transition-all ${edit._hasMaridaje || !!edit.precio_maridaje ? 'bg-primary border-primary' : 'bg-transparent border-text-main/20'}`}>
                    { (edit._hasMaridaje || !!edit.precio_maridaje) && <div className="w-2 h-2 bg-white rounded-full"></div> }
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={edit._hasMaridaje || !!edit.precio_maridaje}
                      onChange={e => {
                        const hasM = e.target.checked;
                        setEdit({ ...edit, _hasMaridaje: hasM, precio_maridaje: hasM ? (edit.precio_maridaje || 0) : null });
                      }}
                    />
                  </div>
                </div>
                <span className={`text-[10px] uppercase tracking-[2px] font-bold leading-tight transition-colors ${edit._hasMaridaje || !!edit.precio_maridaje ? 'text-primary' : 'text-text-muted group-hover:text-text-main'}`}>
                  Maridaje opcional
                </span>
              </label>

              <div className="space-y-6">
                <div>
                  <label className="text-text-muted text-[9px] uppercase tracking-[2px] block mb-2 font-bold opacity-60">Duración (min)</label>
                  <input
                    type="number"
                    value={edit.duracion_estimada_minutos || 60}
                    onChange={e => setEdit({ ...edit, duracion_estimada_minutos: e.target.value })}
                    className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 text-sm focus:border-primary outline-none transition-all font-bold"
                  />
                </div>
                {!!(edit._hasMaridaje || edit.precio_maridaje) && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-primary text-[9px] uppercase tracking-[2px] block mb-2 font-bold opacity-80">Precio Maridaje (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={edit.precio_maridaje || ''}
                      onChange={e => setEdit({ ...edit, precio_maridaje: e.target.value })}
                      className="w-full bg-transparent border-b-2 border-primary/20 text-primary p-2 text-xl font-heading focus:border-primary outline-none transition-all font-bold"
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
              <h5 className="text-text-main text-[12px] uppercase tracking-[4px] font-bold">Secuencia de Pases</h5>
            </div>

            <div className="relative w-full sm:max-w-md">
              <select
                value=""
                onChange={e => {
                  addDishToMenu(e.target.value);
                  e.target.value = "";
                }}
                className="w-full bg-primary/5 hover:bg-primary/10 border-2 border-primary/20 text-primary text-[10px] p-3 px-5 outline-none focus:border-primary transition-all appearance-none cursor-pointer uppercase tracking-[3px] font-bold">
                <option value="" className="bg-bg-surface text-text-muted">+ Añadir pase al menú</option>
                {allAvailableDishes.map(d => (
                  <option key={d.id} value={d.id} className="bg-bg-surface text-text-main font-sans">{d.nombre} — {d.categoria?.nombre}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/50">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                className="bg-white/40 backdrop-blur-sm p-5 group/item hover:bg-white/60 transition-all border border-text-main/5 hover:border-primary/30 shadow-sm hover:shadow-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/10 group-hover/item:bg-primary transition-colors"></div>

                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-4">
                    <span className="text-primary font-heading text-2xl opacity-20 w-8 tabular-nums">{(idx + 1).toString().padStart(2, '0')}</span>
                    <div className="w-[2px] h-8 bg-text-main/5"></div>
                  </div>

                  <div className="flex-grow min-w-[200px]">
                    <p className="text-text-main text-[11px] uppercase tracking-[2px] font-bold mb-1 opacity-50">{plato.categoria?.nombre}</p>
                    <p className="text-text-main text-base font-heading tracking-wide uppercase">{plato.nombre}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-8 ml-auto">
                    <div className="w-16">
                      <label className="text-[7px] uppercase text-text-muted block mb-1 tracking-[2px] font-bold opacity-60">Pase №</label>
                      <input
                        type="number"
                        value={plato.pivot?.numero_paso || idx + 1}
                        onChange={e => {
                          const newPlatos = [...edit.platos];
                          newPlatos[idx] = { ...plato, pivot: { ...plato.pivot, numero_paso: e.target.value } };
                          setEdit({ ...edit, platos: newPlatos });
                        }}
                        className="bg-transparent border-b-2 border-text-main/10 text-text-main text-sm w-full outline-none focus:border-primary pb-1 font-bold transition-colors text-center"
                      />
                    </div>
                    <div className="min-w-[240px]">
                      <label className="text-[7px] uppercase text-text-muted block mb-1 tracking-[2px] font-bold opacity-60">Anotación del Chef</label>
                      <input
                        type="text"
                        placeholder="Nota especial..."
                        value={plato.pivot?.notas || ''}
                        onChange={e => {
                          const newPlatos = [...edit.platos];
                          newPlatos[idx] = { ...plato, pivot: { ...plato.pivot, notas: e.target.value } };
                          setEdit({ ...edit, platos: newPlatos });
                        }}
                        className="bg-transparent border-b-2 border-text-main/10 text-text-main text-xs w-full outline-none focus:border-primary pb-1 italic transition-colors"
                      />
                    </div>
                    <button
                      onClick={() => removeDishFromMenu(idx)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500/5 text-red-500/40 hover:bg-red-500 hover:text-white transition-all">
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
            className="text-text-muted hover:text-text-main text-[11px] uppercase tracking-[3px] font-bold transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleUpdate}
            className="bg-primary hover:bg-white text-black px-12 py-4 font-bold text-[11px] uppercase tracking-[4px] transition-all shadow-[0_15px_30px_rgba(197,160,89,0.2)]">
            Guardar Configuración
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white border border-text-main/5 p-10 flex flex-col lg:flex-row gap-10 transition-all duration-700 relative overflow-hidden h-full hover:border-primary/30 hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)]">
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-primary/10 transition-all duration-1000"></div>

      <div className="flex-grow flex flex-col justify-between lg:w-2/3">
        <div>
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-[4px] font-bold px-4 py-1.5 rounded-full">
                {item.pasos} Pasos
              </span>
              <span className="w-1 h-1 bg-text-main/20 rounded-full"></span>
              <span className="text-text-muted text-[10px] uppercase tracking-[4px] font-medium opacity-60">Gastronomía</span>
            </div>
          </div>

          <h4 className="text-text-main font-heading text-5xl mb-8 leading-tight group-hover:text-primary transition-colors duration-700">{item.nombre}</h4>

          <div className="relative mb-10">
            <p className="text-text-muted text-lg font-light italic leading-relaxed border-l-4 border-primary/20 pl-8 opacity-80 line-clamp-3">
              "{item.descripcion}"
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mb-10 min-h-[44px]">
            {item.platos?.slice(0, 6).map(d => (
              <span key={d.id} className="text-[11px] bg-bg-body text-text-main/60 px-4 py-2 uppercase tracking-[2px] border border-text-main/5 font-medium hover:border-primary/30 hover:text-primary transition-all cursor-default">
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
              <span className="text-text-muted text-[10px] uppercase tracking-[3px] mb-3 font-bold opacity-30">Menú Completo</span>
              <div className="flex items-baseline gap-2">
                <span className="text-text-main font-heading text-5xl leading-none">{parseFloat(item.precio).toFixed(0)}</span>
                <span className="text-text-main font-heading text-2xl opacity-40">€</span>
              </div>
            </div>
            {!!item.precio_maridaje && (
              <div className="flex flex-col relative pl-12">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-10 bg-text-main/10"></div>
                <span className="text-primary text-[10px] uppercase tracking-[3px] mb-3 font-bold">Maridaje sugerido</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-primary font-heading text-3xl leading-none">+{parseFloat(item.precio_maridaje).toFixed(0)}</span>
                  <span className="text-primary font-heading text-lg opacity-40">€</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:w-1/3 flex flex-col justify-between items-end border-l border-text-main/5 lg:pl-10 pt-8 lg:pt-0">
        <div className="flex flex-col gap-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 transform translate-x-0 md:translate-x-4 md:group-hover:translate-x-0 w-full">
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-text-main text-white hover:bg-primary px-6 py-4 text-[11px] uppercase tracking-[4px] font-bold transition-all shadow-xl flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            Gestionar Menú
          </button>
          <button
            onClick={handleDelete}
            className="w-full border border-red-500/20 text-red-500/50 hover:bg-red-500 hover:text-white px-6 py-4 text-[11px] uppercase tracking-[4px] font-bold transition-all">
            Eliminar Registro
          </button>
        </div>

        <div className="text-right flex flex-col items-end w-full mt-auto pb-4">
          <span className="text-text-muted text-[11px] uppercase tracking-[5px] opacity-40 block mb-4 font-bold">Reserva Exclusiva</span>
          <div className="w-20 h-[3px] bg-primary/20 group-hover:w-full transition-all duration-1000 group-hover:bg-primary"></div>
        </div>
      </div>
    </div>
  );
};

// Componente para editar Vino
const WineEditRow = ({ item, fetchData, handleDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState({ ...item });

  const handleUpdate = async () => {
    try {
      const payload = { ...edit };
      delete payload.creado_a;
      delete payload.actualizado_a;

      await axios.put(`/admin/wines/${item.id}`, payload);
      Swal.fire({ icon: 'success', title: 'Vino Actualizado', timer: 1500, showConfirmButton: false });
      setIsEditing(false);
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.mensaje || 'No se pudo actualizar' });
    }
  };

  if (isEditing) {
    return (
      <div className="bg-bg-surface border border-primary/30 p-8 flex flex-col gap-8 shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative z-20">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>

        <div className="flex justify-between items-start">
          <h4 className="text-primary font-heading text-xl uppercase tracking-widest">Editando Bodega</h4>
          <span className="text-[10px] text-text-muted font-bold tracking-[3px]">BOTELLA #{item.id}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Nombre del Caldo</label>
              <input
                type="text"
                value={edit.nombre}
                onChange={e => setEdit({ ...edit, nombre: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
              />
            </div>

          </div>

          <div className="space-y-4">
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Notas de Cata / Maridaje</label>
              <textarea
                rows="3"
                value={edit.notas_maridaje || ''}
                onChange={e => setEdit({ ...edit, notas_maridaje: e.target.value })}
                className="w-full bg-text-main/5 border border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all resize-none italic"
              />
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4 border-t border-text-main/5">
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Tipo de Vino</label>
              <select
                value={edit.tipo}
                onChange={e => setEdit({ ...edit, tipo: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm outline-none focus:border-primary appearance-none cursor-pointer">
                <option value="Tinto" className="bg-bg-surface">Tinto</option>
                <option value="Blanco" className="bg-bg-surface">Blanco</option>
                <option value="Rosado" className="bg-bg-surface">Rosado</option>
                <option value="Espumoso" className="bg-bg-surface">Espumoso</option>
                <option value="Dulce" className="bg-bg-surface">Dulce</option>
              </select>
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Región</label>
              <input
                type="text"
                value={edit.region || ''}
                onChange={e => setEdit({ ...edit, region: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Uva</label>
              <input
                type="text"
                value={edit.uva || ''}
                onChange={e => setEdit({ ...edit, uva: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
              />
            </div>

          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-6 items-end pt-4 border-t border-text-main/5">
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">P. Botella (€)</label>
              <input
                type="number"
                step="0.01"
                value={edit.precio_botella}
                onChange={e => setEdit({ ...edit, precio_botella: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all font-bold"
              />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">P. Copa (€)</label>
              <input
                type="number"
                step="0.01"
                value={edit.precio_copa || ''}
                onChange={e => setEdit({ ...edit, precio_copa: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
                placeholder="Opcional"
              />
            </div>
            <div className="flex flex-col gap-3 pb-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={edit.destacado}
                  onChange={e => setEdit({ ...edit, destacado: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[11px] uppercase tracking-[1px] text-text-main/70 group-hover:text-primary transition-colors">Destacado</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={edit.disponible}
                  onChange={e => setEdit({ ...edit, disponible: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[11px] uppercase tracking-[1px] text-text-main/70 group-hover:text-primary transition-colors">Disponible</span>
              </label>
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Máx. Pedido</label>
              <input
                type="number"
                value={edit.maximo_por_pedido || ''}
                onChange={e => setEdit({ ...edit, maximo_por_pedido: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
                placeholder="Sin límite"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-8 mt-4">
          <button
            onClick={() => setIsEditing(false)}
            className="text-text-muted hover:text-text-main text-[11px] uppercase tracking-[3px] font-bold transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleUpdate}
            className="bg-primary hover:bg-white text-black px-10 py-3.5 font-bold text-[11px] uppercase tracking-[4px] transition-all shadow-[0_10px_20px_rgba(197,160,89,0.2)]">
            Guardar Cambios
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
            <button onClick={() => setIsEditing(true)} className="text-text-main hover:text-primary text-[10px] uppercase tracking-[2px] font-bold">Editar</button>
            <button onClick={handleDelete} className="text-red-500/50 hover:text-red-500 text-[10px] uppercase tracking-[2px] font-bold">Borrar</button>
          </div>
        </div>

        <h4 className="text-text-main font-heading text-2xl mb-1 leading-tight group-hover:text-primary transition-colors">{item.nombre}</h4>
        <p className="text-text-muted text-[10px] uppercase tracking-[2px] mb-4 font-bold opacity-50">{item.bodega}</p>

        {item.notas_maridaje && (
          <p className="text-text-muted text-sm font-light italic leading-relaxed mb-8 opacity-70 line-clamp-2">
            "{item.notas_maridaje}"
          </p>
        )}
      </div>

      <div className="pt-6 border-t border-text-main/5 flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-text-main font-heading text-xl">{parseFloat(item.precio_botella).toFixed(2)}€</span>
            <span className="text-text-muted text-[8px] uppercase tracking-widest ml-1 opacity-50">Botella</span>
          </div>
          {item.precio_copa && (
            <div className="flex items-baseline gap-1">
              <span className="text-text-main font-heading text-lg opacity-80">{parseFloat(item.precio_copa).toFixed(2)}€</span>
              <span className="text-text-muted text-[8px] uppercase tracking-widest ml-1 opacity-50">Copa</span>
            </div>
          )}
        </div>
        {item.maximo_por_pedido && (
          <div className="text-right">
            <p className="text-[9px] text-primary/60 uppercase tracking-[2px] font-bold">Máx. {item.maximo_por_pedido}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para editar Bebida
const BeverageEditRow = ({ item, fetchData, handleDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState({ ...item });

  const handleUpdate = async () => {
    try {
      await axios.put(`/admin/beverages/${item.id}`, edit);
      Swal.fire({ icon: 'success', title: 'Bebida Actualizada', timer: 1500, showConfirmButton: false });
      setIsEditing(false);
      fetchData();
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar' });
    }
  };

  if (isEditing) {
    return (
      <div className="bg-bg-surface border border-primary/30 p-8 flex flex-col gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Nombre</label>
            <input
              type="text"
              value={edit.nombre}
              onChange={e => setEdit({ ...edit, nombre: e.target.value })}
              className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Precio (€)</label>
            <input
              type="number"
              step="0.01"
              value={edit.precio}
              onChange={e => setEdit({ ...edit, precio: e.target.value })}
              className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all font-bold"
            />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Tipo</label>
            <select
              value={edit.tipo}
              onChange={e => setEdit({ ...edit, tipo: e.target.value })}
              className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none appearance-none cursor-pointer">
              <option value="agua">Agua</option>
              <option value="refresco">Refresco</option>
              <option value="cocktail">Cóctel</option>
              <option value="cafe">Café</option>
            </select>
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Descripción</label>
            <input
              type="text"
              value={edit.descripcion || ''}
              onChange={e => setEdit({ ...edit, descripcion: e.target.value })}
              className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all italic"
              placeholder="Ej: Con gas, sin cafeína..."
            />
          </div>
          <div className="flex items-center gap-6 pb-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={edit.destacado}
                onChange={e => setEdit({ ...edit, destacado: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-[10px] uppercase tracking-widest text-text-muted group-hover:text-primary transition-colors">Destacado</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={edit.disponible}
                onChange={e => setEdit({ ...edit, disponible: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-[10px] uppercase tracking-widest text-text-muted group-hover:text-primary transition-colors">Disponible</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-8 pt-4 border-t border-text-main/5">
          <button onClick={() => setIsEditing(false)} className="text-text-muted hover:text-text-main text-[11px] uppercase tracking-[3px] font-bold transition-colors">Cancelar</button>
          <button onClick={handleUpdate} className="bg-primary hover:bg-white text-black px-10 py-3.5 font-bold text-[11px] uppercase tracking-[4px] transition-all shadow-[0_10px_20px_rgba(197,160,89,0.2)]">Guardar Cambios</button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-bg-surface/90 border border-text-main/10 p-7 flex flex-col justify-between transition-all duration-500 relative overflow-hidden h-full hover:border-primary/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
      <div>
        <div className="flex justify-between items-start mb-6">
          <span className="text-primary text-[10px] uppercase tracking-[4px] font-bold opacity-60 group-hover:opacity-100 transition-opacity">{item.tipo}</span>
          <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button onClick={() => setIsEditing(true)} className="text-text-main hover:text-primary text-[10px] uppercase tracking-[2px] font-bold">Editar</button>
            <button onClick={handleDelete} className="text-red-500/50 hover:text-red-500 text-[10px] uppercase tracking-[2px] font-bold">Borrar</button>
          </div>
        </div>
        <h4 className="text-text-main font-heading text-2xl mb-2 leading-tight group-hover:text-primary transition-colors">{item.nombre}</h4>
        {item.descripcion && <p className="text-text-muted text-sm font-light italic leading-relaxed opacity-70 mb-4">"{item.descripcion}"</p>}
      </div>
      <div className="pt-6 border-t border-text-main/5 flex justify-between items-end">
        <span className="text-text-main font-heading text-2xl">{parseFloat(item.precio).toFixed(2)}€</span>
        <div className="w-8 h-[1px] bg-primary/20 group-hover:w-12 transition-all"></div>
      </div>
    </div>
  );
};

// Componente para editar/ver un usuario en la lista de admin
const UserEditRow = ({ user, fetchData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState({ nombre: user.nombre, rol: user.rol, email: user.email, telefono: user.telefono || '', contrasena: '' });

  const handleUpdate = async () => {
    try {
      await axios.put(`/admin/users/${user.id}`, editUser);
      Swal.fire({ icon: 'success', title: 'Usuario Actualizado', timer: 1500, showConfirmButton: false });
      setIsEditing(false);
      fetchData();
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar' });
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: `Opciones de Eliminación`,
      text: `¿Seguro que quiere eliminar permanentemente a ${user.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Eliminar Usuario',
      cancelButtonText: 'Cancelar',
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
      <div className="bg-bg-surface border border-primary/30 p-8 flex flex-col gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Nombre Completo</label>
            <input
              type="text"
              value={editUser.nombre}
              onChange={e => setEditUser({ ...editUser, nombre: e.target.value })}
              className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Correo Electrónico</label>
            <input
              type="email"
              value={editUser.email}
              onChange={e => setEditUser({ ...editUser, email: e.target.value })}
              className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Teléfono de Contacto</label>
            <input
              type="text"
              value={editUser.telefono}
              onChange={e => setEditUser({ ...editUser, telefono: e.target.value })}
              className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Rol de Acceso</label>
            <select
              value={editUser.rol}
              onChange={e => setEditUser({ ...editUser, rol: e.target.value })}
              className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm outline-none focus:border-primary appearance-none cursor-pointer">
              <option value="Cliente">Cliente</option>
              <option value="Staff">Staff</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Actualizar Contraseña (Opcional)</label>
            <input
              type="password"
              placeholder="Dejar en blanco para mantener..."
              value={editUser.contrasena}
              onChange={e => setEditUser({ ...editUser, contrasena: e.target.value })}
              className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
            />
          </div>
        </div>
        <div className="flex justify-end gap-8 pt-4 border-t border-text-main/5">
          <button onClick={() => setIsEditing(false)} className="text-text-muted hover:text-text-main text-[11px] uppercase tracking-[3px] font-bold transition-colors">Cerrar</button>
          <button onClick={handleUpdate} className="bg-primary hover:bg-white text-black px-10 py-3.5 font-bold text-[11px] uppercase tracking-[4px] transition-all shadow-[0_10px_20px_rgba(197,160,89,0.2)]">Guardar Cambios</button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-bg-surface/90 border border-text-main/10 p-7 flex flex-col md:flex-row justify-between items-center transition-all duration-500 relative overflow-hidden hover:border-primary/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-heading text-xl ${user.rol === 'Administrador' ? 'bg-primary text-black shadow-[0_0_20px_rgba(197,160,89,0.3)]' : 'bg-text-main/5 text-text-muted'}`}>
          {user.nombre.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h4 className="text-text-main font-heading text-xl">{user.nombre}</h4>
            <span className={`text-[8px] uppercase tracking-[2px] px-2 py-0.5 rounded-sm font-bold ${user.rol === 'Administrador' ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-text-main/10 text-text-muted border border-text-main/10'}`}>
              {user.rol === 'Administrador' ? 'Administrador' : 'Cliente'}
            </span>
          </div>
          <p className="text-text-muted text-xs font-light tracking-wide">{user.email} {user.telefono && `• ${user.telefono}`}</p>
        </div>
      </div>
      <div className="flex gap-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all transform translate-x-0 md:translate-x-4 md:group-hover:translate-x-0 mt-6 md:mt-0 w-full md:w-auto border-t md:border-t-0 border-text-main/5 pt-4 md:pt-0">
        <button onClick={() => setIsEditing(true)} className="text-text-main hover:text-primary text-[10px] uppercase tracking-[2px] font-bold">Editar Perfil</button>
        {user.id !== 1 && (
          <button onClick={handleDelete} className="text-red-500/50 hover:text-red-500 text-[10px] uppercase tracking-[2px] font-bold">Eliminar</button>
        )}
      </div>
    </div>
  );
};

export default AdminView;
