/**
 * AdvancedComponents.jsx
 * Animaciones avanzadas inspiradas en sitios premium de gastronomía.
 *
 * NOTA: Brave activa prefers-reduced-motion por defecto.
 * En lugar de eliminar las animaciones, las simplificamos (solo fade)
 * para que funcionen en todos los navegadores.
 */

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, useReducedMotion, useMotionValue } from 'framer-motion';
import { DURATION, EASING } from './motionVariants';

// ─── 1. TextReveal ───────────────────────────────────────────────────

export const TextReveal = ({
  text,
  splitBy = 'word',
  as = 'h2',
  staggerDelay = 0.03,
  delay = 0,
  once = true,
  className = '',
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-10% 0px -10% 0px' });
  const shouldReduceMotion = useReducedMotion();

  const units = splitBy === 'char' ? text.split('') : text.split(' ');

  // Si reduced motion: solo fade simple, sin rotación ni Y
  const unitVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, rotateX: 40 },
    visible: i => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: delay + i * (shouldReduceMotion ? 0.01 : staggerDelay),
        duration: shouldReduceMotion ? 0.3 : DURATION.slow,
        ease: EASING.decelerate,
      },
    }),
  };

  const Component = motion[as] || motion.div;

  return (
    <Component
      ref={ref}
      className={className}
      style={{ perspective: '600px', display: 'flex', flexWrap: 'wrap', overflow: 'hidden' }}
      aria-label={text}
      {...props}>
      {units.map((unit, i) => (
        <motion.span
          key={`${unit}-${i}`}
          custom={i}
          variants={unitVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{
            display: 'inline-block',
            willChange: 'opacity, transform',
            marginRight: splitBy === 'word' ? '0.3em' : '0',
            whiteSpace: 'pre',
          }}>
          {unit}
        </motion.span>
      ))}
    </Component>
  );
};

// ─── 2. ScrollReveal ─────────────────────────────────────────────────

