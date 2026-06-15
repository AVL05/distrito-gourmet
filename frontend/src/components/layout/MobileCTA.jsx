import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "@/store/cart";

const MobileCTA = () => {
  const { pathname } = useLocation();
  const totalItems = useCartStore((state) => state.totalItems);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const cartCount = totalItems();
  const cartTotal = totalPrice();

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/cart")
  ) {
    return null;
  }

  const cta =
    pathname.startsWith("/menu") && cartCount > 0
      ? {
          to: "/cart",
          eyebrow: `${cartCount} ${cartCount === 1 ? "artículo" : "artículos"}`,
          label: `Ver selección · ${cartTotal.toFixed(2)}€`,
        }
      : pathname.startsWith("/reservations")
        ? {
            to: "/menu",
            eyebrow: "Antes de reservar",
            label: "Ver la carta",
          }
        : pathname.startsWith("/contact")
          ? {
              to: "/reservations",
              eyebrow: "Planifique su visita",
              label: "Reservar mesa",
            }
          : {
              to: "/reservations",
              eyebrow: "Mesa disponible",
              label: "Reservar mesa",
            };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[54] border-t border-text-main/10 bg-bg-body/95 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl md:hidden">
      <Link
        to={cta.to}
        className="flex min-h-12 items-center justify-between gap-4 bg-text-main px-5 py-3 text-bg-body transition-colors hover:bg-primary"
      >
        <span className="flex flex-col text-left">
          <span className="font-body text-[9px] uppercase tracking-[1.8px] text-bg-body/60">
            {cta.eyebrow}
          </span>
          <span className="font-body text-[12px] font-bold uppercase tracking-[1.8px]">
            {cta.label}
          </span>
        </span>
        <span aria-hidden="true" className="text-lg leading-none">
          &rarr;
        </span>
      </Link>
    </div>
  );
};

export default MobileCTA;
