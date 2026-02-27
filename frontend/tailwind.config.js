export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Logo inspired fine dining palette
        primary: '#A68A56', // Gold/Bronze from keys & plate
        'primary-hover': '#8D7344', // Darker gold for hover
        'bg-body': '#FCFBF8', // Warm creamy textured background
        'bg-surface': '#FFFFFF', // Pure white for cards/layers
        'text-main': '#224032', // Deep brand green from 'DISTRITO' text
        'text-muted': '#6D726D', // Complementary elegant gray
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      // Any animations
      animation: {
        'fade-in': 'fadeIn 0.8s ease forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms'), require('@tailwindcss/aspect-ratio')],
};
