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
        },
      },
      "dark",
      "cupcake",
    ],
  },
}

