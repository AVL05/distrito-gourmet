import { useAuthStore } from '@/store/auth';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { HiClock, HiShoppingBag, HiCheckCircle } from 'react-icons/hi';
import { PageTransition, FadeIn, StaggerList, StaggerItem, HoverCard } from '@/motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const OrderItem = ({ order }) => {
  const [showDetails, setShowDetails] = useState(false);
  const detailsRef = useRef(null);

  const date = new Date(order.created_at).toLocaleDateString();
  const pickupTime = order.pickup_time
    ? new Date(order.pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  const getStatusColor = status => {
    switch (status) {
      case 'received':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'preparing':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'ready':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'delivered':
        return 'text-primary bg-primary/10 border-primary/20';
      default:
        return 'text-text-muted bg-text-muted/10 border-text-main/10';
    }
  };

  const getStatusLabel = status => {
    switch (status) {
      case 'received':
        return 'Recibido';
      case 'preparing':
        return 'Preparando';
      case 'ready':
        return 'Listo para Recogida';
      case 'delivered':
        return 'Recogido';
      default:
        return status;
    }
  };

  useGSAP(
    () => {
      if (showDetails) {
        gsap.fromTo(
          detailsRef.current,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.out' }
        );
      } else {
        gsap.to(detailsRef.current, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
      }
    },
    { dependencies: [showDetails] }
  );

  return (
    <div className="group relative bg-bg-surface/50 border border-text-main/10 p-6 sm:p-8 hover:bg-text-main/[0.07] transition-all duration-300 rounded-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary rounded-sm mt-1 flex-shrink-0">
            <HiShoppingBag size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="font-heading text-xl text-text-main uppercase tracking-tight">Pedido #{order.id}</span>
              <span
                className={`text-[9px] uppercase tracking-widest px-2.5 py-0.5 border rounded-full font-bold ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] font-body text-text-muted uppercase tracking-[1px]">
              <span className="flex items-center gap-1.5 font-medium">
                <HiClock size={14} className="text-primary/70" /> {date}
              </span>
              {pickupTime && order.status !== 'delivered' && (
                <span className="flex items-center gap-1.5 font-medium text-primary">
                  <HiCheckCircle size={14} /> Recogida a las {pickupTime}
                </span>
              )}
              {order.status === 'delivered' && (
                <span className="flex items-center gap-1.5 font-medium text-primary opacity-70">
                  <HiCheckCircle size={14} /> Finalizado
                </span>
              )}
              <span className="font-bold text-text-main">Total: {parseFloat(order.total).toFixed(2)}€</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full md:w-auto px-6 py-2 bg-text-main text-bg-body text-[10px] uppercase tracking-[2px] font-bold hover:bg-primary-hover transition-all duration-300">
            {showDetails ? 'Ocultar Detalles' : 'Ver pedido'}
          </button>
        </div>
      </div>

      <div ref={detailsRef} className="overflow-hidden h-0 opacity-0">
        <div className="mt-8 pt-8 border-t border-text-main/10 space-y-6">
          <p className="text-[10px] uppercase tracking-[3px] text-text-muted font-bold flex items-center gap-2">
            <span className="w-1 h-1 bg-primary rounded-full"></span> Detalle del Pedido
          </p>

          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-sm font-body py-3 border-b border-text-main/5 last:border-0 hover:bg-text-main/[0.02] px-2 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="w-7 h-7 flex items-center justify-center bg-primary/5 text-[10px] font-bold text-primary border border-primary/10 rounded-full">
                    {item.quantity}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-text-main font-medium tracking-tight uppercase text-[13px]">
                      {item.item_name}
                    </span>
                    <span className="text-[10px] text-text-muted tracking-widest">
                      {parseFloat(item.price).toFixed(2)}€ / Ud.
                    </span>
                  </div>
                </div>
                <span className="text-text-main font-heading text-base font-medium">
                  {(item.quantity * item.price).toFixed(2)}€
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-6 px-2 border-t border-text-main/10 text-text-main mt-4">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-[3px] text-text-muted mb-1 font-bold">
                Resumen de Pago
              </span>
              <span className="text-[12px] font-medium italic opacity-70">
                Abonado mediante:{' '}
                {order.payment_method === 'card'
                  ? 'Tarjeta Bancaria'
                  : order.payment_method === 'paypal'
                    ? 'PayPal'
                    : 'Efectivo en Local'}
              </span>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-[3px] text-text-muted mb-1 font-bold">Suma Total</div>
              <div className="text-2xl font-heading text-primary leading-none">
                {parseFloat(order.total).toFixed(2)}€
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardView = () => {
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <PageTransition className="min-h-screen bg-bg-body pt-40 pb-32 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

      <div className="container max-w-5xl relative z-10">
        <FadeIn className="flex flex-col md:flex-row justify-between items-end mb-12 sm:mb-16 gap-6 sm:gap-8 border-b border-text-main/10 pb-8">
          <div>
            <span className="block text-primary text-[10px] uppercase tracking-[5px] mb-3 font-body opacity-90">
              Área Privada
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl text-text-main uppercase tracking-widest leading-tight">
              Bienvenido,
              <br />
              <span className="italic text-primary-hover font-light">{user?.name || 'Huésped'}</span>
            </h1>
            <p className="text-text-muted font-light mt-4 tracking-wide text-sm">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="group relative px-6 sm:px-8 py-3 bg-transparent border border-text-main/20 text-text-muted font-body text-[10px] uppercase tracking-[3px] overflow-hidden transition-all duration-300 hover:border-red-500/50 w-full md:w-auto text-center">
            <div className="absolute inset-0 w-0 bg-red-900/20 transition-all duration-[400ms] ease-out group-hover:w-full"></div>
            <span className="relative z-10 group-hover:text-red-800 transition-colors duration-300">Cerrar Sesión</span>
          </button>
        </FadeIn>

        <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <StaggerItem>
            <HoverCard className="group bg-bg-surface/90 backdrop-blur-md border border-text-main/10 p-8 sm:p-10 hover:border-primary/40 hover:shadow-[0_0_40px_rgba(166,138,86,0.15)] transition-all duration-500 cursor-pointer relative overflow-hidden h-full">
              <Link to="/reservations" className="block h-full relative z-10">
                <span className="text-primary text-3xl mb-6 block font-light opacity-80 group-hover:scale-110 transition-transform duration-500">
                  ✦
                </span>
                <h3 className="font-heading text-2xl text-text-main mb-3 tracking-wide">
                  Mis <span className="italic text-primary-hover">Reservas</span>
                </h3>
                <p className="text-text-muted text-sm font-light leading-relaxed mb-8">
                  Gestione sus futuras experiencias gastronómicas y consulte el historial de visitas.
                </p>
                <div className="mt-auto">
                  <span className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[3px] text-primary transition-all group-hover:text-text-main">
                    Ver Detalles{' '}
                    <span className="w-6 h-[1px] bg-primary group-hover:bg-text-main transition-colors"></span>
                  </span>
                </div>
              </Link>
            </HoverCard>
          </StaggerItem>

          <StaggerItem>
            <HoverCard className="group bg-bg-surface/90 backdrop-blur-md border border-text-main/10 p-8 sm:p-10 hover:border-primary/40 hover:shadow-[0_0_40px_rgba(166,138,86,0.15)] transition-all duration-500 cursor-pointer relative overflow-hidden h-full">
              <Link to="/profile" className="block h-full relative z-10">
                <span className="text-primary text-3xl mb-6 block font-light opacity-80 group-hover:scale-110 transition-transform duration-500">
                  ✧
                </span>
                <h3 className="font-heading text-2xl text-text-main mb-3 tracking-wide">
                  Datos <span className="italic text-primary-hover">Personales</span>
                </h3>
                <p className="text-text-muted text-sm font-light leading-relaxed mb-8">
                  Actualice sus preferencias, alergias y configuración de contacto.
                </p>
                <div className="mt-auto">
                  <span className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[3px] text-primary transition-all group-hover:text-text-main">
                    Editar Perfil{' '}
                    <span className="w-6 h-[1px] bg-primary group-hover:bg-text-main transition-colors"></span>
                  </span>
                </div>
              </Link>
            </HoverCard>
          </StaggerItem>

          <StaggerItem>
            <HoverCard className="group bg-bg-surface/90 backdrop-blur-md border border-primary/20 p-8 sm:p-10 hover:border-primary/60 hover:shadow-[0_0_40px_rgba(166,138,86,0.15)] transition-all duration-500 cursor-pointer relative overflow-hidden h-full">
              <Link to="/menu" className="block h-full relative z-10">
                <span className="text-primary text-3xl mb-6 block font-light opacity-80 group-hover:scale-110 transition-transform duration-500">
                  ⋆
                </span>
                <h3 className="font-heading text-2xl text-text-main mb-3 tracking-wide">
                  Carta <span className="italic text-primary-hover">Gourmet</span>
                </h3>
                <p className="text-text-muted text-sm font-light leading-relaxed mb-8">
                  Explore nuestras nuevas creaciones y realice su pedido para disfrutar en casa.
                </p>
                <div className="mt-auto">
                  <span className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[3px] text-primary transition-all group-hover:text-text-main">
                    Ver Menú <span className="w-6 h-[1px] bg-primary group-hover:bg-text-main transition-colors"></span>
                  </span>
                </div>
              </Link>
            </HoverCard>
          </StaggerItem>
        </StaggerList>

        <FadeIn
          delay={0.3}
          className="mt-16 bg-bg-surface/90 backdrop-blur-md border border-text-main/10 p-8 sm:p-10 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 border-b border-text-main/10 pb-6">
            <h3 className="font-heading text-2xl text-text-main uppercase tracking-[4px] font-light">
              Historial de <span className="italic text-primary-hover font-normal">Pedidos</span>
            </h3>
            {orders.length > 0 && (
              <span className="text-[10px] uppercase tracking-[3px] font-bold text-text-main/40">
                {orders.length} pedidos encontrados
              </span>
            )}
          </div>

          <div>
            {isLoading ? (
              <div className="py-16 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-text-muted text-[10px] uppercase tracking-[3px]">Cargando historial...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(order => (
                  <OrderItem key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-text-main/5 border border-text-main/10 flex items-center justify-center text-text-main/20 rounded-full mb-8">
                  <HiShoppingBag size={32} />
                </div>
                <p className="text-text-main font-heading text-2xl mb-4 italic font-light">Sin Registros</p>
                <p className="text-text-muted font-body font-light text-sm max-w-xs mx-auto mb-10 leading-relaxed">
                  Aún no ha realizado ningún pedido gourmet para llevar.
                </p>
                <Link
                  to="/menu"
                  className="px-8 py-3 border border-text-main text-text-main font-body text-[10px] uppercase tracking-[3px] hover:bg-text-main hover:text-white transition-all duration-500">
                  Explorar la Carta
                </Link>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
};

export default DashboardView;
