/**
 * motion/index.js
 * Barrel export para el sistema de animaciones.
 * Importar desde '@/motion' para acceder a variantes y componentes.
 */

// Variantes de animación
export {
  DURATION,
  EASING,
  fadeVariants,
  fadeUpVariants,
  fadeLeftVariants,
  fadeRightVariants,
  scaleVariants,
  staggerContainerVariants,
  staggerItemVariants,
  overlayVariants,
  navContainerVariants,
  navItemVariants,
  pageTransitionVariants,
  toastVariants,
  cardHoverVariants,
  buttonTapVariants,
} from './motionVariants';

// Componentes de animación reutilizables
export {
  useMotionProps,
  useReducedMotion,
  FadeIn,
  StaggerList,
  StaggerItem,
  PageTransition,
  ScaleIn,
  Toast,
  HoverCard,
  MotionButton,
  AnimatePresence,
  motion,
} from './MotionComponents';

// Componentes avanzados de animación (inspirados en Lucky Folks, Gucci Osteria, Adachi)
export {
  TextReveal,
  ScrollReveal,
  ParallaxSection,
  ParallaxImage,
  ImageReveal,
  Marquee,
  SmoothCounter,
  MagneticButton,
  LineReveal,
  ScrollProgress,
} from './AdvancedComponents';
