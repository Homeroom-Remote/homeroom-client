// For elements that don't support tailwind and need hex

const rgba2hex = (rgba) =>
  `#${rgba
    .match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)
    .slice(1)
    .map((n, i) =>
      (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n))
        .toString(16)
        .padStart(2, "0")
        .replace("NaN", "")
    )
    .join("")}`;

export default function getBackgroundColor() {
  const ele = document.getElementById("static-background-style");
  if (!ele) return "#3f3f3f";
  return rgba2hex(
    window?.getComputedStyle().getPropertyValue("background-color")
  );
}
