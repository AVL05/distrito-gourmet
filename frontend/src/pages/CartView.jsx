import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { HiMinus, HiPlus, HiTrash } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const CartView = () => {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const cartItems = useCartStore((state) => state.items);
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

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
          db_id: item.id.toString().startsWith('w') ? parseInt(item.id.replace('w','')) : parseInt(item.id),
          item_type: item.item_type || 'dish',
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: total
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="backdrop-blur-xl bg-white/90 shadow-sm border-gray-100 border border-gray-200 p-16 rounded-sm max-w-2xl w-full animate-fade-in shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-10 flex flex-col items-center">
          <span className="text-primary text-5xl mb-8 opacity-60 font-light">✦</span>
          <h2 className="text-3xl font-heading text-gray-900 tracking-[0.2em] mb-6 drop-shadow-md">
            SU SELECCIÓN ESTÁ <span className="italic font-light text-primary">VACÍA</span>
          </h2>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mb-8"></div>
          <p className="text-gray-500 font-light mb-12 text-lg tracking-wide">
            Le invitamos a explorar nuestra carta y descubrir las creaciones que nuestro chef ha preparado para usted.
          </p>
          <Link to="/menu" className="group relative px-12 py-4 bg-transparent border border-primary text-primary font-body text-xs uppercase tracking-[4px] overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(197,160,89,0.5)]">
            <div className="absolute inset-0 w-0 bg-primary transition-all duration-[400ms] ease-out group-hover:w-full"></div>
            <span className="relative z-10 group-hover:text-black font-semibold transition-colors duration-300">EXPLORAR LA CARTA</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-body min-h-screen pt-40 pb-32 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

      <div className="container max-w-6xl relative z-10">
        <div className="mb-16 text-center animate-fade-in">
          <span className="block text-primary text-xs uppercase tracking-[6px] mb-4 font-body opacity-90">
            Finalizar Pedido
          </span>
          <h1 className="font-heading text-5xl uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-hover to-white mb-6">
            Su Selección
          </h1>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 animate-fade-in">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-8">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center bg-white/90 shadow-sm border-gray-100 backdrop-blur-md border border-gray-100 p-6 hover:border-gray-200 hover:shadow-[0_0_30px_rgba(197,160,89,0.05)] transition-all duration-500"
              >
                {/* Image */}
                <div className="w-24 h-24 mb-6 sm:mb-0 sm:mr-8 flex-shrink-0 relative overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center absolute inset-0 opacity-80"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f8f9fa] flex items-center justify-center absolute inset-0 border border-gray-200">
                      <span className="font-heading text-primary/30 text-xl">DG</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-grow text-center sm:text-left mb-6 sm:mb-0">
                  <h3 className="font-heading text-xl text-gray-900 mb-2 tracking-wide">
                    {item.name}
                  </h3>
                  <p className="text-primary font-light text-lg tracking-wider">
                    {item.price.toFixed(2)}€
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-8">
                  <div className="flex items-center border border-gray-200 bg-white/90 shadow-sm border-gray-100">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white/10 transition-colors"
                    >
                      <HiMinus size={14} />
                    </button>
                    <span className="w-12 text-center text-sm font-light text-gray-900 font-body py-2 border-x border-gray-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white/10 transition-colors"
                    >
                      <HiPlus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-900/40 hover:text-primary transition-colors p-2"
                    title="Eliminar"
                  >
                    <HiTrash size={20} />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-start pt-4">
              <button
                onClick={clearCart}
                className="group flex items-center gap-3 text-xs uppercase tracking-[3px] text-gray-500 hover:text-primary transition-colors"
              >
                <span className="w-4 h-[1px] bg-white/30 group-hover:bg-primary transition-colors"></span>
                Vaciar Selección
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 shadow-sm border-gray-100 backdrop-blur-xl border border-primary/20 p-10 sticky top-32 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <h3 className="font-heading text-2xl text-gray-900 tracking-[0.1em] mb-8 pb-6 border-b border-primary/20 text-center font-light">
                RESUMEN DE <span className="text-primary italic">PEDIDO</span>
              </h3>

              <div className="space-y-6 mb-10 text-base font-light font-body tracking-wide">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Experiencia</span>
                  <span className="text-primary text-sm uppercase tracking-widest mt-1">Premium</span>
                </div>
                <div className="flex justify-between text-gray-900 text-xl pt-6 border-t border-gray-200 mt-6 font-normal">
                  <span>Total (IVA inc.)</span>
                  <span className="font-heading text-primary">{total.toFixed(2)}€</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="group relative w-full py-5 bg-primary text-black font-body text-xs uppercase tracking-[4px] overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(197,160,89,0.5)] mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 w-0 bg-white transition-all duration-[400ms] ease-out group-hover:w-full"></div>
                <span className="relative z-10 font-bold tracking-[5px] group-hover:text-black">
                  {isProcessing ? "PROCESANDO..." : "TRAMITAR"}
                </span>
              </button>

              <div className="text-center">
                <Link
                  to="/menu"
                  className="text-xs uppercase tracking-[3px] text-gray-500 hover:text-gray-900 border-b border-transparent hover:border-gray-1000 pb-1 transition-all"
                >
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
