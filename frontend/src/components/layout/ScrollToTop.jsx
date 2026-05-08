import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Componente utilitario para asegurar que el scroll vuelva al inicio en cada cambio de ruta
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Desplaza al inicio de la página cada vez que cambia la ruta
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
