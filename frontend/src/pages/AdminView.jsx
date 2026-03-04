import { useAuthStore } from '@/store/auth';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FadeIn } from '@/motion';
import { DURATION, EASING } from '@/motion';

const AdminView = () => {
  const { logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState('orders');
  const [data, setData] = useState({ orders: [], menu: [], reservations: [], users: [], categories: [] });
  const [loading, setLoading] = useState(false);
  const shouldReduceMotion = useReducedMotion();

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

  // Estado del formulario para añadir nuevo plato
  const [newDish, setNewDish] = useState({ name: '', description: '', price: '', menu_category_id: '' });

  // Secciones del panel de administración
  const sections = [
    { id: 'orders', label: 'Pedidos' },
    { id: 'reservations', label: 'Reservas' },
    { id: 'menu', label: 'Carta (Platos)' },
    { id: 'users', label: 'Usuarios' },
  ];

  // Llamada a la API para obtener los datos de la sección activa
  const fetchData = async () => {
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
  };

  // Recargar datos cuando cambia la sección activa
  useEffect(() => {
    fetchData();
  }, [activeSection]);

  // Cambiar estado de un pedido
  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await axios.patch(`/admin/orders/${id}`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Añadir nuevo plato a la carta
  const handleAddDish = async e => {
    e.preventDefault();
    if (!newDish.menu_category_id) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: 'Debe seleccionar una categoría',
        background: '#fdfaf6',
        color: '#2c302e',
        confirmButtonColor: '#e76f51',
      });
    }

    try {
      await axios.post('/admin/dishes', newDish);
      setNewDish({ name: '', description: '', price: '', menu_category_id: data.categories[0]?.id || '' });
      fetchData();
      Swal.fire({
        icon: 'success',
        title: 'Plato Añadido',
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
        text: err.response?.data?.message || 'Error al añadir plato',
        background: '#fdfaf6',
        color: '#2c302e',
        confirmButtonColor: '#e76f51',
      });
    }
  };

  // Eliminar plato con confirmación
  const handleDeleteDish = async id => {
    const result = await Swal.fire({
      title: '¿Confirmar eliminación?',
      text: 'Esta acción no se puede deshacer.',
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
      await axios.delete(`/admin/dishes/${id}`);
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
                className="bg-bg-surface/90 border border-text-main/10 p-6 flex flex-col md:flex-row justify-between md:items-center">
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
                className="bg-bg-surface/90 border border-text-main/10 p-6 flex flex-col md:flex-row justify-between md:items-center">
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
          {/* Formulario para añadir plato */}
          <form
            onSubmit={handleAddDish}
            className="bg-bg-surface/90 border border-text-main/10 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <h3 className="col-span-full font-heading text-primary text-lg mb-2">Añadir Nuevo Plato</h3>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Nombre</label>
              <input
                required
                type="text"
                placeholder="Ej: Ostras..."
                value={newDish.name}
                onChange={e => setNewDish({ ...newDish, name: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Descripción</label>
              <input
                required
                type="text"
                placeholder="Frescas..."
                value={newDish.description}
                onChange={e => setNewDish({ ...newDish, description: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Precio (€)</label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newDish.price}
                onChange={e => setNewDish({ ...newDish, price: e.target.value })}
                className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-1">Categoría</label>
              <select
                required
                value={newDish.menu_category_id}
                onChange={e => setNewDish({ ...newDish, menu_category_id: e.target.value })}
                className="w-full bg-bg-surface border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none text-sm appearance-none">
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
            <button
              type="submit"
              className="bg-primary hover:bg-bg-surface text-black font-bold uppercase tracking-widest text-xs transition-colors p-3 w-full h-[41px]">
              Añadir
            </button>
          </form>

          {/* Lista de platos existentes */}
          <div className="grid grid-cols-1 gap-4">
            {data.menu.map(item => (
              <DishEditRow
                key={item.id}
                item={item}
                fetchData={fetchData}
                handleDeleteDish={handleDeleteDish}
                categories={data.categories}
              />
            ))}
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
    <div className="min-h-screen bg-bg-body flex relative overflow-hidden">
      {/* Luz ambiental decorativa */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

      {/* Barra lateral (solo en desktop) */}
      <aside className="w-64 bg-bg-surface/90 backdrop-blur-xl border-r border-text-main/10 hidden md:flex flex-col relative z-20 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
        <div className="p-10 border-b border-text-main/10 flex flex-col items-center justify-center">
          <span className="text-primary text-2xl mb-2 opacity-80 block font-light">✦</span>
          <span className="text-text-main font-heading tracking-[0.2em] text-lg font-light text-center">
            DG <span className="italic text-primary">MGMT</span>
          </span>
        </div>

        <nav className="flex-grow py-8 px-4 space-y-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[4px] transition-all duration-300 relative group overflow-hidden ${
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
      <main className="flex-grow p-8 md:p-16 relative z-10 overflow-y-auto">
        {/* Cabecera móvil */}
        <div className="flex md:hidden justify-between items-center mb-12 border-b border-text-main/10 pb-6">
          <span className="text-text-main font-heading tracking-[0.2em]">
            <span className="text-primary mr-2">✦</span> DG MGMT
          </span>
          <button onClick={logout} className="text-[10px] uppercase tracking-[3px] text-red-400/70 hover:text-red-400">
            Salir
          </button>
        </div>

        {/* Navegación móvil */}
        <div className="md:hidden flex gap-4 overflow-x-auto mb-8 pb-4">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`whitespace-nowrap uppercase tracking-widest text-xs pb-2 border-b-2 ${activeSection === s.id ? 'border-primary text-primary' : 'border-transparent text-text-muted'}`}>
              {s.label}
            </button>
          ))}
        </div>

        <FadeIn as="header" className="mb-12">
          <span className="block text-primary text-[10px] uppercase tracking-[5px] mb-3 font-body opacity-90">
            Panel de Control Central
          </span>
          <h1 className="text-4xl md:text-5xl font-heading text-text-main uppercase tracking-widest mb-4 font-light">
            {sections.find(s => s.id === activeSection)?.label}
          </h1>
          <div className="w-16 h-[1px] bg-gradient-to-r from-primary to-transparent mb-6"></div>
          <p className="text-text-muted font-light text-sm tracking-wide">
            Gestión en tiempo real de los servicios vinculados a la base de datos.
          </p>
        </FadeIn>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            variants={shouldReduceMotion ? undefined : sectionContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit">
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

// Componente para editar/ver un plato en la lista de admin
const DishEditRow = ({ item, fetchData, handleDeleteDish, categories }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editDish, setEditDish] = useState({ ...item });

  // Guardar cambios del plato editado
  const handleUpdate = async () => {
    try {
      await axios.put(`/admin/dishes/${item.id}`, editDish);
      Swal.fire({
        icon: 'success',
        title: 'Plato Actualizado',
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
        text: err.response?.data?.message || 'No se pudo actualizar',
        background: '#fdfaf6',
        color: '#2c302e',
        confirmButtonColor: '#e76f51',
      });
    }
  };

  // Vista de edición del plato
  if (isEditing) {
    return (
      <div className="bg-bg-surface/90 border border-primary/40 p-6 flex flex-col gap-6 shadow-[0_0_30px_rgba(197,160,89,0.1)] relative mt-4 mb-4 rounded-sm">
        <h4 className="text-primary font-heading uppercase text-xs tracking-widest absolute -top-3 left-6 bg-bg-body px-3 py-1 border border-primary/40 rounded-full">
          Editando Plato
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Nombre</label>
            <input
              type="text"
              value={editDish.name}
              onChange={e => setEditDish({ ...editDish, name: e.target.value })}
              className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 text-sm focus:border-primary outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Descripción</label>
            <input
              type="text"
              value={editDish.description}
              onChange={e => setEditDish({ ...editDish, description: e.target.value })}
              className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 text-sm focus:border-primary outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Precio (€)</label>
            <input
              type="number"
              step="0.01"
              value={editDish.price}
              onChange={e => setEditDish({ ...editDish, price: e.target.value })}
              className="w-full bg-transparent border-b border-text-main/10 text-text-main p-2 text-sm focus:border-primary outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-text-muted text-[10px] uppercase tracking-widest block mb-2">Categoría</label>
            <select
              value={editDish.menu_category_id}
              onChange={e => setEditDish({ ...editDish, menu_category_id: e.target.value })}
              className="w-full bg-bg-surface border-b border-text-main/10 text-text-main p-2 focus:border-primary outline-none text-sm appearance-none cursor-pointer">
              {categories?.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-6 mt-2 border-t border-text-main/10 pt-6">
          <button
            onClick={() => setIsEditing(false)}
            className="text-text-muted hover:text-text-main text-[10px] uppercase tracking-[2px] transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleUpdate}
            className="bg-primary hover:bg-bg-surface text-black font-bold uppercase tracking-widest text-[10px] px-8 py-2.5 transition-colors shadow-[0_0_15px_rgba(197,160,89,0.3)]">
            Guardar Cambios
          </button>
        </div>
      </div>
    );
  }

  // Vista normal del plato (modo lectura)
  return (
    <div className="bg-bg-surface/90 border border-text-main/10 p-4 flex justify-between items-center group">
      <div>
        <h4 className="text-text-main font-heading">{item.name}</h4>
        <p className="text-text-muted text-sm">{parseFloat(item.price).toFixed(2)}€</p>
      </div>
      <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="text-primary hover:text-primary-hover text-xs uppercase tracking-[2px]">
          Editar
        </button>
        <button
          onClick={() => handleDeleteDish(item.id)}
          className="text-red-500 hover:text-red-400 text-xs uppercase tracking-[2px]">
          Eliminar
        </button>
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
    <div className="bg-bg-surface/90 border border-text-main/10 p-6 flex flex-col md:flex-row justify-between md:items-center group">
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
