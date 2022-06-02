import { useEffect, useState } from "react";
// For elements that don't support tailwind and need hex

export default function UseBackgroundColor() {
  const [bg, setBg] = useState("#4e4e4e");
  const [bgEl, setBgEl] = useState(null);

  useEffect(() => {
    const staticBg = document.getElementById("static-background-style");
    if (!staticBg) return;
    console.log(staticBg);
    new MutationObserver((mutations) => {
      console.log(mutations);
    }).observe(staticBg, { attributes: true });
  }, []);

  useEffect(() => {
    console.log(getBackgroundColor(bgEl));
  }, [bgEl]);

  return { bg: bg };
}

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

function getBackgroundColor() {
  const ele = document.getElementById("static-background-style");

  if (!ele) return "#3f3f3f";
  return rgba2hex(
    window.getComputedStyle(ele).getPropertyValue("background-color")
  );
}
