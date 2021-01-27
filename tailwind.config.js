module.exports = {
  purge: ["./src/renderer/*.vue", "./src/renderer/components/*.vue", "./src/renderer/views/*.vue"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      gray: {
        900: "#222222",
        800: "#555555",
        700: "#666666",
        600: "#777777",
        500: "#888888",
        400: "#9D9D9D",
        300: "#DCDCDC",
        200: "#DFDFDF",
        100: "#E4E4E4"
      },
      white: {
        DEFAULT: "#FFFFFF",
        100: "#FAFAFA"
      },
      blue: {
        DEFAULT: "#5871EF",
        100: "#6B83ED"
      },
      green: {
        code: "#00BC00",
        DEFAULT: "#3B9B58",
        100: "#48BC6B"
      }
    },
    extend: {
      spacing: {
        "15": "3.75rem",
        "29": "7.25rem"
      },
      borderWidth: {
        3: "3px"
      },
      fontFamily: {
        sans: ["Inter", "Helvetica", "Arial", "sans-serif"],
        mono: ["Inconsolata"]
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require("@tailwindcss/forms")]
};
