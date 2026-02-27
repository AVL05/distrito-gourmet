import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { HiMinus, HiPlus, HiTrash } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CartView = () => {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const cartItems = useCartStore(state => state.items);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!isAuthenticated()) {
      Swal.fire({
        icon: 'info',
        title: 'Acceso Requerido',
        text: 'Por favor, inicie sesión para finalizar su pedido.',
        background: '#fdfaf6',
        color: '#2c302e',
        confirmButtonColor: '#e76f51',
      });
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) return;

    setIsProcessing(true);
    try {
      await axios.post('/orders', {
        items: cartItems.map(item => ({
          db_id: item.id.toString().startsWith('w') ? parseInt(item.id.replace('w', '')) : parseInt(item.id),
          item_type: item.item_type || 'dish',
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total,
      });

      clearCart();
      Swal.fire({
        icon: 'success',
        title: 'Pedido Confirmado',
        text: 'Su solicitud ha sido procesada con éxito.',
        background: '#fdfaf6',
        color: '#2c302e',
        confirmButtonColor: '#e76f51',
      });
      navigate('/dashboard'); // or /orders if it exists
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al procesar su pedido. Inténtelo de nuevo.',
        background: '#fdfaf6',
        color: '#2c302e',
        confirmButtonColor: '#e76f51',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-bg-body relative overflow-hidden">
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-text-main/5 -translate-x-1/2 z-0 hidden md:block"></div>
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-text-main/5 -translate-y-1/2 z-0 hidden md:block"></div>
        <div className="bg-bg-surface border border-text-main/10 p-12 md:p-24 max-w-2xl w-full animate-fade-in relative z-10 flex flex-col items-center">
          <span className="text-text-main text-[12px] uppercase tracking-[3px] mb-8 font-body font-bold">
            / 00 Vacío
          </span>
          <h2 className="text-4xl md:text-5xl font-heading text-text-main leading-tight mb-8">
            Su Selección <br />
            <span className="italic font-light text-primary">Inactiva</span>
          </h2>
          <div className="w-16 h-[1px] bg-text-main/10 mb-8"></div>
          <p className="text-text-main font-body font-medium mb-12 text-[15px] tracking-wide leading-relaxed opacity-90">
            Le invitamos a explorar nuestra carta y descubrir las creaciones que nuestro chef ha preparado para usted.
          </p>
          <Link
            to="/menu"
            className="group relative px-10 py-4 bg-transparent border border-text-main text-text-main font-body text-[12px] uppercase tracking-[2px] overflow-hidden transition-all duration-500 hover:border-text-main">
            <div className="absolute inset-0 w-0 bg-text-main transition-all duration-[400ms] ease-out group-hover:w-full"></div>
            <span className="relative z-10 group-hover:text-white font-bold transition-colors duration-300">
              Explorar la Carta
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-body min-h-screen pt-32 sm:pt-40 pb-32 px-4 relative overflow-hidden">
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-text-main/5 -translate-x-1/2 z-0 hidden md:block"></div>

      <div className="container max-w-6xl relative z-10">
        <div className="text-center mb-16 sm:mb-24 animate-fade-in relative">
          <span className="block text-text-main text-[12px] uppercase tracking-[3px] mb-6 sm:mb-8 font-body font-bold">
            / 00 Resumen
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl text-text-main mb-8 leading-tight">
            Su <span className="italic text-primary">Selección</span>
          </h1>
          <div className="w-16 h-[1px] bg-text-main/10 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-16 animate-fade-in">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-0 border-t border-text-main/10">
            {cartItems.map(item => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-8 border-b border-text-main/10 hover:bg-text-main/5 transition-colors duration-500 gap-6">
                <div className="flex items-center gap-8 w-full sm:w-auto">
                  {/* Details */}
                  <div className="text-left">
                    <h3 className="font-heading text-3xl text-text-main mb-2 leading-tight">{item.name}</h3>
                    <p className="text-text-muted font-body font-light text-[13px] tracking-widest uppercase">
                      {item.price.toFixed(2)}€ / Ud.
                    </p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
                  <div className="flex items-center border border-text-main/20 bg-transparent">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-main hover:bg-text-main/5 transition-colors">
                      <HiMinus size={12} />
                    </button>
                    <span className="w-12 text-center text-[13px] font-light text-text-main font-body py-2 border-x border-text-main/20">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-main hover:bg-text-main/5 transition-colors">
                      <HiPlus size={12} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-text-muted hover:text-red-800 transition-colors p-2"
                    title="Eliminar">
                    <HiTrash size={18} />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-start pt-6">
              <button
                onClick={clearCart}
                className="font-body text-[11px] uppercase tracking-[2px] text-text-muted border-b border-transparent hover:border-text-main hover:text-text-main transition-colors pb-1 font-medium">
                Vaciar Selección
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-bg-surface border border-text-main/10 p-8 sm:p-10 sticky top-24 sm:top-32">
              <h3 className="font-heading text-3xl text-text-main mb-8 pb-6 border-b border-text-main/10">Resumen</h3>

              <div className="space-y-6 mb-12 text-[14px] font-light font-body tracking-wide text-text-muted">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Servicio Extra</span>
                  <span className="text-primary uppercase text-[11px] tracking-widest mt-1 font-bold">Premium</span>
                </div>
                <div className="flex justify-between text-text-main text-xl pt-6 border-t border-text-main/10 mt-6 font-normal">
                  <span>Total (IVA inc.)</span>
                  <span className="font-heading">{total.toFixed(2)}€</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="group relative w-full py-5 bg-transparent border border-text-main text-text-main font-body text-[12px] uppercase tracking-[3px] overflow-hidden transition-all duration-500 hover:border-text-main mb-8 disabled:opacity-50 disabled:cursor-not-allowed">
                <div className="absolute inset-0 w-0 bg-text-main transition-all duration-[400ms] ease-out group-hover:w-full z-0"></div>
                <span className="relative z-10 font-bold group-hover:text-bg-body transition-colors duration-300">
                  {isProcessing ? 'PROCESANDO...' : 'TRAMITAR COMPRA'}
                </span>
              </button>

              <div className="text-center">
                <Link
                  to="/menu"
                  className="font-body text-[10px] uppercase tracking-[3px] text-text-muted border-b border-transparent hover:border-text-main hover:text-text-main transition-colors pb-1">
                  Regresar a la Carta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;
