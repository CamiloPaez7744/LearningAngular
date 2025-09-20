// Tipos básicos de gráfico soportados
export type ChartType =
  | 'line1' // línea curva sin puntos
  | 'line2' // línea recta con puntos
  | 'line3' // línea curva con área
  | 'line4' // línea curva con puntos
  | 'line5' // línea recta con área
  | 'bar-vertical'
  | 'bar-horizontal'
  | 'pie'
  | 'doughnut'
  | 'scatter';

// Configuración genérica del dataset
export interface ChartData {
  labels?: string[]; // Eje X o nombres de categorías
  values: number[];  // Valores de la serie principal
  series?: { name: string; values: number[]; color?: string }[]; // múltiples series
}

// Configuración visual y de estilo
export interface ChartStyle {
  color?: string;       // color principal
  secondaryColor?: string; // color para contraste
  smooth?: boolean;     // curva o recta
  showPoints?: boolean; // mostrar círculos en los puntos
  showArea?: boolean;   // rellenar debajo de la línea
  showAxis?: boolean;   // mostrar ejes
  showTitle?: boolean;  // mostrar título
  title?: string;       // título del gráfico
  legend?: boolean;     // mostrar leyenda
  darkMode?: boolean;   // modo oscuro
}

// Configuración completa del gráfico
export interface ChartConfig {
  type: ChartType;
  data: ChartData;
  style?: ChartStyle;
}
