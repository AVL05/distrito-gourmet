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
        primary: "#A68A56",
        "primary-hover": "#8D7344",
        // Tono más luminoso para hovers sobre fondos oscuros (ej. sección negra del hero)
        "primary-light": "#C4A46E",
        "bg-body": "#FCFBF8",
        // Blanco cálido con matiz pergamino — evita el salto frío frente al fondo crema
        "bg-surface": "#F9F6F0",
        "text-main": "#224032",
        // Gris cálido con dominante marrón en lugar del sesgo verdoso anterior
        "text-muted": "#5C5448",
      },
      fontFamily: {
        heading: ['"Playfair Display"', "serif"],
        body: ['"Inter"', "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
        shimmer: "shimmer 1.8s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
    },
  },
  plugins: [typography, forms, aspectRatio],
};
