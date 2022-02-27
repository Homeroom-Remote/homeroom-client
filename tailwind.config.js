const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js, jsx, ts, tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        secondary: colors.orange,
        background: colors.stone,
        text: colors.slate,
      },
    },
  },
  plugins: [],
};
