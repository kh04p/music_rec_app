/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html",
    "./static/src/**/*.js"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'space': "url('./images/bg.jpg')",
      },
    },
  },
  plugins: [],
}

