/**
 * MotionComponents.jsx
 * Componentes de animación reutilizables envueltos con Framer Motion.
 * Proporcionan una API declarativa para animar elementos de forma consistente
 * sin duplicar variantes ni configuración en cada componente de la UI.
 */

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  fadeUpVariants,
  fadeLeftVariants,
  fadeRightVariants,
  fadeVariants,
  scaleVariants,
  staggerContainerVariants,
  staggerItemVariants,
  pageTransitionVariants,
  toastVariants,
  cardHoverVariants,
  buttonTapVariants,
} from './motionVariants';

// ─── Hook para respetar prefers-reduced-motion ─────────────────────

/**
 * Devuelve las props de animación adecuadas.
 * Si el usuario prefiere movimiento reducido, devuelve variantes estáticas.
 * @param {object} variants - Las variantes de animación normales
 * @returns {object} Props para aplicar a un motion component
 */
export const useMotionProps = variants => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return {
      initial: false,
      animate: 'visible',
      exit: 'visible',
    };
  }

  return {
    variants,
    initial: 'hidden',
    animate: 'visible',
    exit: 'exit',
  };
};

// ─── Componente: FadeIn ────────────────────────────────────────────

/**
 * Envuelve contenido con una animación fade-in desde abajo.
 * Dirección configurable: 'up' | 'left' | 'right' | 'none'
 */
export const FadeIn = ({ children, direction = 'up', delay = 0, className = '', as = 'div', ...props }) => {
  const variantMap = {
    up: fadeUpVariants,
    left: fadeLeftVariants,
    right: fadeRightVariants,
    none: fadeVariants,
  };

  const selectedVariants = variantMap[direction] || fadeUpVariants;
  const motionProps = useMotionProps(selectedVariants);
  const Component = motion[as] || motion.div;

  return (
    <Component
      {...motionProps}
      className={className}
      style={{ willChange: 'opacity, transform' }}
      transition={{ ...motionProps.variants?.visible?.transition, delay }}
      {...props}>
      {children}
    </Component>
  );
};

// ─── Componente: StaggerList ───────────────────────────────────────

/**
 * Contenedor con animación stagger progresiva para sus hijos.
 * Cada hijo directo se anima secuencialmente.
 */
export const StaggerList = ({ children, className = '', ...props }) => {
  const motionProps = useMotionProps(staggerContainerVariants);

  return (
    <motion.div {...motionProps} className={className} {...props}>
      {children}
    </motion.div>
  );
};

/**
 * Item individual dentro de un StaggerList.
 * Debe ser hijo directo de StaggerList para funcionar.
 */
export const StaggerItem = ({ children, className = '', as = 'div', ...props }) => {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  return (
    <Component
      variants={shouldReduceMotion ? undefined : staggerItemVariants}
      className={className}
      style={{ willChange: 'opacity, transform' }}
      {...props}>
      {children}
    </Component>
  );
};

// ─── Componente: PageTransition ────────────────────────────────────

/**
 * Envuelve el contenido de cada página con transición fade + slide.
 * Usa AnimatePresence internamente para salidas suaves.
 */
export const PageTransition = ({ children, className = '', ...props }) => {
  const motionProps = useMotionProps(pageTransitionVariants);

  return (
    <motion.div {...motionProps} className={className} style={{ willChange: 'opacity, transform' }} {...props}>
      {children}
    </motion.div>
  );
};

// ─── Componente: ScaleIn ───────────────────────────────────────────

/**
 * Animación de escala sutil para modales, tooltips, dropdowns.
 * Escala desde 0.95 → 1 con fade.
 */
export const ScaleIn = ({ children, className = '', ...props }) => {
  const motionProps = useMotionProps(scaleVariants);

  return (
    <motion.div {...motionProps} className={className} style={{ willChange: 'opacity, transform' }} {...props}>
      {children}
    </motion.div>
  );
};

// ─── Componente: Toast ─────────────────────────────────────────────

/**
 * Notificación con entrada desde abajo con scale.
 * Pensado para mensajes de confirmación o error.
 */
export const Toast = ({ children, className = '', ...props }) => {
  const motionProps = useMotionProps(toastVariants);

  return (
    <motion.div {...motionProps} className={className} style={{ willChange: 'opacity, transform' }} {...props}>
      {children}
    </motion.div>
  );
};

// ─── Componente: HoverCard ─────────────────────────────────────────

/**
 * Card con efecto de elevación al pasar el cursor.
 * Interacción GPU-friendly (solo transform).
 */
export const HoverCard = ({ children, className = '', as = 'div', ...props }) => {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  return (
    <Component
      variants={shouldReduceMotion ? undefined : cardHoverVariants}
      initial="rest"
      whileHover="hover"
      className={className}
      style={{ willChange: 'transform' }}
      {...props}>
      {children}
    </Component>
  );
};

// ─── Componente: MotionButton ──────────────────────────────────────

/**
 * Botón con efecto tap/press sutil.
 * Compatible con todos los estilos de botón existentes.
 */
export const MotionButton = ({ children, className = '', onClick, type = 'button', disabled = false, ...props }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      variants={shouldReduceMotion ? undefined : buttonTapVariants}
      whileTap={shouldReduceMotion ? undefined : 'tap'}
      className={className}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={{ willChange: 'transform' }}
      {...props}>
      {children}
    </motion.button>
  );
};

// Re-exportar AnimatePresence para uso centralizado
export { AnimatePresence };
