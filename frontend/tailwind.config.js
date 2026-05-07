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
        // Logo inspired fine dining palette
        primary: "#A68A56", // Gold/Bronze from keys & plate
        "primary-hover": "#8D7344", // Darker gold for hover
        "bg-body": "#FCFBF8", // Warm creamy textured background
        "bg-surface": "#FFFFFF", // Pure white for cards/layers
        "text-main": "#224032", // Deep brand green from 'DISTRITO' text
        "text-muted": "#4A504A", // Darker elegant gray for better contrast
      },
      fontFamily: {
        heading: ['"Playfair Display"', "serif"],
        body: ['"Inter"', "sans-serif"],
      },
      // Any animations
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
