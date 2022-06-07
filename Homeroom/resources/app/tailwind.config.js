const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js, jsx, ts, tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        "border-horizontal": "left-right-border 1s linear",
        "border-vertical": "top-bottom-border 1s linear",
      },
      keyframes: {
        "left-right-border": {
          "0%": { transform: "scaleX(0)", "transform-origin": "left" },
          "100%": { transform: "scaleX(1)", "transform-origin": "left" },
        },
        "top-bottom-border": {
          "0%": { transform: "scaleY(0)", "transform-origin": "top" },
          "100%": { transform: "scaleY(1)", "transform-origin": "top" },
        },
      },
      colors: {
        primary: colors.purple,
        secondary: colors.green,
        dark: colors.neutral,
        lt: colors.slate,
        text: colors.gray,
      },
      gridTemplateRows: {
        8: "repeat(8, minmax(0, 1fr))",
        10: "repeat(10, minmax(0, 1fr))",
        12: "repeat(12, minmax(0, 1fr))",
      },
      gridTemplateCols: {
        8: "repeat(8, minmax(0, 1fr))",
        10: "repeat(10, minmax(0, 1fr))",
        12: "repeat(12, minmax(0, 1fr))",
      },
      gridRow: {
        "span-7": "span 7 / span 7",
        "span-8": "span 8 / span 8",
        "span-9": "span 9 / span 9",
        "span-10": "span 10 / span 10",
        "span-11": "span 11 / span 11",
        "span-12": "span 12 / span 12",
      },
      gridCol: {
        "span-7": "span 7 / span 7",
        "span-8": "span 8 / span 8",
        "span-9": "span 9 / span 9",
        "span-10": "span 10 / span 10",
        "span-11": "span 11 / span 11",
        "span-12": "span 12 / span 12",
      },
    },
  },
  plugins: [],
};
