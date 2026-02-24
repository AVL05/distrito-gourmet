export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Bar-X / Ricard Camarena inspired fine dining palette
        primary: "#B89065", // Elegant muted camel/gold
        "primary-hover": "#9C774F", // Deeper gold for hover
        "bg-body": "#F8F6F0", // Very elegant light linen/oatmeal
        "bg-surface": "#FFFFFF", // Pure white for cards and contrast
        "text-main": "#1A1A1A", // Classic almost black for stark elegant contrast
        "text-muted": "#666666", // Sophisticated neutral gray
      },
      fontFamily: {
        heading: ['"Cinzel"', "serif"],
        body: ['"Manrope"', "sans-serif"],
      },
      // Any animations
      animation: {
        "fade-in": "fadeIn 0.8s ease forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
