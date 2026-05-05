import { useAuthStore } from '@/store/auth';
import { useState, useEffect, useCallback } from 'react';
import axios from '@/services/api';
import Swal from 'sweetalert2';
import { AnimatePresence, useReducedMotion, FadeIn, motion } from '@/motion';
import { DURATION, EASING } from '@/motion';

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
    name: '',
    description: '',
    price: '',
    menu_category_id: '',
    image: '',
    allergens: '',
    is_signature: false,
    available: true,
  });
  const [newWine, setNewWine] = useState({
    name: '',
    winery: '',
    type: 'Red',
    price_bottle: '',
    vintage: '',
    pairing_notes: '',
  });
  const [newBeverage, setNewBeverage] = useState({ name: '', type: 'agua', price: '', description: '' });
  const [newTastingMenu, setNewTastingMenu] = useState({ name: '', description: '', price: '', courses: 1 });

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
        setData(d => ({ ...d, menu: res.data.dishes || [], categories: res.data.categories || [] }));
        if (res.data.categories?.length > 0 && !newDish.menu_category_id) {
          setNewDish(prev => ({ ...prev, menu_category_id: res.data.categories[0].id }));
        }
      } else if (activeSection === 'wines') {
        const res = await axios.get('/admin/wines');
        setData(d => ({ ...d, wines: res.data }));
      } else if (activeSection === 'beverages') {
        const res = await axios.get('/admin/beverages');
        setData(d => ({ ...d, beverages: res.data }));
      } else if (activeSection === 'tasting_menus') {
        const [menusRes, dishesRes] = await Promise.all([axios.get('/admin/tasting-menus'), axios.get('/dishes')]);
        setData(d => ({
          ...d,
          tasting_menus: menusRes.data,
          menu: dishesRes.data.dishes || [],
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
  }, [activeSection, newDish.menu_category_id]);

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
      const activeOrders = data.orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
      const finishedOrders = data.orders.filter(o => ['delivered', 'cancelled'].includes(o.status));

      const renderOrderCard = order => (
        <div
          key={order.id}
          className={`bg-bg-surface/90 border p-5 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
            order.status === 'received'
              ? 'border-primary/50 shadow-[0_0_20px_rgba(197,160,89,0.1)]'
              : order.status === 'cancelled'
                ? 'border-red-500/20 opacity-60 grayscale-[0.5]'
                : 'border-text-main/5 hover:border-text-main/20'
          }`}>
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-primary text-[9px] uppercase tracking-[3px] font-bold">Pedido #{order.id}</span>
                {order.pickup_time && (
                  <span className="bg-primary/10 text-primary text-[9px] px-2 py-0.5 rounded-full font-bold">
                    RECOGIDA: {new Date(order.pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              <div
                className={`w-2 h-2 rounded-full ${
                  order.status === 'received'
                    ? 'bg-blue-500 animate-pulse'
                    : order.status === 'preparing'
                      ? 'bg-amber-500'
                      : order.status === 'ready'
                        ? 'bg-green-500'
                        : order.status === 'cancelled'
                          ? 'bg-red-500'
                          : 'bg-text-muted/30'
                }`}></div>
            </div>
            <p className="text-text-main font-heading text-lg mb-1">{order.user?.name || `ID: ${order.user_id}`}</p>
            <p className="text-text-muted text-[11px] mb-4 opacity-70">Total: {parseFloat(order.total).toFixed(2)}€</p>

            <div className="bg-black/5 p-3 rounded-sm border border-text-main/5">
              <p className="text-text-main text-[11px] font-light leading-relaxed italic opacity-80">
                {order.items?.map(i => `${i.quantity}x ${i.item_name}`).join(', ')}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-text-main/5">
            <span className="text-[10px] uppercase tracking-widest text-text-muted">Logística</span>
            <select
              value={order.status}
              onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
              className="bg-bg-surface border border-text-main/10 text-text-main rounded p-1.5 pr-8 text-[11px] uppercase tracking-widest outline-none">
              <option value="received">Recibido</option>
              <option value="preparing">Preparando</option>
              <option value="ready">Listo para Recogida</option>
              <option value="delivered">Entregado</option>
              <option value="cancelled">Cancelado</option>
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
                <span className="bg-primary/10 text-primary px-3 py-1 text-[10px] rounded-full font-bold">
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
      const pending = data.reservations.filter(r => r.status === 'pending');
      const confirmed = data.reservations.filter(r => r.status === 'confirmed');
      const cancelled = data.reservations.filter(r => r.status === 'cancelled');

      const renderCard = res => (
        <div
          key={res.id}
          className={`bg-bg-surface/90 border p-5 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
            res.status === 'pending'
              ? 'border-primary/50 shadow-[0_0_20px_rgba(197,160,89,0.1)]'
              : 'border-text-main/5 hover:border-text-main/20'
          }`}>
          {res.status === 'pending' && (
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl -mr-8 -mt-8"></div>
          )}

          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-primary text-[9px] uppercase tracking-[3px] font-bold">Reserva #{res.id}</span>
              <div
                className={`w-2 h-2 rounded-full ${
                  res.status === 'pending' ? 'bg-primary animate-pulse' : res.status === 'confirmed' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
            </div>
            <p className="text-text-main font-heading text-lg mb-1">{res.user?.name || `ID: ${res.user_id}`}</p>
            <p className="text-text-muted text-[11px] mb-4 opacity-70">
              Registrado: {new Date(res.created_at).toLocaleDateString()}
            </p>

            <div className="space-y-2 bg-black/5 p-3 rounded-sm border border-text-main/5">
              <div className="flex items-center gap-3">
                <span className="text-text-main text-xs font-bold uppercase tracking-widest opacity-40">FECHA:</span>
                <span className="text-text-main text-sm font-light">
                  {new Date(res.reservation_time).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-text-main text-xs font-bold uppercase tracking-widest opacity-40">COMENSALES:</span>
                <span className="text-text-main text-sm font-light">{res.people} comensales</span>
              </div>
              <div className="flex items-center gap-3 mt-2 pt-2 border-t border-text-main/5">
                <span className="text-primary text-[10px] font-bold uppercase tracking-widest">MESA:</span>
                <input
                  type="text"
                  placeholder="Sin asignar"
                  defaultValue={res.table_number || ''}
                  onBlur={e => handleUpdateReservation(res.id, { table_number: e.target.value })}
                  className="bg-transparent border-0 border-b border-primary/20 text-text-main text-xs p-0 focus:ring-0 focus:border-primary transition-all w-full placeholder:text-text-muted/30"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-text-main/5">
            <span className="text-[10px] uppercase tracking-widest text-text-muted">Estado</span>
            <select
              value={res.status}
              onChange={e => handleUpdateReservation(res.id, { status: e.target.value })}
              className={`bg-bg-surface border border-text-main/10 text-text-main rounded p-1.5 pr-8 text-[11px] uppercase tracking-widest outline-none transition-all ${
                res.status === 'pending' ? 'border-primary/40 text-primary' : ''
              }`}>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="cancelled">Cancelada</option>
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
                    name: '',
                    description: '',
                    price: '',
                    menu_category_id: data.categories[0]?.id || '',
                    allergens: '',
                    available: true,
                    max_per_order: '',
                    is_per_unit: false,
                  }),
                'Plato añadido'
              );
            }}
            className="bg-bg-surface/90 border border-text-main/10 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-end shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

            <h3 className="col-span-full font-heading text-primary text-xl mb-2 flex items-center gap-3">
              <span className="w-1 h-6 bg-primary"></span>
              Añadir Nuevo Plato a la Carta
            </h3>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Nombre del Plato
              </label>
              <input
                required
                type="text"
                placeholder="Ej: Ostras al Carbón..."
                value={newDish.name}
                onChange={e => setNewDish({ ...newDish, name: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Categoría</label>
              <select
                required
                value={newDish.menu_category_id}
                onChange={e => setNewDish({ ...newDish, menu_category_id: e.target.value })}
                className="w-full bg-bg-surface border-b border-text-main/10 text-text-main p-1.5 pr-8 focus:border-primary outline-none text-sm cursor-pointer appearance-none">
                <option value="" disabled>
                  Seleccionar...
                </option>
                {data.categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Precio (€)</label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newDish.price}
                onChange={e => setNewDish({ ...newDish, price: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Descripción / Historia
              </label>
              <input
                required
                type="text"
                placeholder="Breve historia o ingredientes clave..."
                value={newDish.description}
                onChange={e => setNewDish({ ...newDish, description: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">
                Alérgenos (separados por coma)
              </label>
              <input
                type="text"
                placeholder="Gluten, Lácteos..."
                value={newDish.allergens}
                onChange={e => setNewDish({ ...newDish, allergens: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Máx. por Pedido</label>
              <input
                type="number"
                placeholder="Sin límite"
                value={newDish.max_per_order}
                onChange={e => setNewDish({ ...newDish, max_per_order: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-6 pb-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={newDish.is_per_unit}
                  onChange={e => setNewDish({ ...newDish, is_per_unit: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[10px] uppercase tracking-widest text-text-muted group-hover:text-primary transition-colors">
                  Precio por Unidad
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={newDish.available}
                  onChange={e => setNewDish({ ...newDish, available: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[10px] uppercase tracking-widest text-text-muted group-hover:text-primary transition-colors">
                  Disponible
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-bg-surface text-black font-bold uppercase tracking-[3px] text-[10px] transition-all p-3.5 w-full shadow-[0_10px_20px_rgba(197,160,89,0.2)] hover:shadow-[0_15px_30px_rgba(197,160,89,0.4)] md:col-span-3 lg:col-span-1">
              Confirmar Alta
            </button>
          </form>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {data.menu.map(item => (
              <DishEditRow
                key={item.id}
                item={item}
                fetchData={fetchData}
                handleDelete={() => handleDeleteItem('dishes', item.id, item.name)}
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
                () => setNewTastingMenu({ name: '', description: '', price: '', courses: 1 }),
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
                value={newTastingMenu.name}
                onChange={e => setNewTastingMenu({ ...newTastingMenu, name: e.target.value })}
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
                value={newTastingMenu.price}
                onChange={e => setNewTastingMenu({ ...newTastingMenu, price: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Nº de Pasos</label>
              <input
                required
                type="number"
                placeholder="7"
                value={newTastingMenu.courses}
                onChange={e => setNewTastingMenu({ ...newTastingMenu, courses: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>
            <div className="md:col-span-3">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Descripción General / Relato</label>
              <input
                required
                type="text"
                placeholder="Un viaje por los sabores de la tierra..."
                value={newTastingMenu.description}
                onChange={e => setNewTastingMenu({ ...newTastingMenu, description: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-white text-black font-bold uppercase tracking-[3px] text-[10px] transition-all p-3.5 w-full shadow-[0_10px_20px_rgba(197,160,89,0.2)] hover:shadow-[0_15px_30px_rgba(197,160,89,0.4)]">
              Dar de Alta
            </button>
          </form>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {data.tasting_menus.map(item => (
              <TastingMenuEditRow
                key={item.id}
                item={item}
                fetchData={fetchData}
                handleDelete={() => handleDeleteItem('tasting-menus', item.id, item.name)}
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
                () => setNewWine({ name: '', winery: '', type: 'Red', price_bottle: '' }),
                'Vino añadido'
              );
            }}
            className="bg-bg-surface/90 border border-text-main/10 p-8 grid grid-cols-1 md:grid-cols-4 gap-8 items-end shadow-2xl relative overflow-hidden">
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
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Bodega / D.O.</label>
              <input
                type="text"
                placeholder="Ribera del Duero..."
                value={newWine.winery}
                onChange={e => setNewWine({ ...newWine, winery: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors font-bold"
              />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Tipo</label>
              <select
                value={newWine.type}
                onChange={e => setNewWine({ ...newWine, type: e.target.value })}
                className="w-full bg-bg-surface border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none text-sm appearance-none cursor-pointer">
                <option value="Red">Tinto</option>
                <option value="White">Blanco</option>
                <option value="Rose">Rosado</option>
                <option value="Sparkling">Espumoso</option>
                <option value="Sweet">Dulce</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2 font-bold">Precio Botella (€)</label>
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
        <div className="p-6 md:p-12 pb-4 md:pb-6 flex-shrink-0 border-b md:border-b-0 border-text-main/5">
          {/* Cabecera móvil */}
          <div className="flex md:hidden justify-between items-center mb-8 pb-4">
            <span className="text-text-main font-heading tracking-[0.2em]">
              <span className="text-primary mr-2">✦</span> DG MGMT
            </span>
            <button
              onClick={logout}
              className="text-[10px] uppercase tracking-[3px] text-red-400/70 hover:text-red-400">
              Salir
            </button>
          </div>

          {/* Navegación móvil */}
          <div className="md:hidden flex gap-4 overflow-x-auto mb-6 pb-2 scrollbar-hide">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`whitespace-nowrap uppercase tracking-widest text-[10px] pb-2 border-b-2 transition-all ${activeSection === s.id ? 'border-primary text-primary' : 'border-transparent text-text-muted'}`}>
                {s.label}
              </button>
            ))}
          </div>

          <FadeIn as="header">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="block text-primary text-[9px] uppercase tracking-[5px] mb-2 font-body opacity-90">
                  Panel de Control Central
                </span>
                <h1 className="text-3xl md:text-4xl font-heading text-text-main uppercase tracking-widest mb-2 font-light leading-none">
                  {sections.find(s => s.id === activeSection)?.label}
                </h1>
                <div className="w-12 h-[1px] bg-gradient-to-r from-primary to-transparent"></div>
              </div>
              <p className="text-text-muted font-light text-[11px] tracking-wide max-w-xs md:text-right">
                Gestión en tiempo real de los servicios vinculados a la base de datos.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Zona Scrollable de Contenido */}
        <div className="flex-grow overflow-y-auto px-6 md:px-12 pb-12 pt-2 custom-scrollbar">
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
    available: !!item.available,
    max_per_order: item.max_per_order || '',
    is_per_unit: !!item.is_per_unit,
  });

  const handleUpdate = async () => {
    try {
      const payload = { ...editDish };
      delete payload.category;
      delete payload.created_at;
      delete payload.updated_at;

      await axios.put(`/admin/dishes/${item.id}`, payload);
      Swal.fire({ icon: 'success', title: 'Plato Actualizado', timer: 1500, showConfirmButton: false });
      setIsEditing(false);
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'No se pudo actualizar' });
    }
  };

  if (isEditing) {
    return (
      <div className="bg-bg-surface border border-primary/30 p-8 flex flex-col gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative z-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>

        <div className="flex justify-between items-start">
          <h4 className="text-primary font-heading text-xl uppercase tracking-widest">Editando Plato</h4>
          <span className="text-[10px] text-text-muted font-bold tracking-[3px]">ID #{item.id}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Nombre del Manjar</label>
              <input
                type="text"
                value={editDish.name}
                onChange={e => setEditDish({ ...editDish, name: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Precio (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editDish.price}
                  onChange={e => setEditDish({ ...editDish, price: e.target.value })}
                  className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all font-bold"
                />
              </div>
              <div>
                <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Máx. Pedido</label>
                <input
                  type="number"
                  value={editDish.max_per_order || ''}
                  onChange={e => setEditDish({ ...editDish, max_per_order: e.target.value })}
                  className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
                  placeholder="Sin límite"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Descripción / Historia</label>
              <textarea
                rows="3"
                value={editDish.description}
                onChange={e => setEditDish({ ...editDish, description: e.target.value })}
                className="w-full bg-text-main/5 border border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all resize-none italic"
              />
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4 border-t border-text-main/5">
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Categoría</label>
              <select
                value={editDish.menu_category_id}
                onChange={e => setEditDish({ ...editDish, menu_category_id: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm outline-none focus:border-primary appearance-none cursor-pointer">
                {categories?.map(c => (
                  <option key={c.id} value={c.id} className="bg-bg-surface">{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Alérgenos</label>
              <input
                type="text"
                value={editDish.allergens || ''}
                onChange={e => setEditDish({ ...editDish, allergens: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
                placeholder="Gluten, Lácteos..."
              />
            </div>
            <div className="flex flex-col gap-3 pb-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={editDish.is_per_unit}
                  onChange={e => setEditDish({ ...editDish, is_per_unit: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[11px] uppercase tracking-[1px] text-text-main/70 group-hover:text-primary transition-colors">Precio p/ Unidad</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={editDish.available}
                  onChange={e => setEditDish({ ...editDish, available: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[11px] uppercase tracking-[1px] text-text-main/70 group-hover:text-primary transition-colors">Disponible en carta</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-8 mt-4">
          <button
            onClick={() => setIsEditing(false)}
            className="text-text-muted hover:text-text-main text-[11px] uppercase tracking-[3px] font-bold transition-colors">
            Descartar
          </button>
          <button
            onClick={handleUpdate}
            className="bg-primary hover:bg-white text-black px-10 py-3.5 font-bold text-[11px] uppercase tracking-[4px] transition-all shadow-[0_10px_20px_rgba(197,160,89,0.2)] hover:shadow-[0_15px_30px_rgba(197,160,89,0.4)]">
            Guardar Cambios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`group bg-bg-surface/90 border border-text-main/10 p-7 flex flex-col justify-between transition-all duration-500 relative overflow-hidden h-full hover:border-primary/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] ${!item.available ? 'grayscale opacity-60' : ''}`}>
      {!item.available && (
        <div className="absolute top-4 right-4 bg-red-500/10 text-red-500 text-[8px] px-2 py-1 uppercase tracking-widest font-bold border border-red-500/20 z-10">
          No Disponible
        </div>
      )}

      <div>
        <div className="flex justify-between items-start mb-6">
          <span className="text-primary text-[10px] uppercase tracking-[4px] font-bold opacity-60 group-hover:opacity-100 transition-opacity">
            {item.category?.name}
          </span>
          <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
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
          {item.name}
        </h4>
        
        <p className="text-text-muted text-sm font-light italic leading-relaxed mb-8 opacity-70 line-clamp-3">
          "{item.description}"
        </p>
      </div>

      <div className="pt-6 border-t border-text-main/5 flex justify-between items-end">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-text-main font-heading text-2xl">{parseFloat(item.price).toFixed(2)}€</span>
            {!!item.is_per_unit && <span className="text-text-muted text-[10px] uppercase tracking-widest ml-1">/ UD.</span>}
          </div>
          {!!item.max_per_order && (
            <p className="text-[9px] text-primary/60 uppercase tracking-[2px] mt-1 font-bold">
              Máx. {item.max_per_order} p/ pedido
            </p>
          )}
        </div>
        {item.allergens && (
          <div className="flex flex-wrap gap-1 justify-end max-w-[120px]">
            {item.allergens.split(',').map(a => (
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
  const [edit, setEdit] = useState({ ...item, dishes: item.dishes || [] });

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
    const dish = allAvailableDishes.find(d => d.id === parseInt(dishId));
    if (!dish) return;
    const exists = edit.dishes.find(d => d.id === dish.id);
    if (exists) return;

    setEdit({
      ...edit,
      dishes: [...edit.dishes, { ...dish, pivot: { course_number: edit.dishes.length + 1, notes: '' } }],
    });
  };

  const removeDishFromMenu = id => {
    setEdit({
      ...edit,
      dishes: edit.dishes.filter(d => d.id !== id),
    });
  };

  if (isEditing) {
    return (
      <div className="bg-bg-surface border border-primary/30 p-8 flex flex-col gap-8 shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative z-20">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
        
        <div className="flex justify-between items-start">
          <h4 className="text-primary font-heading text-xl uppercase tracking-widest">Configurando Menú Degustación</h4>
          <span className="text-[10px] text-text-muted font-bold tracking-[3px]">ID #{item.id}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Título del Menú</label>
              <input
                type="text"
                value={edit.name}
                onChange={e => setEdit({ ...edit, name: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-lg font-heading focus:border-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Relato / Descripción</label>
              <textarea
                rows="3"
                value={edit.description}
                onChange={e => setEdit({ ...edit, description: e.target.value })}
                className="w-full bg-text-main/5 border border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all resize-none italic"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Precio Persona (€)</label>
              <input
                type="number"
                value={edit.price}
                onChange={e => setEdit({ ...edit, price: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-xl font-heading focus:border-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Número de Pasos</label>
              <input
                type="number"
                value={edit.courses}
                onChange={e => setEdit({ ...edit, courses: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-text-main/10 pt-8">
          <div className="flex justify-between items-center mb-6">
            <h5 className="text-primary text-[11px] uppercase tracking-[3px] font-bold">Secuencia de Pases</h5>
            <div className="flex items-center gap-4 min-w-[300px]">
              <select
                onChange={e => addDishToMenu(e.target.value)}
                className="flex-grow bg-text-main/5 border border-text-main/10 text-text-main text-[11px] p-2 outline-none focus:border-primary appearance-none cursor-pointer uppercase tracking-widest">
                <option value="">+ Añadir pase al menú</option>
                {allAvailableDishes.map(d => (
                  <option key={d.id} value={d.id} className="bg-bg-surface font-sans">{d.name} ({d.category?.name})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {edit.dishes.length === 0 && (
              <p className="text-center py-8 text-text-muted italic text-sm opacity-50 border-2 border-dashed border-text-main/5">
                No hay platos asignados a este menú todavía.
              </p>
            )}
            {edit.dishes.map((dish, idx) => (
              <div
                key={`${dish.id}-${idx}`}
                className="flex items-center gap-6 bg-text-main/5 p-4 group/item hover:bg-text-main/10 transition-all border-l-2 border-primary/20 hover:border-primary">
                <span className="text-primary font-heading text-xl opacity-40 w-8">{(idx + 1).toString().padStart(2, '0')}</span>
                <div className="flex-grow">
                  <p className="text-text-main text-sm font-heading tracking-wide uppercase">{dish.name}</p>
                </div>
                <div className="flex items-center gap-8">
                  <div className="w-16">
                    <label className="text-[8px] uppercase text-text-muted block mb-1 tracking-widest font-bold">Pase №</label>
                    <input
                      type="number"
                      value={dish.pivot?.course_number || idx + 1}
                      onChange={e => {
                        const newDishes = [...edit.dishes];
                        newDishes[idx] = { ...dish, pivot: { ...dish.pivot, course_number: e.target.value } };
                        setEdit({ ...edit, dishes: newDishes });
                      }}
                      className="bg-transparent border-b border-text-main/20 text-text-main text-xs w-full outline-none focus:border-primary pb-1 font-bold"
                    />
                  </div>
                  <div className="w-48">
                    <label className="text-[8px] uppercase text-text-muted block mb-1 tracking-widest font-bold">Anotación Chef</label>
                    <input
                      type="text"
                      placeholder="Ej: Maridaje sugerido..."
                      value={dish.pivot?.notes || ''}
                      onChange={e => {
                        const newDishes = [...edit.dishes];
                        newDishes[idx] = { ...dish, pivot: { ...dish.pivot, notes: e.target.value } };
                        setEdit({ ...edit, dishes: newDishes });
                      }}
                      className="bg-transparent border-b border-text-main/20 text-text-main text-xs w-full outline-none focus:border-primary pb-1 italic"
                    />
                  </div>
                  <button
                    onClick={() => removeDishFromMenu(dish.id)}
                    className="text-red-500/30 hover:text-red-500 transition-colors p-2">
                    <HiTrash size={16} />
                  </button>
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
    <div className="group bg-bg-surface/90 border border-text-main/10 p-8 flex flex-col justify-between transition-all duration-500 relative overflow-hidden h-full hover:border-primary/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors"></div>
      
      <div>
        <div className="flex justify-between items-start mb-8">
          <span className="text-primary text-[10px] uppercase tracking-[4px] font-bold">
            {item.courses} Pasos • Gastronomía
          </span>
          <div className="flex gap-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button onClick={() => setIsEditing(true)} className="text-text-main hover:text-primary text-[10px] uppercase tracking-[2px] font-bold">Gestionar</button>
            <button onClick={handleDelete} className="text-red-500/50 hover:text-red-500 text-[10px] uppercase tracking-[2px] font-bold">Eliminar</button>
          </div>
        </div>

        <h4 className="text-text-main font-heading text-3xl mb-4 leading-tight group-hover:text-primary transition-colors">{item.name}</h4>
        <p className="text-text-muted text-sm font-light italic leading-relaxed border-l-2 border-primary/20 pl-5 mb-8 opacity-70 line-clamp-2">
          "{item.description}"
        </p>

        <div className="flex flex-wrap gap-2 mb-8 min-h-[40px]">
          {item.dishes?.slice(0, 5).map(d => (
            <span key={d.id} className="text-[9px] bg-text-main/5 text-text-muted px-2.5 py-1 uppercase tracking-widest border border-text-main/5">
              {d.name}
            </span>
          ))}
          {item.dishes?.length > 5 && (
            <span className="text-[9px] text-primary/60 px-2.5 py-1 uppercase tracking-widest font-bold">
              + {item.dishes.length - 5} más
            </span>
          )}
        </div>
      </div>

      <div className="pt-8 border-t border-text-main/5 flex justify-between items-center">
        <div>
          <span className="text-text-main font-heading text-3xl">{parseFloat(item.price).toFixed(0)}€</span>
          <span className="text-text-muted text-[10px] uppercase tracking-[3px] ml-3 opacity-60">por persona</span>
        </div>
        <div className="w-10 h-[1px] bg-primary/30 group-hover:w-16 transition-all duration-500"></div>
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
      delete payload.created_at;
      delete payload.updated_at;

      await axios.put(`/admin/wines/${item.id}`, payload);
      Swal.fire({ icon: 'success', title: 'Vino Actualizado', timer: 1500, showConfirmButton: false });
      setIsEditing(false);
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'No se pudo actualizar' });
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
                value={edit.name}
                onChange={e => setEdit({ ...edit, name: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Bodega / Origen</label>
                <input
                  type="text"
                  value={edit.winery || ''}
                  onChange={e => setEdit({ ...edit, winery: e.target.value })}
                  className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all font-bold"
                />
              </div>
              <div>
                <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Año / Cosecha</label>
                <input
                  type="text"
                  value={edit.vintage || ''}
                  onChange={e => setEdit({ ...edit, vintage: e.target.value })}
                  className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Notas de Cata / Maridaje</label>
              <textarea
                rows="3"
                value={edit.pairing_notes || ''}
                onChange={e => setEdit({ ...edit, pairing_notes: e.target.value })}
                className="w-full bg-text-main/5 border border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all resize-none italic"
              />
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-6 items-end pt-4 border-t border-text-main/5">
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Tipo de Vino</label>
              <select
                value={edit.type}
                onChange={e => setEdit({ ...edit, type: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm outline-none focus:border-primary appearance-none cursor-pointer">
                <option value="Red" className="bg-bg-surface">Tinto</option>
                <option value="White" className="bg-bg-surface">Blanco</option>
                <option value="Rose" className="bg-bg-surface">Rosado</option>
                <option value="Sparkling" className="bg-bg-surface">Espumoso</option>
                <option value="Sweet" className="bg-bg-surface">Dulce</option>
              </select>
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">P. Botella (€)</label>
              <input
                type="number"
                step="0.01"
                value={edit.price_bottle}
                onChange={e => setEdit({ ...edit, price_bottle: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all font-bold"
              />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">P. Copa (€)</label>
              <input
                type="number"
                step="0.01"
                value={edit.price_glass || ''}
                onChange={e => setEdit({ ...edit, price_glass: e.target.value })}
                className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
                placeholder="Opcional"
              />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Máx. Pedido</label>
              <input
                type="number"
                value={edit.max_per_order || ''}
                onChange={e => setEdit({ ...edit, max_per_order: e.target.value })}
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
            {item.type} {item.vintage && `• ${item.vintage}`}
          </span>
          <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button onClick={() => setIsEditing(true)} className="text-text-main hover:text-primary text-[10px] uppercase tracking-[2px] font-bold">Editar</button>
            <button onClick={handleDelete} className="text-red-500/50 hover:text-red-500 text-[10px] uppercase tracking-[2px] font-bold">Borrar</button>
          </div>
        </div>

        <h4 className="text-text-main font-heading text-2xl mb-1 leading-tight group-hover:text-primary transition-colors">{item.name}</h4>
        <p className="text-text-muted text-[10px] uppercase tracking-[2px] mb-4 font-bold opacity-50">{item.winery}</p>
        
        {item.pairing_notes && (
          <p className="text-text-muted text-sm font-light italic leading-relaxed mb-8 opacity-70 line-clamp-2">
            "{item.pairing_notes}"
          </p>
        )}
      </div>

      <div className="pt-6 border-t border-text-main/5 flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-text-main font-heading text-xl">{parseFloat(item.price_bottle).toFixed(2)}€</span>
            <span className="text-text-muted text-[8px] uppercase tracking-widest ml-1 opacity-50">Botella</span>
          </div>
          {item.price_glass && (
            <div className="flex items-baseline gap-1">
              <span className="text-text-main font-heading text-lg opacity-80">{parseFloat(item.price_glass).toFixed(2)}€</span>
              <span className="text-text-muted text-[8px] uppercase tracking-widest ml-1 opacity-50">Copa</span>
            </div>
          )}
        </div>
        {item.max_per_order && (
          <div className="text-right">
            <p className="text-[9px] text-primary/60 uppercase tracking-[2px] font-bold">Máx. {item.max_per_order}</p>
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
              value={edit.name}
              onChange={e => setEdit({ ...edit, name: e.target.value })}
              className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Precio (€)</label>
            <input
              type="number"
              step="0.01"
              value={edit.price}
              onChange={e => setEdit({ ...edit, price: e.target.value })}
              className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all font-bold"
            />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Tipo</label>
            <select
              value={edit.type}
              onChange={e => setEdit({ ...edit, type: e.target.value })}
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
              value={edit.description || ''}
              onChange={e => setEdit({ ...edit, description: e.target.value })}
              className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all italic"
              placeholder="Ej: Con gas, sin cafeína..."
            />
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
          <span className="text-primary text-[10px] uppercase tracking-[4px] font-bold opacity-60 group-hover:opacity-100 transition-opacity">{item.type}</span>
          <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button onClick={() => setIsEditing(true)} className="text-text-main hover:text-primary text-[10px] uppercase tracking-[2px] font-bold">Editar</button>
            <button onClick={handleDelete} className="text-red-500/50 hover:text-red-500 text-[10px] uppercase tracking-[2px] font-bold">Borrar</button>
          </div>
        </div>
        <h4 className="text-text-main font-heading text-2xl mb-2 leading-tight group-hover:text-primary transition-colors">{item.name}</h4>
        {item.description && <p className="text-text-muted text-sm font-light italic leading-relaxed opacity-70 mb-4">"{item.description}"</p>}
      </div>
      <div className="pt-6 border-t border-text-main/5 flex justify-between items-end">
        <span className="text-text-main font-heading text-2xl">{parseFloat(item.price).toFixed(2)}€</span>
        <div className="w-8 h-[1px] bg-primary/20 group-hover:w-12 transition-all"></div>
      </div>
    </div>
  );
};

// Componente para editar/ver un usuario en la lista de admin
const UserEditRow = ({ user, fetchData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState({ name: user.name, role: user.role, email: user.email, phone: user.phone || '', password: '' });

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
      text: `¿Seguro que quiere eliminar permanentemente a ${user.name}?`,
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
              value={editUser.name}
              onChange={e => setEditUser({ ...editUser, name: e.target.value })}
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
              value={editUser.phone}
              onChange={e => setEditUser({ ...editUser, phone: e.target.value })}
              className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm focus:border-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Rol de Acceso</label>
            <select
              value={editUser.role}
              onChange={e => setEditUser({ ...editUser, role: e.target.value })}
              className="w-full bg-text-main/5 border-b border-text-main/10 text-text-main p-3 text-sm outline-none focus:border-primary appearance-none cursor-pointer">
              <option value="client">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-text-muted text-[10px] uppercase tracking-[2px] block mb-2 font-bold">Actualizar Contraseña (Opcional)</label>
            <input
              type="password"
              placeholder="Dejar en blanco para mantener..."
              value={editUser.password}
              onChange={e => setEditUser({ ...editUser, password: e.target.value })}
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
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-heading text-xl ${user.role === 'admin' ? 'bg-primary text-black shadow-[0_0_20px_rgba(197,160,89,0.3)]' : 'bg-text-main/5 text-text-muted'}`}>
          {user.name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h4 className="text-text-main font-heading text-xl">{user.name}</h4>
            <span className={`text-[8px] uppercase tracking-[2px] px-2 py-0.5 rounded-sm font-bold ${user.role === 'admin' ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-text-main/10 text-text-muted border border-text-main/10'}`}>
              {user.role === 'admin' ? 'Administrador' : 'Cliente'}
            </span>
          </div>
          <p className="text-text-muted text-xs font-light tracking-wide">{user.email} {user.phone && `• ${user.phone}`}</p>
        </div>
      </div>
      <div className="flex gap-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 mt-4 md:mt-0">
        <button onClick={() => setIsEditing(true)} className="text-text-main hover:text-primary text-[10px] uppercase tracking-[2px] font-bold">Editar Perfil</button>
        {user.id !== 1 && (
          <button onClick={handleDelete} className="text-red-500/50 hover:text-red-500 text-[10px] uppercase tracking-[2px] font-bold">Eliminar</button>
        )}
      </div>
    </div>
  );
};

export default AdminView;
