const NICE_COLORS = [
  "#FF6B6B", // rojo coral
  "#FFD93D", // amarillo cálido
  "#6BCB77", // verde fresco
  "#4D96FF", // azul brillante
  "#9D4EDD", // púrpura
  "#FF9F1C", // naranja vibrante
  "#38BDF8", // celeste
  "#F472B6", // rosado
  "#34D399", // verde menta
  "#FACC15"  // dorado
];

export function getNiceColor(): string {
  const randomIndex = Math.floor(Math.random() * NICE_COLORS.length);
  return NICE_COLORS[randomIndex];
}

export function generateNiceHexColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 60 + Math.floor(Math.random() * 20); // 60–80%
  const lightness = 50 + Math.floor(Math.random() * 10); // 50–60%
  return hslToHex(hue, saturation, lightness);
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const color = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
