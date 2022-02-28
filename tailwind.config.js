const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js, jsx, ts, tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: colors.amber,
        secondary: colors.cyan,
        background: colors.stone,
        text: colors.slate,
      },
    },
  },
  plugins: [],
};
