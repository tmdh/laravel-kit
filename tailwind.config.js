module.exports = {
  purge: ["./src/renderer/*.vue", "./src/renderer/components/*.vue"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter"]
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
