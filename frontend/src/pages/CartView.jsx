import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import {
  HiMinus,
  HiPlus,
  HiTrash,
  HiCreditCard,
  HiCash,
  HiArrowLeft,
  HiCheckCircle,
} from "react-icons/hi";
import { FaPaypal } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "@/services/api";
import Swal from "sweetalert2";
import { PageTransition, FadeIn } from "@/motion";

// Gestión del carrito de compras y proceso de finalización de pedido
const CartView = () => {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState("cart"); // 'cart' or 'checkout'
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [pickupTime, setPickupTime] = useState("");

  // Calcula las horas de recogida disponibles para hoy y mañana
  const generatePickupOptions = () => {
    const options = [];
    const now = new Date();

    // Intervalos de 30 min entre 13:00-15:30 y 20:00-22:30
    const timeRanges = [
      { start: 13, end: 15.5, label: "Comida" },
      { start: 20, end: 22.5, label: "Cena" },
    ];

    // Función auxiliar para añadir slots de un día
    const addSlotsForDay = (date, isToday) => {
      timeRanges.forEach((range) => {
        for (let h = range.start; h <= range.end; h += 0.5) {
          const hours = Math.floor(h);
          const minutes = (h % 1) * 60;
          const timeDate = new Date(date);
          timeDate.setHours(hours, minutes, 0, 0);

          if (timeDate > now || !isToday) {
            const timeStr = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
            const dayLabel = isToday ? "Hoy" : "Mañana";
            options.push({
              label: `${dayLabel} - ${timeStr} (${range.label})`,
              value: `${isToday ? "today" : "tomorrow"}-${timeStr}`,
              actualTime: timeStr,
              date: isToday ? "hoy" : "mañana",
            });
          }
        }
      });
    };

    addSlotsForDay(now, true);
    // Si quedan menos de 3 opciones hoy, o ya es tarde, añadir mañana
    if (options.length < 5) {
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      addSlotsForDay(tomorrow, false);
    }

    return options;
  };

  const pickupOptions = generatePickupOptions();

  // Seleccionar automáticamente la primera hora disponible
  useEffect(() => {
    if (pickupOptions.length > 0 && !pickupTime) {
      setPickupTime(pickupOptions[0].value);
    }
  }, [pickupOptions, pickupTime]);

  const cartItems = useCartStore((state) => state.items);
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const goToCheckout = () => {
    if (!isAuthenticated()) {
      // Forzar login si el usuario intenta pagar sin sesión
      Swal.fire({
        icon: "info",
        title: "Acceso Requerido",
        text: "Por favor, inicie sesión para finalizar su pedido.",
        background: "#fdfaf6",
        color: "#2c302e",
        confirmButtonColor: "#e76f51",
      });
      navigate("/login");
      return;
    }
    setStep("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Envía el pedido al servidor con toda la info
  const handleCheckout = async () => {
    setIsProcessing(true);
    if (!pickupTime) {
      Swal.fire({
        icon: "warning",
        title: "Hora requerida",
        text: "Por favor, seleccione una hora de recogida.",
        background: "#fdfaf6",
        color: "#2c302e",
        confirmButtonColor: "#e76f51",
      });
      setIsProcessing(false);
      return;
    }

    const payload = {
      articulos: cartItems.map((item) => ({
        db_id: parseInt(item.id.toString().replace(/\D/g, "")) || 0,
        tipo_item: item.item_type || "plato",
        nombre: item.name,
        cantidad: item.quantity,
        precio: parseFloat(item.price),
      })),
      total: parseFloat(total),
      metodo_pago: paymentMethod,
      hora_recogida: pickupTime.split("-")[1] || pickupTime,
      fecha_recogida: pickupTime.startsWith("today")
        ? new Date().toISOString().split("T")[0]
        : new Date(Date.now() + 86400000).toISOString().split("T")[0],
    };

    try {
      await axios.post("/orders", payload);

      clearCart();
      Swal.fire({
        icon: "success",
        title: "Pedido Confirmado",
        html: `
          <div class="text-center font-body">
            <p class="mb-4">Su solicitud ha sido procesada con éxito mediante <b>${paymentMethod === "card" ? "Tarjeta" : paymentMethod === "cash" ? "Efectivo" : "PayPal"}</b>.</p>
            <div class="bg-primary/10 p-6 rounded-lg border border-primary/20">
              <p class="text-xs font-semibold text-primary uppercase tracking-widest mb-1 opacity-70">Hora Estimada de Recogida</p>
              <p class="text-4xl font-heading text-primary">${pickupOptions.find((o) => o.value === pickupTime)?.label || pickupTime}</p>
              <p class="text-[10px] text-text-muted mt-3 uppercase tracking-tighter">Le esperamos en nuestro local.</p>
            </div>
          </div>
        `,
        background: "#fdfaf6",
        color: "#2c302e",
        confirmButtonColor: "#c5a059",
        confirmButtonText: "Ver mis pedidos",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al procesar su pedido. Inténtelo de nuevo.",
        background: "#fdfaf6",
        color: "#2c302e",
        confirmButtonColor: "#c5a059",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0 && step === "cart") {
    return (
      <PageTransition className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-bg-body relative overflow-hidden">
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-text-main/5 -translate-x-1/2 z-0 hidden md:block"></div>
        <FadeIn className="bg-bg-surface border border-text-main/10 p-12 md:p-24 max-w-2xl w-full relative z-10 flex flex-col items-center">
          <span className="text-text-main text-[12px] uppercase tracking-[3px] mb-8 font-body font-bold">
            / 00 Vacío
          </span>
          <h2 className="text-4xl md:text-5xl font-heading text-text-main leading-tight mb-8">
            Su Selección <br />
            <span className="italic font-normal text-primary">Inactiva</span>
          </h2>
          <div className="w-16 h-[1px] bg-text-main/10 mb-8"></div>
          <p className="text-text-main font-body font-medium mb-12 text-[15px] tracking-wide leading-relaxed opacity-90">
            Le invitamos a explorar nuestra carta y descubrir las creaciones que
            nuestro chef ha preparado para usted.
          </p>
          <div className="flex justify-center">
            <Link
              to="/menu"
              className="group relative px-10 py-4 bg-transparent border border-text-main text-text-main font-body text-[12px] uppercase tracking-[2px] overflow-hidden transition-all duration-300 hover:border-text-main inline-block"
            >
              <div className="absolute inset-0 w-0 bg-text-main transition-all duration-[400ms] ease-out group-hover:w-full"></div>
              <span className="relative z-10 group-hover:text-white font-bold transition-colors duration-300">
                Explorar la Carta
              </span>
            </Link>
          </div>
        </FadeIn>
      </PageTransition>
    );
  }

  return (
    <PageTransition
      className="bg-bg-body min-h-screen pt-20 sm:pt-28 pb-32 px-4 relative overflow-hidden"
      key={step}
    >
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-text-main/5 -translate-x-1/2 z-0 hidden md:block"></div>

      <div className="container max-w-6xl 2k:max-w-7xl 4k:max-w-[130rem] ultra:max-w-[160rem] relative z-10 px-6 md:px-12 4k:px-24 ultra:px-32">
        {step === "cart" ? (
          <div key="cart-step">
            <FadeIn className="text-center mb-16 sm:mb-24 relative">
              <span className="block text-text-main text-[12px] uppercase tracking-[3px] mb-6 sm:mb-8 font-body font-bold">
                / 01 Resumen
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl text-text-main mb-8 leading-tight">
                Su <span className="italic text-primary">Selección</span>
              </h1>
              <div className="w-16 h-[1px] bg-text-main/10 mx-auto"></div>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-16">
              <div className="lg:col-span-2 space-y-0 border-t border-text-main/10">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-8 border-b border-text-main/10 hover:bg-text-main/5 transition-colors duration-300 gap-6"
                  >
                    <div className="flex items-center gap-8 w-full sm:w-auto">
                      <div className="text-left">
                        <h3 className="font-heading text-3xl text-text-main mb-2 leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-text-muted font-body font-normal text-[13px] tracking-widest uppercase">
                          {item.price.toFixed(2)}€{item.isPerUnit && " / Ud."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
                      <div className="flex items-center border border-text-main/20 bg-transparent">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-main hover:bg-text-main/5 transition-colors"
                        >
                          <HiMinus size={12} />
                        </button>
                        <span className="w-12 text-center text-[13px] font-normal text-text-main font-body py-2 border-x border-text-main/20">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-main hover:bg-text-main/5 transition-colors"
                        >
                          <HiPlus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-text-muted hover:text-red-800 transition-colors p-2"
                        title="Eliminar"
                      >
                        <HiTrash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-start pt-6">
                  <button
                    onClick={clearCart}
                    className="font-body text-[11px] uppercase tracking-[2px] text-text-muted border-b border-transparent hover:border-text-main hover:text-text-main transition-colors pb-1 font-medium"
                  >
                    Vaciar Selección
                  </button>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-bg-surface border border-text-main/10 p-8 sm:p-10 sticky top-32">
                  <h3 className="font-heading text-3xl text-text-main mb-8 pb-6 border-b border-text-main/10">
                    Resumen
                  </h3>
                  <div className="space-y-6 mb-12 text-[14px] font-normal font-body tracking-wide text-text-muted">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{total.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between text-text-main text-xl pt-6 border-t border-text-main/10 mt-6 font-normal">
                      <span>Total (IVA inc.)</span>
                      <span className="font-heading">{total.toFixed(2)}€</span>
                    </div>
                  </div>
                  <button
                    onClick={goToCheckout}
                    className="group relative w-full py-5 bg-transparent border border-text-main text-text-main font-body text-[12px] uppercase tracking-[3px] overflow-hidden transition-all duration-300 hover:border-text-main mb-8"
                  >
                    <div className="absolute inset-0 w-0 bg-text-main transition-all duration-[400ms] ease-out group-hover:w-full z-0"></div>
                    <span className="relative z-10 font-bold group-hover:text-bg-body transition-colors duration-300">
                      CONTINUAR COBRO
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div key="checkout-step" className="max-w-4xl mx-auto">
            <button
              onClick={() => setStep("cart")}
              className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-12 uppercase text-[10px] tracking-[3px] font-bold group"
            >
              <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" />{" "}
              Regresar al Carrito
            </button>

            <div className="text-center mb-16">
              <span className="block text-text-main text-[12px] uppercase tracking-[3px] mb-8 font-body font-bold">
                / 02 Cobros
              </span>
              <h1 className="font-heading text-5xl sm:text-6xl text-text-main mb-6">
                Método de <span className="italic text-primary">Pago</span>
              </h1>
              <p className="text-text-muted uppercase text-[11px] tracking-[4px] font-normal">
                Seleccione su preferencia de abono
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div className="space-y-4">
                {[
                  {
                    id: "card",
                    name: "Tarjeta de Crédito",
                    icon: HiCreditCard,
                    desc: "Visa o Mastercard",
                  },
                  {
                    id: "cash",
                    name: "Pago en Restaurante",
                    icon: HiCash,
                    desc: "Abonar al recoger el pedido",
                  },
                  {
                    id: "paypal",
                    name: "PayPal",
                    icon: FaPaypal,
                    desc: "Pago seguro en línea",
                  },
                ].map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`group relative p-6 sm:p-8 border cursor-pointer transition-all duration-300 flex items-center gap-6 ${
                      paymentMethod === method.id
                        ? "bg-text-main border-text-main text-white shadow-xl translate-x-2"
                        : "bg-bg-surface border-text-main/10 text-text-main hover:border-text-main/40"
                    }`}
                  >
                    <div
                      className={`p-4 border rounded-sm transition-colors ${paymentMethod === method.id ? "bg-white/10 border-white/20 text-white" : "bg-primary/5 border-primary/10 text-primary"}`}
                    >
                      <method.icon size={28} />
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-heading text-xl mb-1 ${paymentMethod === method.id ? "text-white" : ""}`}
                      >
                        {method.name}
                      </h4>
                      <p
                        className={`text-[11px] uppercase tracking-wider opacity-60 font-medium ${paymentMethod === method.id ? "text-white" : "text-text-muted"}`}
                      >
                        {method.desc}
                      </p>
                    </div>
                    {paymentMethod === method.id && (
                      <div className="text-primary-hover">
                        <HiCheckCircle size={24} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-bg-surface border border-text-main/10 p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="font-heading text-2xl text-text-main mb-8 border-b border-text-main/10 pb-6">
                  Finalización
                </h3>
                <div className="space-y-4 mb-10 text-[14px]">
                  <div className="mb-6">
                    <label className="block text-[10px] uppercase tracking-[3px] text-text-muted mb-3 font-bold">
                      Hora de Recogida
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full bg-transparent border border-text-main/10 text-text-main p-3.5 outline-none focus:border-primary transition-colors font-body text-sm cursor-pointer"
                    >
                      {pickupOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-between text-text-muted">
                    <span>Subtotal Pedido</span>
                    <span>{total.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-text-main text-2xl pt-6 border-t border-text-main/10 mt-6 font-normal">
                    <span>Total Final</span>
                    <span className="font-heading text-primary">
                      {total.toFixed(2)}€
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="group relative w-full py-5 bg-text-main text-white font-body text-[12px] uppercase tracking-[3px] overflow-hidden transition-all duration-300 disabled:opacity-50"
                >
                  <div className="absolute inset-0 w-0 bg-primary-hover transition-all duration-[400ms] ease-out group-hover:w-full z-0"></div>
                  <span className="relative z-10 font-bold">
                    {isProcessing ? "PROCESANDO..." : "CONFIRMAR Y PAGAR"}
                  </span>
                </button>
                <p className="text-[10px] text-text-muted text-center mt-6 uppercase tracking-widest leading-relaxed opacity-60">
                  Al confirmar, acepta nuestras políticas de <br /> cancelación
                  y términos de servicio.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default CartView;
