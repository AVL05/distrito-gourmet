// ─── Constantes de Duración ────────────────────────────────────────
// Duraciones estandarizadas entre 150ms y 400ms para mantener consistencia

export const DURATION = {
  fast: 0.15, // 150ms - Microinteracciones instantáneas
  normal: 0.3, // 300ms - Transiciones estándar
  slow: 0.4, // 400ms - Animaciones de entrada/salida de componentes
  stagger: 0.08, // 80ms  - Intervalo entre items en listas
};

// ─── Curvas Easing Naturales ───────────────────────────────────────
// Curvas cúbicas personalizadas que generan movimiento orgánico y premium

export const EASING = {
  smooth: [0.25, 0.46, 0.45, 0.94], // Movimiento suave y natural
  decelerate: [0.0, 0.0, 0.2, 1], // Frenado progresivo (entradas)
  accelerate: [0.4, 0.0, 1, 1], // Aceleración suave (salidas)
  spring: { type: 'spring', stiffness: 300, damping: 24 }, // Rebote sutil
};

// ─── Variantes de Fade ─────────────────────────────────────────────

/** Fade in simple (solo opacidad) */
export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.normal, ease: EASING.smooth },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATION.fast, ease: EASING.accelerate },
  },
};

// ─── Variantes de Fade + Slide ─────────────────────────────────────

/** Fade in con desplazamiento desde abajo (entrada de página/sección) */
export const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASING.decelerate },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: DURATION.normal, ease: EASING.accelerate },
  },
};

/** Fade in con desplazamiento desde la izquierda */
export const fadeLeftVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slow, ease: EASING.decelerate },
  },
  exit: {
    opacity: 0,
    x: 24,
    transition: { duration: DURATION.normal, ease: EASING.accelerate },
  },
};

/** Fade in con desplazamiento desde la derecha */
export const fadeRightVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slow, ease: EASING.decelerate },
  },
  exit: {
    opacity: 0,
    x: -24,
    transition: { duration: DURATION.normal, ease: EASING.accelerate },
  },
};

// ─── Variantes de Escala ───────────────────────────────────────────

/** Scale in sutil (para modales, tooltips, dropdowns) */
export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.normal, ease: EASING.decelerate },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: DURATION.fast, ease: EASING.accelerate },
  },
};

// ─── Variantes para Contenedores con Stagger ───────────────────────

/** Contenedor que aplica un stagger progresivo a sus hijos */
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: DURATION.stagger,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: DURATION.stagger / 2,
      staggerDirection: -1,
    },
  },
};

/** Item hijo dentro de un contenedor con stagger */
export const staggerItemVariants = {
  hidden: { opacity: 0, y: 16 },
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

// ─── Variantes para el Menú/Overlay del Navbar ─────────────────────

/** Overlay de navegación a pantalla completa */
export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.normal, ease: EASING.smooth },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATION.normal, ease: EASING.accelerate },
  },
};

/** Links dentro del overlay a pantalla completa (con stagger) */
export const navContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

/** Cada link individual del menú overlay */
export const navItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASING.decelerate },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: DURATION.fast, ease: EASING.accelerate },
  },
};

// ─── Variantes para Transiciones de Página ─────────────────────────

/** Transición entre rutas/páginas */
export const pageTransitionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASING.decelerate },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: DURATION.normal, ease: EASING.accelerate },
  },
};

// ─── Variantes para Notificaciones/Toast ───────────────────────────

/** Toast que entra desde abajo */
export const toastVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.normal, ease: EASING.decelerate },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: DURATION.fast, ease: EASING.accelerate },
  },
};

// ─── Variantes para Cards con Hover ────────────────────────────────

/** Card con efecto hover de elevación sutil */
export const cardHoverVariants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.015,
    y: -4,
    transition: { duration: DURATION.normal, ease: EASING.smooth },
  },
};

// ─── Variantes para Botones ────────────────────────────────────────

/** Efecto tap/press en botones */
export const buttonTapVariants = {
  rest: { scale: 1 },
  tap: { scale: 0.97 },
};
