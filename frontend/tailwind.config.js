import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import aspectRatio from "@tailwindcss/aspect-ratio";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "2k": "1920px",
        "4k": "2560px",
        ultra: "3840px",
      },
      colors: {
        // Paleta de colores inspirada en la marca y alta gastronomía
        primary: "#A68A56", // Dorado/Bronce inspirado en los elementos del logo
        "primary-hover": "#8D7344", // Dorado oscuro para estados de interacción
        "bg-body": "#FCFBF8", // Fondo crema cálido con textura
        "bg-surface": "#FFFFFF", // Blanco puro para tarjetas y capas
        "text-main": "#224032", // Verde profundo corporativo del texto 'DISTRITO'
        "text-muted": "#4A504A", // Gris elegante oscuro para mejorar el contraste
      },
      fontFamily: {
        heading: ['"Playfair Display"', "serif"],
        body: ['"Inter"', "sans-serif"],
      },
      // Definiciones de animación
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [typography, forms, aspectRatio],
};
