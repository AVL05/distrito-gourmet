import { useAuthStore } from "@/store/auth";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminView = () => {
  const { logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState("orders");
  const [data, setData] = useState({ orders: [], menu: [], reservations: [], users: [], categories: [] });
  const [loading, setLoading] = useState(false);

  // Modal / Form state for new Dish
  const [newDish, setNewDish] = useState({ name: '', description: '', price: '', imageFile: null, menu_category_id: '' });

  const sections = [
    { id: "orders", label: "Pedidos" },
    { id: "reservations", label: "Reservas" },
    { id: "menu", label: "Carta (Platos)" },
    { id: "users", label: "Usuarios" }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeSection === "orders") {
        const res = await axios.get('/admin/orders');
        setData(d => ({ ...d, orders: res.data }));
      } else if (activeSection === "reservations") {
        const res = await axios.get('/admin/reservations');
        setData(d => ({ ...d, reservations: res.data }));
      } else if (activeSection === "menu") {
        const res = await axios.get('/dishes');
        setData(d => ({ ...d, menu: res.data.dishes || [], categories: res.data.categories || [] }));
        if (res.data.categories?.length > 0 && !newDish.menu_category_id) {
           setNewDish(prev => ({ ...prev, menu_category_id: res.data.categories[0].id }));
        }
      } else if (activeSection === "users") {
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

  useEffect(() => {
    fetchData();
  }, [activeSection]);

  // Orders Actions
  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await axios.patch(`/admin/orders/${id}`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Menu Actions
  const handleAddDish = async (e) => {
    e.preventDefault();
    if (!newDish.imageFile) {
      return Swal.fire({ icon: 'warning', title: 'Falta Imagen', text: 'Por favor adjunte una imagen para el plato', background: '#fdfaf6', color: '#2c302e', confirmButtonColor: '#e76f51' });
    }
    if (newDish.imageFile.size > 2 * 1024 * 1024) {
      return Swal.fire({ icon: 'error', title: 'Imagen muy grande', text: 'El archivo debe pesar menos de 2MB', background: '#fdfaf6', color: '#2c302e', confirmButtonColor: '#e76f51' });
    }
    if (!newDish.menu_category_id) {
       return Swal.fire({ icon: 'error', title: 'Oops', text: 'Debe seleccionar una categoría', background: '#fdfaf6', color: '#2c302e', confirmButtonColor: '#e76f51' });
    }

    const formData = new FormData();
    formData.append('name', newDish.name);
    formData.append('description', newDish.description);
    formData.append('price', newDish.price);
    formData.append('menu_category_id', newDish.menu_category_id);
    formData.append('image', newDish.imageFile);

    try {
      await axios.post('/admin/dishes', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setNewDish({ name: '', description: '', price: '', imageFile: null, menu_category_id: data.categories[0]?.id || '' });
      fetchData();
      Swal.fire({ icon: 'success', title: 'Plato Añadido', background: '#fdfaf6', color: '#2c302e', confirmButtonColor: '#e76f51', timer: 1500 });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Error al añadir plato', background: '#fdfaf6', color: '#2c302e', confirmButtonColor: '#e76f51' });
    }
  };

  const handleDeleteDish = async (id) => {
    const result = await Swal.fire({
      title: '¿Confirmar eliminación?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      background: '#fdfaf6',
      color: '#2c302e',
      confirmButtonColor: '#e76f51',
      cancelButtonColor: '#888',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/admin/dishes/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Reservations Actions
  const handleUpdateReservationStatus = async (id, status) => {
    try {
      await axios.patch(`/admin/reservations/${id}`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const renderContent = () => {
    if (loading) return <div className="text-gray-500 animate-pulse">Cargando datos del servidor...</div>;

    if (activeSection === "orders") {
      return (
        <div className="space-y-6">
          {data.orders.length === 0 ? <p className="text-gray-500">No hay pedidos registrados.</p> : (
            data.orders.map(order => (
              <div key={order.id} className="bg-white/90 shadow-sm border-gray-100 border border-gray-200 p-6 flex flex-col md:flex-row justify-between md:items-center">
                <div className="mb-4 md:mb-0">
                  <span className="text-primary text-xs tracking-widest uppercase block mb-1">Pedido #{order.id}</span>
                  <p className="text-gray-900">Cliente: {order.user?.name || `ID: ${order.user_id}`}</p>
                  <p className="text-gray-500 text-sm">Total: {parseFloat(order.total).toFixed(2)}€</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Artículos: {order.items?.map(i => `${i.quantity}x ${i.item_name}`).join(', ')}
                  </p>
                </div>
                <div className="flex gap-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                    className="bg-white border border-gray-200 text-gray-900 rounded p-2 text-sm"
                  >
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

    if (activeSection === "reservations") {
      return (
        <div className="space-y-6">
          {data.reservations.length === 0 ? <p className="text-gray-500">No hay reservas registradas.</p> : (
            data.reservations.map(res => (
              <div key={res.id} className="bg-white/90 shadow-sm border-gray-100 border border-gray-200 p-6 flex flex-col md:flex-row justify-between md:items-center">
                <div className="mb-4 md:mb-0">
                  <span className="text-primary text-xs tracking-widest uppercase block mb-1">Reserva #{res.id}</span>
                  <p className="text-gray-900">Cliente: {res.user?.name || `ID: ${res.user_id}`}</p>
                  <p className="text-gray-500 text-sm">Fecha: {new Date(res.reservation_time).toLocaleString()}</p>
                  <p className="text-gray-500 text-sm">Personas: {res.people}</p>
                </div>
                <div className="flex gap-4">
                  <select
                    value={res.status}
                    onChange={(e) => handleUpdateReservationStatus(res.id, e.target.value)}
                    className="bg-white border border-gray-200 text-gray-900 rounded p-2 text-sm"
                  >
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

    if (activeSection === "menu") {
      return (
        <div className="space-y-8">
          {/* Add Dish Form */}
          <form onSubmit={handleAddDish} className="bg-white/90 shadow-sm border-gray-100 border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
            <h3 className="col-span-full font-heading text-primary text-lg mb-2">Añadir Nuevo Plato</h3>
            <div>
              <label className="text-gray-500 text-[10px] uppercase tracking-widest block mb-1">Nombre</label>
              <input required type="text" placeholder="Ej: Ostras..." value={newDish.name} onChange={e => setNewDish({...newDish, name: e.target.value})} className="w-full bg-transparent border-b border-gray-200 text-gray-900 p-2 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="text-gray-500 text-[10px] uppercase tracking-widest block mb-1">Descripción</label>
              <input required type="text" placeholder="Frescas..." value={newDish.description} onChange={e => setNewDish({...newDish, description: e.target.value})} className="w-full bg-transparent border-b border-gray-200 text-gray-900 p-2 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="text-gray-500 text-[10px] uppercase tracking-widest block mb-1">Precio (€)</label>
              <input required type="number" step="0.01" placeholder="0.00" value={newDish.price} onChange={e => setNewDish({...newDish, price: e.target.value})} className="w-full bg-transparent border-b border-gray-200 text-gray-900 p-2 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="text-gray-500 text-[10px] uppercase tracking-widest block mb-1">Categoría</label>
              <select required value={newDish.menu_category_id} onChange={e => setNewDish({...newDish, menu_category_id: e.target.value})} className="w-full bg-white border-b border-gray-200 text-gray-900 p-2 focus:border-primary outline-none text-sm appearance-none">
                <option value="" disabled>Seleccionar...</option>
                {data.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-500 text-[10px] uppercase tracking-widest block mb-2">Pulsar para Subir Imagen (Max 2MB)</label>
              <input required type="file" accept="image/*" onChange={e => setNewDish({...newDish, imageFile: e.target.files[0]})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 outline-none cursor-pointer" />
            </div>
            <button type="submit" className="bg-primary hover:bg-white text-black font-bold uppercase tracking-widest text-xs transition-colors p-3 w-full h-[41px]">Añadir</button>
          </form>

          {/* Dish List */}
          <div className="grid grid-cols-1 gap-4">
            {data.menu.map(item => (
              <DishEditRow key={item.id} item={item} fetchData={fetchData} handleDeleteDish={handleDeleteDish} categories={data.categories} />
            ))}
          </div>
        </div>
      );
    }

    if (activeSection === "users") {
      return (
        <div className="space-y-6">
          {data.users?.length === 0 ? <p className="text-gray-500">No hay usuarios registrados.</p> : (
            data.users?.map(u => (
               <UserEditRow key={u.id} user={u} fetchData={fetchData} />
            ))
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-bg-body flex relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

      {/* Sidebar */}
      <aside className="w-64 bg-white/90 shadow-sm border-gray-100 backdrop-blur-xl border-r border-gray-100 hidden md:flex flex-col relative z-20 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
        <div className="p-10 border-b border-gray-100 flex flex-col items-center justify-center">
          <span className="text-primary text-2xl mb-2 opacity-80 block font-light">✦</span>
          <span className="text-gray-900 font-heading tracking-[0.2em] text-lg font-light text-center">
            DG <span className="italic text-primary">MGMT</span>
          </span>
        </div>

        <nav className="flex-grow py-8 px-4 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[4px] transition-all duration-300 relative group overflow-hidden ${
                activeSection === section.id
                  ? "text-black bg-primary"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <div className={`absolute inset-0 w-0 bg-white/10 transition-all duration-[400ms] ease-out group-hover:w-full z-0 ${activeSection === section.id ? "hidden" : ""}`}></div>
              <span className="relative z-10">{section.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full text-left px-6 py-4 text-[10px] uppercase tracking-[4px] text-red-400/70 hover:text-red-400 transition-colors group relative overflow-hidden"
          >
            <div className="absolute inset-0 w-0 bg-red-900/10 transition-all duration-[400ms] ease-out group-hover:w-full z-0"></div>
            <span className="relative z-10">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 md:p-16 relative z-10 overflow-y-auto">
        <div className="flex md:hidden justify-between items-center mb-12 border-b border-gray-200 pb-6">
          <span className="text-gray-900 font-heading tracking-[0.2em]"><span className="text-primary mr-2">✦</span> DG MGMT</span>
          <button onClick={logout} className="text-[10px] uppercase tracking-[3px] text-red-400/70 hover:text-red-400">
            Salir
          </button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex gap-4 overflow-x-auto mb-8 pb-4">
          {sections.map(s => (
             <button key={s.id} onClick={() => setActiveSection(s.id)} className={`whitespace-nowrap uppercase tracking-widest text-xs pb-2 border-b-2 ${activeSection === s.id ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}>
               {s.label}
             </button>
          ))}
        </div>

        <header className="mb-12 animate-fade-in">
          <span className="block text-primary text-[10px] uppercase tracking-[5px] mb-3 font-body opacity-90">
            Panel de Control Central
          </span>
          <h1 className="text-4xl md:text-5xl font-heading text-gray-900 uppercase tracking-widest mb-4 font-light">
            {sections.find((s) => s.id === activeSection)?.label}
          </h1>
          <div className="w-16 h-[1px] bg-gradient-to-r from-primary to-transparent mb-6"></div>
          <p className="text-gray-500 font-light text-sm tracking-wide">
            Gestión en tiempo real de los servicios vinculados a la base de datos.
          </p>
        </header>

        <div className="animate-fade-in delay-100">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const DishEditRow = ({ item, fetchData, handleDeleteDish, categories }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editDish, setEditDish] = useState({ ...item, imageFile: null });

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('name', editDish.name);
    formData.append('description', editDish.description);
    formData.append('price', editDish.price);
    formData.append('menu_category_id', editDish.menu_category_id);

    if (editDish.imageFile) {
      if (editDish.imageFile.size > 2 * 1024 * 1024) {
        return Swal.fire({ icon: 'error', title: 'Imagen muy grande', text: 'Debe pesar menos de 2MB', background: '#fdfaf6', color: '#2c302e', confirmButtonColor: '#e76f51' });
      }
      formData.append('image', editDish.imageFile);
    }

    // Laravel API para upload archivos en route resoure PUT requiere esto:
    formData.append('_method', 'PUT');

    try {
      await axios.post(`/admin/dishes/${item.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      Swal.fire({ icon: 'success', title: 'Plato Actualizado', background: '#fdfaf6', color: '#2c302e', confirmButtonColor: '#e76f51', timer: 1500 });
      setIsEditing(false);
      fetchData();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'No se pudo actualizar', background: '#fdfaf6', color: '#2c302e', confirmButtonColor: '#e76f51' });
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white/90 shadow-sm border-gray-100 border border-primary/40 p-6 flex flex-col gap-6 shadow-[0_0_30px_rgba(197,160,89,0.1)] relative mt-4 mb-4 rounded-sm">
        <h4 className="text-primary font-heading uppercase text-xs tracking-widest absolute -top-3 left-6 bg-bg-body px-3 py-1 border border-primary/40 rounded-full">Editando Plato</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-2">
           <div>
              <label className="text-gray-500 text-[10px] uppercase tracking-widest block mb-2">Nombre</label>
              <input type="text" value={editDish.name} onChange={e => setEditDish({...editDish, name: e.target.value})} className="w-full bg-transparent border-b border-gray-200 text-gray-900 p-2 text-sm focus:border-primary outline-none transition-colors" />
           </div>
           <div>
              <label className="text-gray-500 text-[10px] uppercase tracking-widest block mb-2">Descripción</label>
              <input type="text" value={editDish.description} onChange={e => setEditDish({...editDish, description: e.target.value})} className="w-full bg-transparent border-b border-gray-200 text-gray-900 p-2 text-sm focus:border-primary outline-none transition-colors" />
           </div>
           <div>
              <label className="text-gray-500 text-[10px] uppercase tracking-widest block mb-2">Precio (€)</label>
              <input type="number" step="0.01" value={editDish.price} onChange={e => setEditDish({...editDish, price: e.target.value})} className="w-full bg-transparent border-b border-gray-200 text-gray-900 p-2 text-sm focus:border-primary outline-none transition-colors" />
           </div>
           <div>
              <label className="text-gray-500 text-[10px] uppercase tracking-widest block mb-2">Categoría</label>
              <select value={editDish.menu_category_id} onChange={e => setEditDish({...editDish, menu_category_id: e.target.value})} className="w-full bg-white border-b border-gray-200 text-gray-900 p-2 focus:border-primary outline-none text-sm appearance-none cursor-pointer">
                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
           </div>
           <div>
              <label className="text-gray-500 text-[10px] uppercase tracking-widest block mb-2">Sustituir Foto (Opcional)</label>
              <input type="file" accept="image/*" onChange={e => setEditDish({...editDish, imageFile: e.target.files[0]})} className="w-full text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 outline-none cursor-pointer mt-1 transition-colors" />
           </div>
        </div>

        <div className="flex justify-end gap-6 mt-2 border-t border-gray-200 pt-6">
          <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-900 text-[10px] uppercase tracking-[2px] transition-colors">Cancelar</button>
          <button onClick={handleUpdate} className="bg-primary hover:bg-white text-black font-bold uppercase tracking-widest text-[10px] px-8 py-2.5 transition-colors shadow-[0_0_15px_rgba(197,160,89,0.3)]">Guardar Cambios</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 shadow-sm border-gray-100 border border-gray-100 p-4 flex justify-between items-center group">
      <div>
        <h4 className="text-gray-900 font-heading">{item.name}</h4>
        <p className="text-gray-500 text-sm">{parseFloat(item.price).toFixed(2)}€</p>
      </div>
      <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setIsEditing(true)} className="text-primary hover:text-primary-hover text-xs uppercase tracking-[2px]">Editar</button>
        <button onClick={() => handleDeleteDish(item.id)} className="text-red-500 hover:text-red-400 text-xs uppercase tracking-[2px]">Eliminar</button>
      </div>
    </div>
  );
};

const UserEditRow = ({ user, fetchData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState({ name: user.name, role: user.role, email: user.email, password: '' });

  const handleUpdate = async () => {
    try {
      await axios.put(`/admin/users/${user.id}`, editUser);
      Swal.fire({ icon: 'success', title: 'Usuario Actualizado', background: '#fdfaf6', color: '#2c302e', confirmButtonColor: '#e76f51', timer: 1500 });
      setIsEditing(false);
      fetchData();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar', background: '#fdfaf6', color: '#2c302e', confirmButtonColor: '#e76f51' });
    }
  };

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
      cancelButtonText: 'Cancelar'
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
      <div className="bg-white/90 shadow-sm border-gray-100 border border-primary/40 p-4 flex flex-col md:flex-row gap-4 items-center">
        <input type="text" value={editUser.name} onChange={e => setEditUser({...editUser, name: e.target.value})} className="bg-transparent border-b border-gray-200 text-gray-900 p-2 text-sm flex-1" />
        <input type="email" value={editUser.email} onChange={e => setEditUser({...editUser, email: e.target.value})} className="bg-transparent border-b border-gray-200 text-gray-900 p-2 text-sm flex-1" />
        <select value={editUser.role} onChange={e => setEditUser({...editUser, role: e.target.value})} className="bg-white border border-gray-200 text-gray-900 p-2 text-sm">
          <option value="client">Cliente</option>
          <option value="admin">Admin</option>
        </select>
        <input type="password" placeholder="Nueva Clave..." value={editUser.password} onChange={e => setEditUser({...editUser, password: e.target.value})} className="bg-transparent border-b border-gray-200 text-gray-900 p-2 text-sm w-32" />

        <div className="flex items-center gap-2">
          <button onClick={handleUpdate} className="text-primary hover:text-gray-900 text-xs uppercase tracking-[2px]">Guardar</button>
          <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-900 text-xs uppercase tracking-[2px]">Cerrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 shadow-sm border-gray-100 border border-gray-200 p-6 flex flex-col md:flex-row justify-between md:items-center group">
      <div className="mb-4 md:mb-0">
        <span className="text-primary text-xs tracking-widest uppercase block mb-1">Role: {user.role?.toUpperCase()}</span>
        <p className="text-gray-900">{user.name}</p>
        <p className="text-gray-500 text-sm">{user.email}</p>
      </div>
      <div className="flex gap-4 opacity-50 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setIsEditing(true)} className="text-primary hover:text-primary-hover text-xs uppercase tracking-[2px]">Editar</button>
        {user.id !== 1 && ( // Protegemos de que el admin padre no pueda borrarse a sí mismo fácilmente desde aquí
          <button onClick={handleDelete} className="text-red-500 hover:text-red-400 text-xs uppercase tracking-[2px]">Eliminar</button>
        )}
      </div>
    </div>
  );
};

export default AdminView;
