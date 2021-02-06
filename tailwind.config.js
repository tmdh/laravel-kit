module.exports = {
  purge: {
    content: ["./src/renderer/*.vue", "./src/renderer/components/*.vue", "./src/renderer/views/*.vue"],
    options: {
      safelist: [/^text-terminal-/]
    }
  },
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
        100: "#EAEAEB"
      },
      white: {
        DEFAULT: "#FFFFFF",
        100: "#FAFAFA"
      },
      blue: {
        DEFAULT: "#5871EF",
        100: "#6B83ED"
      },
      cyan: "#5198BC",
      purple: "#C005BE",
      terminal: {
        green: "#50A14F",
        yellow: "#C18401",
        red: "#ff6666"
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
        mono: ["FiraCode"]
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require("@tailwindcss/forms")]
};
