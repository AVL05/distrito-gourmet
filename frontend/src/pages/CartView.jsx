import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import {
  HiMinus,
  HiPlus,
  HiTrash,
  HiCash,
  HiArrowLeft,
  HiCheckCircle,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "@/services/api";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import { PageTransition, FadeIn } from "@/motion";
import { IS_PUBLIC_DEMO } from "@/config/demo";
import { getApiErrorMessage } from "@/utils/apiErrors";
import { getPickupDate } from "@/utils/pickupDate";

const CartView = () => {
  const { items, updateQuantity, removeItem, clearCart, storageAvailable } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState("cart");
  const paymentMethod = "cash";
  const [pickupTime, setPickupTime] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [pickupOptions, setPickupOptions] = useState([]);
  const [pickupError, setPickupError] = useState("");
  const [pickupLoading, setPickupLoading] = useState(!IS_PUBLIC_DEMO);
  const [pickupRetry, setPickupRetry] = useState(0);
  useEffect(() => {
    if (IS_PUBLIC_DEMO) return;
    let cancelled = false;
    axios.get("/pickup-times", { timeout: 7000 })
      .then((res) => {
        if (cancelled) return;
        if (!Array.isArray(res.data.days)) throw new Error("Invalid pickup calendar");
        setPickupOptions(res.data.days.flatMap((day) => day.times.map((time) => ({
          label: `${new Date(`${day.date}T12:00:00`).toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })} · ${time}`,
          value: `${day.date}T${time}`,
        }))));
        setPickupError("");
      })
      .catch(() => { if (!cancelled) { setPickupOptions([]); setPickupError("No pudimos consultar las horas de recogida."); } })
      .finally(() => { if (!cancelled) setPickupLoading(false); });
    return () => { cancelled = true; };
  }, [pickupRetry]);
  const selectedPickupTime = pickupOptions.some((option) => option.value === pickupTime) ? pickupTime : pickupOptions[0]?.value || "";

  const cartItems = useCartStore((state) => state.items);
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const goToCheckout = async () => {
    if (IS_PUBLIC_DEMO) {
      Swal.fire({
        icon: "info",
        title: "Pedido no disponible",
        text: "La selección es navegable, pero el pedido de recogida no está disponible en esta vista pública.",
        background: "#fdfaf6",
        color: "#2c302e",
        confirmButtonColor: "var(--accent)",
      });
      return;
    }

    if (!isAuthenticated()) {
      // Solicitar sesión antes de confirmar un pedido
      await Swal.fire({
        icon: "info",
        title: "Acceso Requerido",
        text: "Por favor, inicie sesión para finalizar su pedido.",
        background: "#fdfaf6",
        color: "#2c302e",
        confirmButtonColor: "var(--accent)",
      });
      navigate("/login", { state: { returnTo: "/cart" } });
      return;
    }
    setStep("checkout");
    setCheckoutError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Envía el pedido al servidor con toda la info
  const handleCheckout = async () => {
    if (IS_PUBLIC_DEMO) {
      Swal.fire({
        icon: "info",
        title: "Pedido no disponible",
        text: "Los pedidos de recogida no están disponibles en esta vista pública.",
        background: "#fdfaf6",
        color: "#2c302e",
        confirmButtonColor: "var(--accent)",
      });
      return;
    }

    setIsProcessing(true);
    if (!selectedPickupTime || pickupError || pickupLoading) {
      setCheckoutError("Seleccione una hora de recogida para continuar.");
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
      hora_recogida: selectedPickupTime.split("T")[1],
      fecha_recogida: getPickupDate(selectedPickupTime),
    };

    try {
      const menuResponse = await axios.get("/dishes", { timeout: 7000 });
      const catalogItems = [
        ...(menuResponse.data?.platos || []).map((item) => ({
          id: item.id,
          type: "plato",
          name: item.nombre,
          available: !!item.disponible && !!item.disponible_para_llevar,
          max: item.maximo_por_pedido,
        })),
        ...(menuResponse.data?.vinos || []).map((item) => ({
          id: item.id,
          type: "vino",
          name: item.nombre,
          available: !!item.disponible,
          max: item.maximo_por_pedido,
        })),
        ...(menuResponse.data?.bebidas || []).map((item) => ({
          id: item.id,
          type: "bebida",
          name: item.nombre,
          available: !!item.disponible,
          max: item.maximo_por_pedido,
        })),
        ...(menuResponse.data?.menus_degustacion || []).map((item) => ({
          id: item.id,
          type: "menu_degustacion",
          name: item.nombre,
          available: !!item.disponible,
          max: item.maximo_por_pedido,
        })),
      ];
      const invalidItems = cartItems.filter((item) => {
        const dbId = parseInt(item.id.toString().replace(/\D/g, "")) || 0;
        const catalogItem = catalogItems.find(
          (candidate) =>
            candidate.id === dbId &&
            candidate.type === (item.item_type || "plato"),
        );

        return (
          !catalogItem ||
          !catalogItem.available ||
          (catalogItem.max && item.quantity > catalogItem.max)
        );
      });

      if (invalidItems.length > 0) {
        setCheckoutError(
          `Revise la selección: ${invalidItems.map((item) => item.name).join(", ")} ya no está disponible o supera el máximo permitido.`,
        );
        setIsProcessing(false);
        return;
      }

      const response = await axios.post("/orders", payload);

      clearCart();
      await Swal.fire({
        icon: "success",
        title: "Pedido Confirmado",
        html: `
          <div class="text-center font-body">
            <p class="mb-4">Pedido recibido. Pago pendiente en el local: <b>${Number(response.data.pedido.total).toFixed(2)} €</b>.</p>
            <div class="bg-primary/10 p-6 rounded-lg border border-primary/20">
              <p class="text-xs font-semibold text-primary-hover uppercase tracking-widest mb-1 opacity-70">Hora Estimada de Recogida</p>
              <p class="text-4xl font-heading text-primary-hover">${pickupOptions.find((o) => o.value === selectedPickupTime)?.label || selectedPickupTime}</p>
              <p class="text-sm text-text-muted mt-3">Le esperamos en nuestro local.</p>
            </div>
          </div>
        `,
        background: "#fdfaf6",
        color: "#2c302e",
        confirmButtonColor: "var(--accent)",
        confirmButtonText: "Ver mis pedidos",
      });
      navigate("/dashboard");
    } catch (error) {
      setCheckoutError(
        getApiErrorMessage(
          error,
          "Hubo un problema al procesar su pedido. Inténtelo de nuevo.",
        ),
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0 && step === "cart") {
    return (
      <PageTransition className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-bg-body relative overflow-hidden">
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-text-main/5 -translate-x-1/2 z-0 hidden md:block"></div>
        <FadeIn className="bg-bg-surface border border-text-main/10 p-8 sm:p-12 md:p-24 max-w-2xl w-full relative z-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-heading text-text-main leading-tight mb-8">Su carrito está vacío</h1>
          <div className="w-16 h-[1px] bg-text-main/10 mb-8"></div>
          <p className="text-text-main font-body font-medium mb-12 text-[15px] tracking-wide leading-relaxed opacity-90">
            Añada los platos disponibles para llevar y prepare su pedido para recoger en el restaurante.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
            <Link
              to="/menu?category=carta&takeaway=true"
              className="group relative px-8 py-4 bg-transparent border border-text-main text-text-main font-body text-[12px] uppercase tracking-[1.8px] overflow-hidden transition-all duration-300 hover:border-text-main inline-block"
            >
              <div className="absolute inset-0 w-0 bg-text-main transition-all duration-[400ms] ease-out group-hover:w-full"></div>
              <span className="relative z-10 group-hover:text-white font-bold transition-colors duration-300">
                Explorar la Carta
              </span>
            </Link>
            <Link
              to="/reservations"
              className="px-8 py-4 border border-text-main/20 font-body text-[12px] uppercase tracking-[1.8px] text-text-main hover:border-primary hover:text-primary-hover transition-colors"
            >
              Reservar mesa
            </Link>
          </div>
        </FadeIn>
      </PageTransition>
    );
  }

  return (
    <PageTransition
      className="bg-bg-body min-h-screen pt-20 sm:pt-28 pb-24 sm:pb-32 px-0 sm:px-4 relative overflow-hidden"
      key={step}
    >
      <Helmet>
        <title>Mi pedido | Distrito Gourmet</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-text-main/5 -translate-x-1/2 z-0 hidden md:block"></div>

      {!storageAvailable && <p role="status" className="container text-sm text-text-muted">El navegador no permite guardar la selección. Se conservará mientras esta pestaña permanezca abierta.</p>}
      {IS_PUBLIC_DEMO && <p className="container text-sm text-text-muted mb-6">Está viendo una demostración. Puede preparar un carrito, pero no enviar pedidos.</p>}
      <div className="container max-w-6xl 2k:max-w-7xl 4k:max-w-[130rem] ultra:max-w-[160rem] relative z-10 px-4 sm:px-6 md:px-12 4k:px-24 ultra:px-32">
        {step === "cart" ? (
          <div key="cart-step">
            <FadeIn className="text-center mb-16 sm:mb-24 relative">
              <span className="block text-text-main text-[12px] uppercase tracking-[3px] mb-6 sm:mb-8 font-body font-bold">
                / 01 Resumen
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl text-text-main mb-8 leading-tight">
                Su <span className="italic text-primary-hover">pedido</span>
              </h1>
              <div className="w-16 h-[1px] bg-text-main/10 mx-auto"></div>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-16">
              <div className="lg:col-span-2 space-y-0 border-t border-text-main/10">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 sm:p-8 border-b border-text-main/10 hover:bg-text-main/5 transition-colors duration-300 gap-5 sm:gap-6"
                  >
                    <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto">
                      <div className="text-left">
                        <h2 className="font-heading text-2xl sm:text-3xl text-text-main mb-2 leading-tight">
                          {item.name}
                        </h2>
                        <p className="text-text-muted font-body font-normal text-[13px] tracking-widest uppercase">
                          {item.price.toFixed(2)}€{item.isPerUnit && " / Ud."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
                      <div className="flex items-center border border-text-main/20 bg-transparent">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label={`Reducir cantidad de ${item.name}`}
                          className="flex h-11 w-11 items-center justify-center text-text-muted transition-colors hover:bg-text-main/5 hover:text-text-main focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <HiMinus size={12} />
                        </button>
                        <span className="w-12 border-x border-text-main/20 py-2 text-center font-body text-[13px] font-bold text-text-main">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label={`Aumentar cantidad de ${item.name}`}
                          className="flex h-11 w-11 items-center justify-center text-text-muted transition-colors hover:bg-text-main/5 hover:text-text-main focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <HiPlus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label={`Eliminar ${item.name}`}
                        className="min-h-11 min-w-11 p-2 text-text-muted transition-colors hover:text-red-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary"
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
                    Vaciar carrito
                  </button>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-bg-surface border border-text-main/10 p-6 sm:p-10 lg:sticky lg:top-32">
                  <h2 className="font-heading text-3xl text-text-main mb-8 pb-6 border-b border-text-main/10">
                    Resumen
                  </h2>
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
                      ELEGIR RECOGIDA
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
              Volver al carrito
            </button>

            <div className="text-center mb-16">
              <span className="block text-text-main text-[12px] uppercase tracking-[3px] mb-8 font-body font-bold">
                / 02 Recogida
              </span>
              <h1 className="font-heading text-4xl sm:text-6xl text-text-main mb-6">
                Pedido de <span className="italic text-primary-hover">Recogida</span>
              </h1>
              <p className="text-text-muted uppercase text-[10px] sm:text-[11px] tracking-[2px] sm:tracking-[4px] font-normal">
                Compruebe su pedido y elija una hora de recogida
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div className="border border-text-main/15 bg-bg-surface p-6 sm:p-8">
                <HiCash size={28} aria-hidden="true" className="mb-4 text-primary-hover" />
                <h2 className="font-heading text-2xl normal-case">Pago en el local</h2>
                <p className="text-text-muted leading-relaxed">Pague en efectivo al recoger su pedido en el restaurante.</p>
              </div>

              <div className="bg-bg-surface border border-text-main/10 p-6 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <h2 className="font-heading text-2xl text-text-main mb-8 border-b border-text-main/10 pb-6">
                  Revise su pedido
                </h2>
                <div className="space-y-4 mb-10 text-[14px]">
                  <ul className="space-y-3 border-b border-text-main/10 pb-4" aria-label="Productos del pedido">
                    {cartItems.map((item) => <li key={item.id} className="flex justify-between gap-4"><span>{item.quantity} × {item.name}</span><span className="shrink-0">{(item.price * item.quantity).toFixed(2)}€</span></li>)}
                  </ul>
                  <div className="mb-6">
                    <label htmlFor="pickup-time" className="block text-[10px] uppercase tracking-[3px] text-text-muted mb-3 font-bold">
                      Día y hora de recogida
                    </label>
                    <select
                      id="pickup-time"
                      aria-label="Hora de recogida"
                      disabled={pickupLoading || Boolean(pickupError)}
                      value={selectedPickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full bg-transparent border border-text-main/10 text-text-main p-3.5 outline-none focus:border-primary transition-colors font-body text-sm cursor-pointer"
                    >
                      {pickupOptions.length === 0 && <option value="">{pickupLoading ? "Consultando horarios…" : "No hay recogidas disponibles"}</option>}
                      {pickupOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {pickupError && <div role="alert" className="text-red-800"><p>{pickupError}</p><button type="button" className="btn mt-3" onClick={() => { setPickupLoading(true); setPickupRetry((value) => value + 1); }}>Reintentar horarios</button></div>}
                  <div className="flex justify-between text-text-muted">
                    <span>Subtotal Pedido</span>
                    <span>{total.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-text-main text-2xl pt-6 border-t border-text-main/10 mt-6 font-normal">
                    <span>Total Final</span>
                    <span className="font-heading text-primary-hover">
                      {total.toFixed(2)}€
                    </span>
                  </div>
                </div>
                {checkoutError && (
                  <div role="alert" className="mb-6 border border-red-800/20 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {checkoutError}
                  </div>
                )}
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing || pickupLoading || Boolean(pickupError) || !selectedPickupTime}
                  className="group relative w-full py-5 bg-text-main text-white font-body text-[12px] uppercase tracking-[3px] overflow-hidden transition-all duration-300 disabled:opacity-50"
                >
                  <div className="absolute inset-0 w-0 bg-primary-hover transition-all duration-[400ms] ease-out group-hover:w-full z-0"></div>
                  <span className="relative z-10 font-bold">
                    {isProcessing ? "PROCESANDO..." : "CONFIRMAR PEDIDO"}
                  </span>
                </button>
                <p className="text-[10px] text-text-muted text-center mt-6 uppercase tracking-widest leading-relaxed opacity-60">
                  Pagará {total.toFixed(2)}€ en el restaurante. Consulte el estado del pedido en su cuenta.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {step === "cart" && cartItems.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-[54] border-t border-text-main/10 bg-bg-body/95 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl md:hidden">
          <button
            type="button"
            onClick={goToCheckout}
            className="flex min-h-12 w-full items-center justify-between gap-4 bg-text-main px-5 py-3 text-bg-body transition-colors hover:bg-primary"
          >
            <span className="flex flex-col text-left">
              <span className="font-body text-[9px] uppercase tracking-[1.8px] text-bg-body/60">
                {cartItems.length}{" "}
                {cartItems.length === 1 ? "producto" : "productos"}
              </span>
              <span className="font-body text-[12px] font-bold uppercase tracking-[1.8px]">
                Elegir recogida · {total.toFixed(2)}€
              </span>
            </span>
            <span aria-hidden="true" className="text-lg leading-none">
              &rarr;
            </span>
          </button>
        </div>
      )}
    </PageTransition>
  );
};

export default CartView;
