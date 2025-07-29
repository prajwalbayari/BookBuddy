/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  safelist: [
    {
      pattern:
        /(bg|text|hover:bg|focus:ring|border)-primary-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern:
        /(bg|text|hover:bg|focus:ring|border)-secondary-(50|100|200|300|400|500|600|700|800|900)/,
    },
  ],

  theme: {
    extend: {
      screens: {
        'admin': '1080px', // Custom breakpoint for admin layout
        '3xl': '1600px',
        '4xl': '1920px',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
        '10xl': '104rem',
      },
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        secondary: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        popup: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      },
      animation: {
        popup: 'popup 0.3s ease-out forwards',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
