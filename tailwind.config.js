const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js, jsx, ts, tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: colors.purple,
        secondary: colors.green,
        dark: colors.neutral,
        lt: colors.slate,
        text: colors.gray,
      },
    },
  },
  plugins: [],
};
