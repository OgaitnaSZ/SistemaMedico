/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // importante para Angular
  ],
  darkMode: 'class', // <-- ESTA LÍNEA ACTIVA el modo oscuro por clase
  theme: {
    extend: {},
  },
  plugins: [],
}
