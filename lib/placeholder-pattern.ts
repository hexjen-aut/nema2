import type { CSSProperties } from "react";

/**
 * Motif "point coquille" (scallop stitch) au crochet, en SVG inline — sert de
 * fond aux emplacements photo tant que la cliente n'a pas mis les siennes.
 * Aucune dépendance externe : rien à héberger, rien qui puisse casser.
 */
export function stitchPattern(color: string, opacity = 0.16, size = 32): CSSProperties {
  const encodedColor = encodeURIComponent(color);
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>` +
    `<path d='M0 ${size * 0.75} Q${size * 0.25} ${size * 0.05} ${size * 0.5} ${size * 0.75} ` +
    `Q${size * 0.75} ${size * 0.05} ${size} ${size * 0.75}' fill='none' ` +
    `stroke='${encodedColor}' stroke-width='1.4' stroke-linecap='round' opacity='${opacity}'/>` +
    `</svg>`;

  return {
    backgroundImage: `url("data:image/svg+xml,${svg}")`,
    backgroundSize: `${size}px ${size}px`,
    backgroundRepeat: "repeat",
  };
}
