import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── 1. TextReveal ────────────────────────────────────────────────────────────
// Revela un texto animando cada letra o palabra de manera individual

export const TextReveal = ({
  text,
  splitBy = "word",
  as: Component = "h2",
  staggerDelay = 0.05,
  delay = 0,
  once = true,
  allowWrap = true,
  className = "",
  ...props
}) => {
  const container = useRef(null);
  const units = splitBy === "char" ? text.split("") : text.split(" ");

  useGSAP(
    () => {
      const targets = container.current.querySelectorAll(".reveal-unit-inner");

      gsap.from(targets, {
        y: 40,
        opacity: 0,
        rotateX: 45,
        duration: 0.8,
        stagger: staggerDelay,
        delay,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: container.current,
          start: "top 88%",
          toggleActions: once
            ? "play none none none"
            : "play none none reverse",
        },
      });
    },
    { scope: container },
  );

  return (
    <Component
      ref={container}
      className={className}
      style={{
        perspective: "800px",
        display: "flex",
        flexWrap: allowWrap ? "wrap" : "nowrap",
      }}
      aria-label={text}
      {...props}
    >
      {units.map((unit, i) => (
        <span
          key={`wrapper-${i}`}
          className="reveal-unit-wrapper"
          style={{
            display: "inline-block",
            overflow: "hidden",
            padding: "0.05em 0.15em",
            margin: "-0.05em -0.15em",
            marginRight: splitBy === "word" ? "0.25em" : "0",
            whiteSpace: "pre",
          }}
        >
          <span
            className="reveal-unit-inner"
            style={{
              display: "inline-block",
              willChange: "opacity, transform",
            }}
          >
            {unit}
          </span>
        </span>
      ))}
    </Component>
  );
};

// ─── 2. ScrollReveal ──────────────────────────────────────────────────────────
// Hace aparecer contenido a medida que el usuario hace scroll hacia abajo

export const ScrollReveal = ({
  children,
  direction = "up",
  distance = 60,
  delay = 0,
  duration = 0.8,
  once = true,
  className = "",
  as: Component = "div",
  ...props
}) => {
  const el = useRef(null);

  useGSAP(
    () => {
      const fromVars = {
        opacity: 0,
        duration,
        delay,
        ease: "power2.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: el.current,
          start: "top 92%",
          toggleActions: once
            ? "play none none none"
            : "play none none reverse",
        },
      };

      if (direction === "up") fromVars.y = distance;
      if (direction === "down") fromVars.y = -distance;
      const horizontalDistance =
        window.innerWidth < 640 ? 0 : distance;
      if (direction === "left") fromVars.x = horizontalDistance;
      if (direction === "right") fromVars.x = -horizontalDistance;
      if (direction === "scale") fromVars.scale = 0.9;

      gsap.from(el.current, fromVars);
    },
    { scope: el },
  );

  return (
    <Component ref={el} className={className} {...props}>
      {children}
    </Component>
  );
};


// ─── 4. ParallaxImage ─────────────────────────────────────────────────────────
// Efecto parallax específico para imágenes, moviéndolas ligeramente dentro de su contenedor al hacer scroll

export const ParallaxImage = ({
  src,
  alt = "",
  speed = 80,
  className = "",
  imageClassName = "",
  ...props
}) => {
  const container = useRef(null);
  const image = useRef(null);

  useGSAP(
    () => {
      // Movimiento parallax fluido al hacer scroll
      gsap.to(image.current, {
        yPercent: speed / 10,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Animación de aparición al entrar en vista
      gsap.from(image.current, {
        scale: 1.2,
        duration: 1.5,
        ease: "power2.out",
        clearProps: "scale",
        scrollTrigger: {
          trigger: container.current,
          start: "top 92%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: container },
  );

  return (
    <div ref={container} className={`overflow-hidden ${className}`} {...props}>
      <img
        ref={image}
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover scale-[1.15] ${imageClassName}`}
        style={{ willChange: "transform" }}
      />
    </div>
  );
};


// ─── 6. Marquee ───────────────────────────────────────────────────────────────
// Texto en movimiento continuo de un lado a otro de la pantalla (como un ticker de noticias)

export const Marquee = ({
  text,
  speed = 40,
  reverse = false,
  separator = "✦",
  className = "",
  textClassName = "",
  ...props
}) => {
  const container = useRef(null);
  const track = useRef(null);
  const repeated = Array(6).fill(`${text} ${separator} `).join("");

  useGSAP(
    () => {
      const xDist = track.current.offsetWidth / 2;

      gsap.set(track.current, { x: reverse ? 0 : -xDist });

      gsap.to(track.current, {
        x: reverse ? -xDist : 0,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className={`max-w-full overflow-hidden overflow-x-clip whitespace-nowrap [contain:paint] ${className}`}
      {...props}
    >
      <div ref={track} className="inline-flex will-change-transform">
        <span className={`inline-block ${textClassName}`}>{repeated}</span>
        <span className={`inline-block ${textClassName}`}>{repeated}</span>
      </div>
    </div>
  );
};


// ─── 8. MagneticButton ────────────────────────────────────────────────────────
// Botón interactivo que es "atraído" por el puntero del ratón cuando pasas por encima

export const MagneticButton = ({
  children,
  strength = 40,
  className = "",
  onClick,
  as: Component = "button",
  ...props
}) => {
  const button = useRef(null);

  const onMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = button.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);

    gsap.to(button.current, {
      x: x * (strength / 100),
      y: y * (strength / 100),
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const onMouseLeave = () => {
    gsap.to(button.current, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.3)",
      overwrite: "auto",
    });
  };

  return (
    <Component
      ref={button}
      className={className}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ willChange: "transform", display: "inline-block" }}
      {...props}
    >
      {children}
    </Component>
  );
};

// ─── 9. LineReveal ────────────────────────────────────────────────────────────
// Anima una línea decorativa haciéndola crecer de forma fluida (horizontal o verticalmente)

export const LineReveal = ({
  orientation = "horizontal",
  delay = 0,
  duration = 1.2,
  once = true,
  className = "",
  ...props
}) => {
  const line = useRef(null);
  const isHorizontal = orientation === "horizontal";

  useGSAP(
    () => {
      gsap.from(line.current, {
        scaleX: isHorizontal ? 0 : 1,
        scaleY: isHorizontal ? 1 : 0,
        duration,
        delay,
        ease: "expo.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: line.current,
          start: "top 92%",
          toggleActions: once
            ? "play none none none"
            : "play none none reverse",
        },
      });
    },
    { scope: line },
  );

  return (
    <div
      ref={line}
      className={className}
      style={{
        transformOrigin: "left center",
        willChange: "transform",
        width: isHorizontal ? "100%" : "1px",
        height: isHorizontal ? "1px" : "100%",
      }}
      {...props}
    />
  );
};

// ─── 10. ScrollProgress ───────────────────────────────────────────────────────
// Barra de carga fija en la parte superior que muestra cuánto scroll hemos hecho en la página actual

export const ScrollProgress = ({ className = "", ...props }) => {
  const line = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      line.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      },
    );
  });

  return (
    <div
      ref={line}
      className={`fixed top-0 left-0 right-0 h-[2px] bg-primary z-[100] origin-left ${className}`}
      {...props}
    />
  );
};
