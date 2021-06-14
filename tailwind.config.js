module.exports = {
  purge: {
    content: ["./src/renderer/*.vue", "./src/renderer/components/*.vue", "./src/renderer/views/*.vue"]
  },
  darkMode: "class", // or 'media' or 'class'
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
        100: "#EAEAEB"
      },
      white: {
        DEFAULT: "#FFFFFF",
        100: "#FAFAFA"
      },
      blue: {
        DEFAULT: "#5871EF",
        100: "#6B83ED",
        200: "#3794ff"
      },
      terminal: {
        green: "#50A14F",
        yellow: "#C18401",
        red: "#ff6666",
        purple: "#C005BE",
        cyan: "#5198BC",
        d: { green: "#69FF94", yellow: "#F1FA8C", red: "#FF5555", purple: "#BD93F9", cyan: "#8BE9FD" }
      },
      black: "#000000",
      d: {
        blue: {
          100: "#6272A4",
          200: "#44475A",
          300: "#3C3D51",
          400: "#363949",
          500: "#343746",
          600: "#282A36",
          700: "#21222C",
          800: "#191A21"
        },
        gray: {
          100: "#CDCDCD",
          200: "#A7A7A7",
          300: "#202020"
        }
      }
    },
    extend: {
      spacing: {
        15: "3.75rem"
      },
      borderWidth: {
        1: "1px",
        3: "3px"
      },
      fontFamily: {
        sans: ["system-ui", "sans-serif"],
        mono: ["RobotoMono", "monospace"]
      }
    },
    screens: {
      md: { min: "934px" },
      sm: { min: "540px" }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require("@tailwindcss/forms")]
};