export const ScrollReveal = ({
  children,
  direction = 'up',
  distance = 60,
  delay = 0,
  duration = 0.7,
  once = true,
  className = '',
  as = 'div',
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    scale: { scale: 0.9 },
  };

  // Si reduced motion: solo fade, sin desplazamiento
  const initialState = shouldReduceMotion ? { opacity: 0 } : { opacity: 0, ...directionMap[direction] };

  const animateState = {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
  };

  return (
    <Component
      initial={initialState}
      whileInView={animateState}
      viewport={{ once, margin: '-50px 0px' }}
      transition={{
        duration: shouldReduceMotion ? 0.4 : duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
      style={{ willChange: 'opacity, transform' }}
      {...props}>
      {children}
    </Component>
  );
};

// ─── 3. ParallaxSection ──────────────────────────────────────────────

export const ParallaxSection = ({ children, speed = -20, className = '', as = 'div', ...props }) => {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Si reduced motion: parallax a velocidad 0 (sin movimiento, pero estructura intacta)
  const effectiveSpeed = shouldReduceMotion ? 0 : speed;
  const y = useTransform(scrollYProgress, [0, 1], [effectiveSpeed, -effectiveSpeed]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  const Component = motion[as] || motion.div;

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} {...props}>
      <Component style={{ y: smoothY }}>{children}</Component>
    </div>
  );
};

// ─── 4. ParallaxImage ────────────────────────────────────────────────

export const ParallaxImage = ({ src, alt = '', speed = 30, className = '', imageClassName = '', ...props }) => {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const effectiveSpeed = shouldReduceMotion ? 0 : speed;
  const y = useTransform(scrollYProgress, [0, 1], [-effectiveSpeed, effectiveSpeed]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], shouldReduceMotion ? [1, 1, 1] : [1.15, 1.05, 1.15]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} {...props}>
      <motion.img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${imageClassName}`}
        style={{ y, scale, willChange: 'transform' }}
      />
    </div>
  );
};

// ─── 5. ImageReveal ──────────────────────────────────────────────────

export const ImageReveal = ({
  src,
  alt = '',
  revealFrom = 'bottom',
  duration = 1.2,
  delay = 0,
  once = true,
  className = '',
  imageClassName = '',
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-10% 0px' });
  const shouldReduceMotion = useReducedMotion();

  const clipPaths = {
    left: { hidden: 'inset(0 100% 0 0)', visible: 'inset(0 0% 0 0)' },
    right: { hidden: 'inset(0 0 0 100%)', visible: 'inset(0 0 0 0%)' },
    bottom: { hidden: 'inset(100% 0 0 0)', visible: 'inset(0% 0 0 0)' },
    center: { hidden: 'inset(50% 50% 50% 50%)', visible: 'inset(0% 0% 0% 0%)' },
  };

  const clip = clipPaths[revealFrom] || clipPaths.bottom;

  // Si reduced motion: solo fade en lugar de clip-path
  if (shouldReduceMotion) {
    return (
      <div ref={ref} className={`overflow-hidden ${className}`} {...props}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay }}
          className="w-full h-full">
          <img src={src} alt={alt} className={`w-full h-full object-cover ${imageClassName}`} />
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} {...props}>
      <motion.div
        initial={{ clipPath: clip.hidden, scale: 1.2 }}
        animate={isInView ? { clipPath: clip.visible, scale: 1 } : { clipPath: clip.hidden, scale: 1.2 }}
        transition={{
          clipPath: { duration, delay, ease: [0.77, 0, 0.175, 1] },
          scale: { duration: duration * 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] },
        }}
        style={{ willChange: 'clip-path, transform' }}
        className="w-full h-full">
        <img src={src} alt={alt} className={`w-full h-full object-cover ${imageClassName}`} />
      </motion.div>
    </div>
  );
};

// ─── 6. Marquee ──────────────────────────────────────────────────────

export const Marquee = ({
  text,
  speed = 25,
  reverse = false,
  separator = '✦',
  className = '',
  textClassName = '',
  ...props
}) => {
  // Marquee SIEMPRE anima — no necesita reduced motion bypass
  // Es un elemento decorativo pasivo, no interfiere con la usabilidad
  const repeated = Array(6).fill(`${text} ${separator} `).join('');

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} {...props}>
      <motion.div
        className="inline-flex"
        animate={{
          x: reverse ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
        style={{ willChange: 'transform' }}>
        <span className={`inline-block ${textClassName}`}>{repeated}</span>
        <span className={`inline-block ${textClassName}`}>{repeated}</span>
      </motion.div>
    </div>
  );
};

// ─── 7. SmoothCounter ────────────────────────────────────────────────

export const SmoothCounter = ({
  target,
  suffix = '',
  prefix = '',
  duration = 2,
  once = true,
  className = '',
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-20% 0px' });
  const [count, setCount] = useState(0);

  // Siempre anima el contador — es solo un incremento numérico
  useEffect(() => {
    if (!isInView) return;

    let startTime;
    const step = timestamp => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easedProgress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={className} {...props}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

// ─── 8. MagneticButton ───────────────────────────────────────────────

export const MagneticButton = ({ children, strength = 15, className = '', onClick, as = 'button', ...props }) => {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  // Si reduced motion: fuerza magnética más suave
  const effectiveStrength = shouldReduceMotion ? strength * 0.3 : strength;

  const handleMouseMove = e => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / (rect.width / effectiveStrength));
    y.set((e.clientY - centerY) / (rect.height / effectiveStrength));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Component = motion[as] || motion.button;

  return (
    <Component
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
        willChange: 'transform',
      }}
      {...props}>
      {children}
    </Component>
  );
};

// ─── 9. LineReveal ───────────────────────────────────────────────────

export const LineReveal = ({
  orientation = 'horizontal',
  delay = 0,
  duration = 1.0,
  once = true,
  className = '',
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-10% 0px' });
  const shouldReduceMotion = useReducedMotion();

  const isHorizontal = orientation === 'horizontal';

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        scaleX: isHorizontal ? 0 : 1,
        scaleY: isHorizontal ? 1 : 0,
        opacity: shouldReduceMotion ? 0 : 1,
      }}
      animate={
        isInView
          ? { scaleX: 1, scaleY: 1, opacity: 1 }
          : {
              scaleX: isHorizontal ? 0 : 1,
              scaleY: isHorizontal ? 1 : 0,
              opacity: shouldReduceMotion ? 0 : 1,
            }
      }
      transition={{
        duration: shouldReduceMotion ? 0.3 : duration,
        delay,
        ease: [0.77, 0, 0.175, 1],
      }}
      style={{
        transformOrigin: 'left center',
        willChange: 'transform',
        width: isHorizontal ? '100%' : '1px',
        height: isHorizontal ? '1px' : '100%',
      }}
      {...props}
    />
  );
};

// ─── 10. ScrollProgress ──────────────────────────────────────────────

export const ScrollProgress = ({ className = '', ...props }) => {
  // Siempre se muestra — es un indicador funcional, no decorativo
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-[2px] bg-primary z-[100] origin-left ${className}`}
      style={{ scaleX }}
      {...props}
    />
  );
};
