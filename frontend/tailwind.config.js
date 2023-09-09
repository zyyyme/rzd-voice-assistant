/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        rzd: {
          "primary": "#e21a1a",
          "secondary": "#fff",
          "accent": "#394a58",
          "neutral": "#2f2839",
          "base-100": "#fff",
          // "info": "#a7c8e6",
          // "success": "#248f5d",
          // "warning": "#dbad06",
          // "error": "#f92b06",
        },
      },
      // "light",
      "dark"
    ],
  },
}

