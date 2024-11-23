/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./sources/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),      // Plugin de formularios
  ],
}

