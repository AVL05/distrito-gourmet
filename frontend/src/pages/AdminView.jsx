import { useAuthStore } from '@/store/auth';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion, AnimatePresence, useReducedMotion, FadeIn } from '@/motion';
import { DURATION, EASING } from '@/motion';

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
    available: true
  });
  const [newWine, setNewWine] = useState({ name: '', winery: '', type: 'Red', price_bottle: '', vintage: '', pairing_notes: '' });
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
        const [menusRes, dishesRes] = await Promise.all([
          axios.get('/admin/tasting-menus'),
          axios.get('/dishes')
        ]);
        setData(d => ({ 
          ...d, 
          tasting_menus: menusRes.data, 
          menu: dishesRes.data.dishes || [] 
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

  // Cambiar estado de una reserva
  const handleUpdateReservationStatus = async (id, status) => {
    try {
      await axios.patch(`/admin/reservations/${id}`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Renderizar contenido según la sección activa
  const renderContent = () => {
    if (loading) return <div className="text-text-muted animate-pulse">Cargando datos del servidor...</div>;

    if (activeSection === 'orders') {
      return (
        <div className="space-y-6">
          {data.orders.length === 0 ? (
            <p className="text-text-muted">No hay pedidos registrados.</p>
          ) : (
            data.orders.map(order => (
              <div
                key={order.id}
                className="bg-bg-surface/90 border border-text-main/10 p-4 flex flex-col md:flex-row justify-between md:items-center">
                <div className="mb-4 md:mb-0">
                  <span className="text-primary text-xs tracking-widest uppercase block mb-1">Pedido #{order.id}</span>
                  <p className="text-text-main">Cliente: {order.user?.name || `ID: ${order.user_id}`}</p>
                  <p className="text-text-muted text-sm">Total: {parseFloat(order.total).toFixed(2)}€</p>
                  <p className="text-text-muted text-sm mt-2">
                    Artículos: {order.items?.map(i => `${i.quantity}x ${i.item_name}`).join(', ')}
                  </p>
                </div>
                <div className="flex gap-4">
                  <select
                    value={order.status}
                    onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                    className="bg-bg-surface border border-text-main/10 text-text-main rounded p-2 text-sm">
                    <option value="received">Recibido</option>
                    <option value="preparing">Preparando</option>
                    <option value="ready">Listo</option>
                    <option value="delivered">Entregado</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      );
    }

    if (activeSection === 'reservations') {
      return (
        <div className="space-y-6">
          {data.reservations.length === 0 ? (
            <p className="text-text-muted">No hay reservas registradas.</p>
          ) : (
            data.reservations.map(res => (
              <div
                key={res.id}
                className="bg-bg-surface/90 border border-text-main/10 p-4 flex flex-col md:flex-row justify-between md:items-center">
                <div className="mb-4 md:mb-0">
                  <span className="text-primary text-xs tracking-widest uppercase block mb-1">Reserva #{res.id}</span>
                  <p className="text-text-main">Cliente: {res.user?.name || `ID: ${res.user_id}`}</p>
                  <p className="text-text-muted text-sm">Fecha: {new Date(res.reservation_time).toLocaleString()}</p>
                  <p className="text-text-muted text-sm">Personas: {res.people}</p>
                </div>
                <div className="flex gap-4">
                  <select
                    value={res.status}
                    onChange={e => handleUpdateReservationStatus(res.id, e.target.value)}
                    className="bg-bg-surface border border-text-main/10 text-text-main rounded p-2 text-sm">
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmada</option>
                    <option value="cancelled">Cancelada</option>
                    <option value="arrived">Llegado</option>
                  </select>
                </div>
              </div>
            ))
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
              handleAddItem('dishes', newDish, () => setNewDish({ 
                name: '', description: '', price: '', menu_category_id: data.categories[0]?.id || '',
                image: '', allergens: '', is_signature: false, available: true
              }), 'Plato añadido');
            }}
            className="bg-bg-surface/90 border border-text-main/10 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-end shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <h3 className="col-span-full font-heading text-primary text-xl mb-2 flex items-center gap-3">
              <span className="w-1 h-6 bg-primary"></span>
              Añadir Nuevo Plato a la Carta
            </h3>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Nombre del Plato</label>
              <input required type="text" placeholder="Ej: Ostras al Carbón..." value={newDish.name} onChange={e => setNewDish({ ...newDish, name: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors" />
            </div>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Categoría</label>
              <select required value={newDish.menu_category_id} onChange={e => setNewDish({ ...newDish, menu_category_id: e.target.value })} className="w-full bg-bg-surface border-b border-text-main/10 text-text-main p-1.5 focus:border-primary outline-none text-sm cursor-pointer appearance-none">
                <option value="" disabled>Seleccionar...</option>
                {data.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Precio (€)</label>
              <input required type="number" step="0.01" placeholder="0.00" value={newDish.price} onChange={e => setNewDish({ ...newDish, price: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors" />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Descripción / Historia</label>
              <input required type="text" placeholder="Breve historia o ingredientes clave..." value={newDish.description} onChange={e => setNewDish({ ...newDish, description: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors" />
            </div>

            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">URL Imagen</label>
              <input type="text" placeholder="https://..." value={newDish.image} onChange={e => setNewDish({ ...newDish, image: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors" />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Alérgenos (separados por coma)</label>
              <input type="text" placeholder="Gluten, Lácteos..." value={newDish.allergens} onChange={e => setNewDish({ ...newDish, allergens: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none transition-colors" />
            </div>

            <div className="flex items-center gap-6 pb-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={newDish.is_signature} onChange={e => setNewDish({ ...newDish, is_signature: e.target.checked })} className="w-4 h-4 accent-primary" />
                <span className="text-[10px] uppercase tracking-widest text-text-muted group-hover:text-primary transition-colors">Plato Estrella</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={newDish.available} onChange={e => setNewDish({ ...newDish, available: e.target.checked })} className="w-4 h-4 accent-primary" />
                <span className="text-[10px] uppercase tracking-widest text-text-muted group-hover:text-primary transition-colors">Disponible</span>
              </label>
            </div>

            <button type="submit" className="bg-primary hover:bg-bg-surface text-black font-bold uppercase tracking-[3px] text-[10px] transition-all p-3.5 w-full shadow-[0_10px_20px_rgba(197,160,89,0.2)] hover:shadow-[0_15px_30px_rgba(197,160,89,0.4)] md:col-span-3 lg:col-span-1">
              Confirmar Alta
            </button>
          </form>
          <div className="grid grid-cols-1 gap-4">
            {data.menu.map(item => <DishEditRow key={item.id} item={item} fetchData={fetchData} handleDelete={() => handleDeleteItem('dishes', item.id, item.name)} categories={data.categories} />)}
          </div>
        </div>
      );
    }

    if (activeSection === 'tasting_menus') {
      return (
        <div className="space-y-8">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleAddItem('tasting-menus', newTastingMenu, () => setNewTastingMenu({ name: '', description: '', price: '', courses: 1 }), 'Menú añadido');
            }}
            className="bg-bg-surface/90 border border-text-main/10 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <h3 className="col-span-full font-heading text-primary text-lg mb-2">Añadir Menú Degustación</h3>
            <div className="col-span-1 lg:col-span-2">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Nombre</label>
              <input required type="text" value={newTastingMenu.name} onChange={e => setNewTastingMenu({ ...newTastingMenu, name: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Precio (€)</label>
              <input required type="number" step="0.01" value={newTastingMenu.price} onChange={e => setNewTastingMenu({ ...newTastingMenu, price: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Nº Pasos</label>
              <input required type="number" value={newTastingMenu.courses} onChange={e => setNewTastingMenu({ ...newTastingMenu, courses: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none" />
            </div>
            <button type="submit" className="bg-primary hover:bg-bg-surface text-black font-bold uppercase tracking-widest text-xs transition-colors p-3 w-full">Añadir</button>
            <div className="col-span-full mt-2">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Descripción corta</label>
              <input required type="text" value={newTastingMenu.description} onChange={e => setNewTastingMenu({ ...newTastingMenu, description: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none" />
            </div>
          </form>
          <div className="grid grid-cols-1 gap-4">
            {data.tasting_menus.map(item => <TastingMenuEditRow key={item.id} item={item} fetchData={fetchData} handleDelete={() => handleDeleteItem('tasting-menus', item.id, item.name)} allAvailableDishes={data.menu} />)}
          </div>
        </div>
      );
    }

    if (activeSection === 'wines') {
      return (
        <div className="space-y-8">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleAddItem('wines', newWine, () => setNewWine({ name: '', winery: '', type: 'Red', price_bottle: '' }), 'Vino añadido');
            }}
            className="bg-bg-surface/90 border border-text-main/10 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <h3 className="col-span-full font-heading text-primary text-lg mb-2">Añadir Nuevo Vino</h3>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Nombre</label>
              <input required type="text" value={newWine.name} onChange={e => setNewWine({ ...newWine, name: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Bodega</label>
              <input type="text" value={newWine.winery} onChange={e => setNewWine({ ...newWine, winery: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Tipo</label>
              <select value={newWine.type} onChange={e => setNewWine({ ...newWine, type: e.target.value })} className="w-full bg-bg-surface border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none text-sm">
                <option value="Red">Tinto</option>
                <option value="White">Blanco</option>
                <option value="Rose">Rosado</option>
                <option value="Sparkling">Espumoso</option>
                <option value="Sweet">Dulce</option>
              </select>
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Precio Botella (€)</label>
              <input required type="number" step="0.01" value={newWine.price_bottle} onChange={e => setNewWine({ ...newWine, price_bottle: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none" />
            </div>
            <button type="submit" className="bg-primary hover:bg-bg-surface text-black font-bold uppercase tracking-widest text-xs transition-colors p-3 w-full">Añadir</button>
          </form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.wines.map(item => <WineEditRow key={item.id} item={item} fetchData={fetchData} handleDelete={() => handleDeleteItem('wines', item.id, item.name)} />)}
          </div>
        </div>
      );
    }

    if (activeSection === 'beverages') {
      return (
        <div className="space-y-8">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleAddItem('beverages', newBeverage, () => setNewBeverage({ name: '', type: 'agua', price: '' }), 'Bebida añadida');
            }}
            className="bg-bg-surface/90 border border-text-main/10 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <h3 className="col-span-full font-heading text-primary text-lg mb-2">Añadir Nueva Bebida</h3>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Nombre</label>
              <input required type="text" value={newBeverage.name} onChange={e => setNewBeverage({ ...newBeverage, name: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Tipo</label>
              <select value={newBeverage.type} onChange={e => setNewBeverage({ ...newBeverage, type: e.target.value })} className="w-full bg-bg-surface border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none text-sm">
                <option value="agua">Agua</option>
                <option value="refresco">Refresco</option>
                <option value="cocktail">Cóctel</option>
                <option value="cafe">Café</option>
                <option value="infusion">Infusión</option>
              </select>
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Precio (€)</label>
              <input required type="number" step="0.01" value={newBeverage.price} onChange={e => setNewBeverage({ ...newBeverage, price: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none" />
            </div>
            <button type="submit" className="bg-primary hover:bg-bg-surface text-black font-bold uppercase tracking-widest text-xs transition-colors p-3 w-full">Añadir</button>
          </form>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.beverages.map(item => <BeverageEditRow key={item.id} item={item} fetchData={fetchData} handleDelete={() => handleDeleteItem('beverages', item.id, item.name)} />)}
          </div>
        </div>
      );
    }

    if (activeSection === 'users') {
      return (
        <div className="space-y-6">
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
              className="max-w-7xl">
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
    is_signature: !!item.is_signature, 
    available: !!item.available 
  });

  const handleUpdate = async () => {
    try {
      await axios.put(`/admin/dishes/${item.id}`, editDish);
      Swal.fire({ icon: 'success', title: 'Plato Actualizado', timer: 1500, showConfirmButton: false });
      setIsEditing(false);
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'No se pudo actualizar' });
    }
  };

  if (isEditing) {
    return (
      <div className="bg-bg-surface border border-primary/40 p-6 flex flex-col gap-6 shadow-xl relative my-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Nombre</label>
            <input type="text" value={editDish.name} onChange={e => setEditDish({ ...editDish, name: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-1 text-sm focus:border-primary outline-none" />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Precio (€)</label>
            <input type="number" step="0.01" value={editDish.price} onChange={e => setEditDish({ ...editDish, price: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-1 text-sm focus:border-primary outline-none" />
          </div>
          <div className="lg:col-span-2">
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Descripción</label>
            <input type="text" value={editDish.description} onChange={e => setEditDish({ ...editDish, description: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-1 text-sm focus:border-primary outline-none" />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">URL Imagen</label>
            <input type="text" value={editDish.image || ''} onChange={e => setEditDish({ ...editDish, image: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-1 text-sm focus:border-primary outline-none" />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Alérgenos</label>
            <input type="text" value={editDish.allergens || ''} onChange={e => setEditDish({ ...editDish, allergens: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-1 text-sm focus:border-primary outline-none" />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Categoría</label>
            <select value={editDish.menu_category_id} onChange={e => setEditDish({ ...editDish, menu_category_id: e.target.value })} className="w-full bg-bg-surface border-b border-text-main/10 text-text-main p-1 text-sm outline-none focus:border-primary">
              {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-4 pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={editDish.is_signature} onChange={e => setEditDish({ ...editDish, is_signature: e.target.checked })} className="accent-primary" />
              <span className="text-[10px] uppercase tracking-widest text-text-muted">Estrella</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={editDish.available} onChange={e => setEditDish({ ...editDish, available: e.target.checked })} className="accent-primary" />
              <span className="text-[10px] uppercase tracking-widest text-text-muted">Disponible</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-6 border-t border-text-main/10 pt-4">
          <button onClick={() => setIsEditing(false)} className="text-text-muted hover:text-text-main text-[10px] uppercase tracking-[2px]">Cancelar</button>
          <button onClick={handleUpdate} className="bg-primary text-black px-6 py-2 font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-colors">Guardar Cambios</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface/90 border border-text-main/10 p-4 flex justify-between items-center group hover:border-primary/30 transition-all">
      <div className="flex items-center gap-4">
        {item.image && <img src={item.image} alt="" className="w-12 h-12 object-cover grayscale group-hover:grayscale-0 transition-all" />}
        <div>
          <h4 className="text-text-main font-heading flex items-center gap-2">
            {item.name}
            {item.is_signature && <span className="text-primary text-[10px]">✦</span>}
          </h4>
          <p className="text-text-muted text-[10px] uppercase tracking-wider">{item.category?.name} | {parseFloat(item.price).toFixed(2)}€</p>
        </div>
      </div>
      <div className="flex gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setIsEditing(true)} className="text-primary text-[10px] uppercase tracking-widest hover:underline">Editar</button>
        <button onClick={handleDelete} className="text-red-500/70 text-[10px] uppercase tracking-widest hover:text-red-500">Eliminar</button>
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
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar' });
    }
  };

  const addDishToMenu = (dishId) => {
    if (!dishId) return;
    const dish = allAvailableDishes.find(d => d.id === parseInt(dishId));
    if (!dish) return;
    
    // Evitar duplicados si se prefiere, aunque el pivot lo permite.
    const exists = edit.dishes.find(d => d.id === dish.id);
    if (exists) return;

    setEdit({
      ...edit,
      dishes: [...edit.dishes, { ...dish, pivot: { course_number: edit.dishes.length + 1, notes: '' } }]
    });
  };

  const removeDishFromMenu = (id) => {
    setEdit({
      ...edit,
      dishes: edit.dishes.filter(d => d.id !== id)
    });
  };

  if (isEditing) {
    return (
      <div className="bg-bg-surface border border-primary/40 p-6 flex flex-col gap-8 shadow-2xl my-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div className="lg:col-span-2">
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Nombre del Menú</label>
            <input type="text" value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-1 text-sm focus:border-primary outline-none" />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Precio (€)</label>
            <input type="number" step="0.01" value={edit.price} onChange={e => setEdit({ ...edit, price: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-1 text-sm focus:border-primary outline-none" />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Nº Pasos (Total)</label>
            <input type="number" value={edit.courses} onChange={e => setEdit({ ...edit, courses: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-1 text-sm focus:border-primary outline-none" />
          </div>
          <div className="lg:col-span-4">
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Descripción General</label>
            <input type="text" value={edit.description} onChange={e => setEdit({ ...edit, description: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-1 text-sm focus:border-primary outline-none" />
          </div>
        </div>

        {/* Sección de Platos vinculados */}
        <div className="border-t border-text-main/10 pt-6">
          <h5 className="text-primary text-[10px] uppercase tracking-[3px] mb-4">Composición del Menú</h5>
          <div className="space-y-3 mb-6">
            {edit.dishes.map((dish, idx) => (
              <div key={dish.id} className="flex flex-col md:flex-row gap-4 items-center bg-text-main/5 p-3 border border-text-main/5">
                <span className="text-primary font-bold text-xs">#{idx + 1}</span>
                <div className="flex-grow">
                  <p className="text-text-main text-sm font-heading">{dish.name}</p>
                </div>
                <div className="flex gap-4">
                   <div className="w-20">
                      <label className="text-[8px] uppercase text-text-muted block">Paso №</label>
                      <input 
                        type="number" 
                        value={dish.pivot?.course_number || idx + 1} 
                        onChange={e => {
                          const newDishes = [...edit.dishes];
                          newDishes[idx] = { ...dish, pivot: { ...dish.pivot, course_number: e.target.value } };
                          setEdit({ ...edit, dishes: newDishes });
                        }}
                        className="bg-transparent border-b border-text-main/10 text-text-main text-xs w-full outline-none focus:border-primary" 
                      />
                   </div>
                   <div className="flex-grow min-w-[150px]">
                      <label className="text-[8px] uppercase text-text-muted block">Nota (opcional)</label>
                      <input 
                        type="text" 
                        placeholder="ej: Versión mini..."
                        value={dish.pivot?.notes || ''} 
                        onChange={e => {
                          const newDishes = [...edit.dishes];
                          newDishes[idx] = { ...dish, pivot: { ...dish.pivot, notes: e.target.value } };
                          setEdit({ ...edit, dishes: newDishes });
                        }}
                        className="bg-transparent border-b border-text-main/10 text-text-main text-xs w-full outline-none focus:border-primary" 
                      />
                   </div>
                </div>
                <button onClick={() => removeDishFromMenu(dish.id)} className="text-red-500/70 hover:text-red-500 text-[10px] uppercase tracking-widest px-2">Remover</button>
              </div>
            ))}
          </div>

          <div className="flex gap-4 items-end">
            <div className="flex-grow">
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Vincular un plato existente...</label>
              <select onChange={e => addDishToMenu(e.target.value)} className="w-full bg-bg-surface border border-text-main/10 text-text-main text-sm p-2 outline-none focus:border-primary">
                <option value="">Seleccionar plato...</option>
                {allAvailableDishes.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.category?.name})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-6 border-t border-text-main/10 pt-4">
          <button onClick={() => setIsEditing(false)} className="text-text-muted hover:text-text-main text-[10px] uppercase tracking-[2px]">Cancelar</button>
          <button onClick={handleUpdate} className="bg-primary text-black px-8 py-2.5 font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-colors">Guardar Configuración</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface/90 border border-text-main/10 p-5 flex flex-col md:flex-row justify-between md:items-center group hover:border-primary/50 transition-all">
      <div className="mb-4 md:mb-0">
        <h4 className="text-text-main font-heading text-lg">{item.name}</h4>
        <p className="text-text-muted text-xs tracking-widest uppercase mb-2">{item.courses} Pasos | {parseFloat(item.price).toFixed(2)}€</p>
        <p className="text-text-muted text-sm italic opacity-70 border-l border-primary/30 pl-4">{item.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {item.dishes?.map(d => (
            <span key={d.id} className="text-[8px] border border-text-main/10 px-2 py-0.5 text-text-muted uppercase tracking-tighter">{d.name}</span>
          ))}
        </div>
      </div>
      <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setIsEditing(true)} className="text-primary text-[10px] uppercase tracking-widest hover:underline">Gestionar Platos</button>
        <button onClick={handleDelete} className="text-red-500/70 text-[10px] uppercase tracking-widest hover:text-red-500">Eliminar</button>
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
      await axios.put(`/admin/wines/${item.id}`, edit);
      Swal.fire({ icon: 'success', title: 'Vino Actualizado', timer: 1500, showConfirmButton: false });
      setIsEditing(false);
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar' });
    }
  };

  if (isEditing) {
    return (
      <div className="bg-bg-surface border border-primary/40 p-6 flex flex-col gap-6 shadow-xl relative my-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Nombre del Vino</label>
            <input type="text" value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-1 text-sm focus:border-primary outline-none" placeholder="Nombre" />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Bodega</label>
            <input type="text" value={edit.winery || ''} onChange={e => setEdit({ ...edit, winery: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-1 text-sm focus:border-primary outline-none" placeholder="Bodega" />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Tipo</label>
            <select value={edit.type} onChange={e => setEdit({ ...edit, type: e.target.value })} className="w-full bg-bg-surface border-b border-text-main/10 text-text-main p-1 text-sm focus:border-primary outline-none">
              <option value="Red">Tinto</option>
              <option value="White">Blanco</option>
              <option value="Rose">Rosado</option>
              <option value="Sparkling">Espumoso</option>
            </select>
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Año / Cosecha</label>
            <input type="text" value={edit.vintage || ''} onChange={e => setEdit({ ...edit, vintage: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-1 text-sm focus:border-primary outline-none" placeholder="2018..." />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Precio Botella (€)</label>
            <input type="number" step="0.01" value={edit.price_bottle} onChange={e => setEdit({ ...edit, price_bottle: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-1 text-sm focus:border-primary outline-none" placeholder="0.00" />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Precio Copa (€)</label>
            <input type="number" step="0.01" value={edit.price_glass || ''} onChange={e => setEdit({ ...edit, price_glass: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-1 text-sm focus:border-primary outline-none" placeholder="Opcional" />
          </div>
          <div className="lg:col-span-2">
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Notas de Maridaje / Info</label>
            <input type="text" value={edit.pairing_notes || ''} onChange={e => setEdit({ ...edit, pairing_notes: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-1 text-sm focus:border-primary outline-none" placeholder="Notas de cata..." />
          </div>
        </div>
        <div className="flex justify-end gap-6 border-t border-text-main/10 pt-4">
          <button onClick={() => setIsEditing(false)} className="text-text-muted hover:text-text-main text-[10px] uppercase tracking-[2px]">Cancelar</button>
          <button onClick={handleUpdate} className="bg-primary text-black px-6 py-2 font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-colors">Guardar Cambios</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface/90 border border-text-main/10 p-4 flex justify-between items-center group hover:border-primary/30 transition-all">
      <div>
        <h4 className="text-text-main font-heading text-base">{item.name} <span className="text-text-muted text-[10px] ml-2 italic">({item.vintage || 'S/A'})</span></h4>
        <p className="text-text-muted text-[10px] uppercase tracking-widest">{item.winery} | {item.type}</p>
      </div>
      <div className="flex gap-6 items-center">
        <div className="text-right">
          <span className="text-text-main text-sm block font-bold">{parseFloat(item.price_bottle).toFixed(2)}€</span>
          {item.price_glass && <span className="text-text-muted text-[10px]">{parseFloat(item.price_glass).toFixed(2)}€ / copa</span>}
        </div>
        <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
          <button onClick={() => setIsEditing(true)} className="text-primary text-[10px] uppercase tracking-widest hover:underline">Editar</button>
          <button onClick={handleDelete} className="text-red-500/70 text-[10px] uppercase tracking-widest hover:text-red-500">Borrar</button>
        </div>
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
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar' });
    }
  };

  if (isEditing) {
    return (
      <div className="bg-bg-surface border border-primary/40 p-4 flex flex-col gap-4 shadow-xl my-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Nombre</label>
            <input type="text" value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-1 text-sm focus:border-primary outline-none" />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Precio (€)</label>
            <input type="number" step="0.01" value={edit.price} onChange={e => setEdit({ ...edit, price: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-1 text-sm focus:border-primary outline-none" />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Tipo</label>
            <select value={edit.type} onChange={e => setEdit({ ...edit, type: e.target.value })} className="w-full bg-bg-surface border-b border-text-main/10 text-text-main p-1 text-sm focus:border-primary outline-none">
              <option value="agua">Agua</option>
              <option value="refresco">Refresco</option>
              <option value="cocktail">Cóctel</option>
              <option value="cafe">Café</option>
            </select>
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Descripción</label>
            <input type="text" value={edit.description || ''} onChange={e => setEdit({ ...edit, description: e.target.value })} className="w-full bg-transparent border-b border-text-main/10 text-text-main p-1 text-sm focus:border-primary outline-none" placeholder="Opcional" />
          </div>
        </div>
        <div className="flex justify-end gap-6 border-t border-text-main/10 pt-3">
          <button onClick={() => setIsEditing(false)} className="text-text-muted hover:text-text-main text-[10px] uppercase tracking-[2px]">Cancelar</button>
          <button onClick={handleUpdate} className="text-primary hover:text-text-main text-[10px] uppercase tracking-[2px] font-bold">Guardar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface/90 border border-text-main/10 p-4 flex justify-between items-center group hover:border-primary/30 transition-all">
      <div>
        <h4 className="text-text-main font-heading text-sm">{item.name}</h4>
        <p className="text-text-muted text-[10px] uppercase tracking-widest">{item.type}</p>
      </div>
      <div className="flex gap-4 items-center">
        <span className="text-text-main font-bold">{parseFloat(item.price).toFixed(2)}€</span>
        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          <button onClick={() => setIsEditing(true)} className="text-primary text-[10px] uppercase tracking-widest hover:underline">Editar</button>
          <button onClick={handleDelete} className="text-red-500/70 text-[10px] uppercase tracking-widest hover:text-red-500">Eliminar</button>
        </div>
      </div>
    </div>
  );
};

// Componente para editar/ver un usuario en la lista de admin
const UserEditRow = ({ user, fetchData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState({ name: user.name, role: user.role, email: user.email, password: '' });

  // Guardar cambios del usuario
  const handleUpdate = async () => {
    try {
      await axios.put(`/admin/users/${user.id}`, editUser);
      Swal.fire({
        icon: 'success',
        title: 'Usuario Actualizado',
        background: '#fdfaf6',
        color: '#2c302e',
        confirmButtonColor: '#e76f51',
        timer: 1500,
      });
      setIsEditing(false);
      fetchData();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar',
        background: '#fdfaf6',
        color: '#2c302e',
        confirmButtonColor: '#e76f51',
      });
    }
  };

  // Eliminar usuario con confirmación
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: `Opciones de Eliminación`,
      text: `¿Seguro que quiere eliminar permanentemente a ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      background: '#fdfaf6',
      color: '#2c302e',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#888',
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

  // Vista de edición
  if (isEditing) {
    return (
      <div className="bg-bg-surface/90 border border-primary/40 p-4 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          value={editUser.name}
          onChange={e => setEditUser({ ...editUser, name: e.target.value })}
          className="bg-transparent border-b border-text-main/10 text-text-main p-2 text-sm flex-1"
        />
        <input
          type="email"
          value={editUser.email}
          onChange={e => setEditUser({ ...editUser, email: e.target.value })}
          className="bg-transparent border-b border-text-main/10 text-text-main p-2 text-sm flex-1"
        />
        <select
          value={editUser.role}
          onChange={e => setEditUser({ ...editUser, role: e.target.value })}
          className="bg-bg-surface border border-text-main/10 text-text-main p-2 text-sm">
          <option value="client">Cliente</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="password"
          placeholder="Nueva Clave..."
          value={editUser.password}
          onChange={e => setEditUser({ ...editUser, password: e.target.value })}
          className="bg-transparent border-b border-text-main/10 text-text-main p-2 text-sm w-32"
        />

        <div className="flex items-center gap-2">
          <button onClick={handleUpdate} className="text-primary hover:text-text-main text-xs uppercase tracking-[2px]">
            Guardar
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="text-text-muted hover:text-text-main text-xs uppercase tracking-[2px]">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  // Vista normal (modo lectura)
  return (
    <div className="bg-bg-surface/90 border border-text-main/10 p-4 flex flex-col md:flex-row justify-between md:items-center group">
      <div className="mb-4 md:mb-0">
        <span className="text-primary text-xs tracking-widest uppercase block mb-1">
          Rol: {user.role?.toUpperCase()}
        </span>
        <p className="text-text-main">{user.name}</p>
        <p className="text-text-muted text-sm">{user.email}</p>
      </div>
      <div className="flex gap-4 opacity-50 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="text-primary hover:text-primary-hover text-xs uppercase tracking-[2px]">
          Editar
        </button>
        {/* Proteger que el admin principal no pueda borrarse a sí mismo */}
        {user.id !== 1 && (
          <button onClick={handleDelete} className="text-red-500 hover:text-red-400 text-xs uppercase tracking-[2px]">
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminView;
