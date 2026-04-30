/* eslint-disable react-refresh/only-export-components */
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Registrar plugins globalmente una sola vez
gsap.registerPlugin(ScrollTrigger, useGSAP);

const DURATION = {
  fast: 0.2,
  normal: 0.45,
  slow: 0.7,
  stagger: 0.1,
};

const EASING = {
  smooth: 'power2.out',
  primary: 'power3.out',
  back: 'back.out(1.7)',
};

export const useMotionProps = _variants => ({});
export const useReducedMotion = () => false;

// ─── FadeIn ───────────────────────────────────────────────────────────────────

export const FadeIn = ({ children, direction = 'up', delay = 0, className = '', as: Component = 'div', ...props }) => {
  const el = useRef(null);

  useGSAP(
    () => {
      const fromVars = { opacity: 0, duration: DURATION.slow, ease: EASING.primary };
      if (direction === 'up') fromVars.y = 36;
      if (direction === 'down') fromVars.y = -36;
      if (direction === 'left') fromVars.x = 36;
      if (direction === 'right') fromVars.x = -36;

      gsap.from(el.current, {
        ...fromVars,
        delay,
        clearProps: 'all',
        scrollTrigger: {
          trigger: el.current,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: el }
  );

  return (
    <Component ref={el} className={className} {...props}>
      {children}
    </Component>
  );
};

// ─── StaggerList ──────────────────────────────────────────────────────────────

export const StaggerList = ({ children, className = '', as: Component = 'div', ...props }) => {
  const el = useRef(null);

  useGSAP(
    () => {
      const kids = el.current?.children;
      if (!kids || kids.length === 0) return;

      gsap.from(kids, {
        opacity: 0,
        y: 24,
        duration: DURATION.normal,
        stagger: DURATION.stagger,
        ease: EASING.primary,
        clearProps: 'all',
        scrollTrigger: {
          trigger: el.current,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: el }
  );

  return (
    <Component ref={el} className={className} {...props}>
      {children}
    </Component>
  );
};

// ─── StaggerItem (wrapper de compatibilidad) ──────────────────────────────────

export const StaggerItem = ({ children, className = '', as: Component = 'div', ...props }) => (
  <Component className={className} {...props}>
    {children}
  </Component>
);

// ─── PageTransition ───────────────────────────────────────────────────────────

export const PageTransition = ({ children, className = '', as: Component = 'div', ...props }) => {
  const el = useRef(null);

  useGSAP(
    () => {
      gsap.from(el.current, {
        opacity: 0,
        y: 24,
        duration: DURATION.slow,
        ease: EASING.primary,
        clearProps: 'all',
      });
    },
    { scope: el }
  );

  return (
    <Component ref={el} className={className} {...props}>
      {children}
    </Component>
  );
};

// ─── ScaleIn ──────────────────────────────────────────────────────────────────

export const ScaleIn = ({ children, className = '', as: Component = 'div', delay = 0, ...props }) => {
  const el = useRef(null);

  useGSAP(
    () => {
      gsap.from(el.current, {
        opacity: 0,
        scale: 0.88,
        duration: DURATION.normal,
        ease: EASING.back,
        delay,
        clearProps: 'all',
        scrollTrigger: {
          trigger: el.current,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: el }
  );

  return (
    <Component ref={el} className={className} {...props}>
      {children}
    </Component>
  );
};

// ─── Toast ────────────────────────────────────────────────────────────────────

export const Toast = ({ children, className = '', as: Component = 'div', ...props }) => {
  const el = useRef(null);

  useGSAP(
    () => {
      gsap.from(el.current, {
        opacity: 0,
        y: 40,
        scale: 0.92,
        duration: DURATION.normal,
        ease: EASING.back,
        clearProps: 'all',
      });
    },
    { scope: el }
  );

  return (
    <Component ref={el} className={className} {...props}>
      {children}
    </Component>
  );
};

// ─── HoverCard ────────────────────────────────────────────────────────────────

export const HoverCard = ({ children, className = '', as: Component = 'div', ...props }) => {
  const el = useRef(null);

  const onMouseEnter = () => {
    gsap.to(el.current, {
      y: -8,
      scale: 1.02,
      duration: DURATION.normal,
      ease: EASING.smooth,
      overwrite: 'auto',
    });
  };

  const onMouseLeave = () => {
    gsap.to(el.current, {
      y: 0,
      scale: 1,
      duration: DURATION.normal,
      ease: EASING.smooth,
      overwrite: 'auto',
    });
  };

  return (
    <Component ref={el} className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} {...props}>
      {children}
    </Component>
  );
};

// ─── MotionButton ─────────────────────────────────────────────────────────────

export const MotionButton = ({ children, className = '', onClick, type = 'button', disabled = false, ...props }) => {
  const btn = useRef(null);

  const onMouseDown = () => gsap.to(btn.current, { scale: 0.95, duration: 0.1, ease: 'power2.in' });
  const onMouseUp = () => gsap.to(btn.current, { scale: 1, duration: 0.15, ease: EASING.back });

  return (
    <button
      ref={btn}
      className={className}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      type={type}
      disabled={disabled}
      {...props}>
      {children}
    </button>
  );
};

// ─── AnimatePresence (stub de compatibilidad) ─────────────────────────────────
export const AnimatePresence = ({ children }) => <>{children}</>;

/** Proxy de compatibilidad para <motion.tag> */
const motionProxy = new Proxy(
  {},
  {
    get: (target, prop) => {
      return ({ children, ...props }) => {
        // Filtramos props de Framer Motion que no son válidas en el DOM
        const validProps = { ...props };
        [
          'initial',
          'animate',
          'exit',
          'variants',
          'transition',
          'whileHover',
          'whileTap',
          'layout',
          'viewport',
          'drag',
          'dragConstraints',
          'dragElastic',
          'dragMomentum',
          'onAnimationStart',
          'onAnimationComplete',
          'onUpdate',
        ].forEach(key => delete validProps[key]);

        const Component = prop;
        return <Component {...validProps}>{children}</Component>;
      };
    },
  }
);

export const motion = motionProxy;
