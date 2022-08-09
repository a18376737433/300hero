/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/render/index.html', './src/render/**'],
  theme: {
    extend: {}
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        '.el-button': {
          'background-color': 'var(--el-button-bg-color)'
        }
      })
    }
  ]
}
