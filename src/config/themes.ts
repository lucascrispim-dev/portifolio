import type { EraTheme, PlayableEraId } from "@/types/game";

/**
 * Sistema de temas das 8 Eras jogáveis. Cada Era muda fundo, contraste,
 * cor de destaque, textura, forma dos cartões (radius) e tipografia de
 * título — não é apenas uma troca de cor de fundo. As famílias
 * tipográficas referenciam variáveis CSS registradas em layout.tsx.
 *
 * As Eras IX a XIII não têm tema porque nunca são jogadas: existem apenas
 * como nomes no mapa de progresso.
 */
export const eraThemes: Record<PlayableEraId, EraTheme> = {
  1: {
    background: "#A8BFA0",
    backgroundGradient:
      "linear-gradient(160deg, #dce8d5 0%, #a8bfa0 55%, #758c70 100%)",
    foreground: "#1F2A1F",
    accent: "#F4E7C5",
    secondary: "#FFFFFF",
    buttonTextColor: "#F4E7C5",
    accentTextColor: "#1F2A1F",
    texture: "paper",
    titleFontFamily: "var(--font-era1-title), cursive",
    bodyFontFamily: "var(--font-body), sans-serif",
    radius: 22,
  },
  2: {
    background: "#D6B45F",
    backgroundGradient:
      "linear-gradient(160deg, #f1dba0 0%, #d6b45f 55%, #a5813a 100%)",
    foreground: "#2A2107",
    accent: "#FFF4CF",
    secondary: "#6B4A17",
    buttonTextColor: "#FFF4CF",
    accentTextColor: "#2A2107",
    texture: "grain",
    titleFontFamily: "var(--font-era2-title), serif",
    bodyFontFamily: "var(--font-body), sans-serif",
    radius: 16,
  },
  3: {
    background: "#7B5A94",
    backgroundGradient:
      "linear-gradient(160deg, #a381bd 0%, #7b5a94 55%, #4c3560 100%)",
    foreground: "#F5EDFB",
    accent: "#DCC9ED",
    secondary: "#2E1F3D",
    buttonTextColor: "#2E1F3D",
    accentTextColor: "#2E1F3D",
    texture: "grain",
    titleFontFamily: "var(--font-era3-title), serif",
    bodyFontFamily: "var(--font-body), sans-serif",
    radius: 10,
  },
  4: {
    background: "#8E1B25",
    backgroundGradient:
      "linear-gradient(160deg, #b53b3f 0%, #8e1b25 55%, #4f0d13 100%)",
    foreground: "#FBEAEA",
    accent: "#F0C9C9",
    secondary: "#3D0B10",
    buttonTextColor: "#3D0B10",
    accentTextColor: "#3D0B10",
    texture: "grain",
    titleFontFamily: "var(--font-era4-title), sans-serif",
    bodyFontFamily: "var(--font-body), sans-serif",
    radius: 4,
  },
  5: {
    background: "#88BBD8",
    backgroundGradient:
      "linear-gradient(160deg, #cdeaf7 0%, #88bbd8 55%, #4f87ab 100%)",
    foreground: "#0F2733",
    accent: "#EAF7FF",
    secondary: "#1C3A4B",
    buttonTextColor: "#EAF7FF",
    accentTextColor: "#0F2733",
    texture: "polaroid",
    titleFontFamily: "var(--font-era5-title), sans-serif",
    bodyFontFamily: "var(--font-body), sans-serif",
    radius: 18,
  },
  6: {
    background: "#151515",
    backgroundGradient:
      "linear-gradient(160deg, #262626 0%, #151515 55%, #000000 100%)",
    foreground: "#EDEDED",
    accent: "#9A9A9A",
    secondary: "#2B2B2B",
    buttonTextColor: "#2B2B2B",
    accentTextColor: "#2B2B2B",
    texture: "grain",
    titleFontFamily: "var(--font-era6-title), monospace",
    bodyFontFamily: "var(--font-body), sans-serif",
    radius: 2,
  },
  7: {
    background: "#EFA8C7",
    backgroundGradient:
      "linear-gradient(160deg, #fbd7e8 0%, #efa8c7 55%, #cf7ca3 100%)",
    foreground: "#3A1626",
    accent: "#B8E1F2",
    secondary: "#5C2A44",
    buttonTextColor: "#B8E1F2",
    accentTextColor: "#3A1626",
    texture: "none",
    titleFontFamily: "var(--font-era7-title), serif",
    bodyFontFamily: "var(--font-body), sans-serif",
    radius: 26,
  },
  8: {
    background: "#85857F",
    backgroundGradient:
      "linear-gradient(160deg, #a3a39c 0%, #85857f 55%, #58584f 100%)",
    foreground: "#F2F0EA",
    accent: "#D8D3C8",
    secondary: "#3F3F3B",
    buttonTextColor: "#3F3F3B",
    accentTextColor: "#3F3F3B",
    texture: "manuscript",
    titleFontFamily: "var(--font-era8-title), serif",
    bodyFontFamily: "var(--font-body), sans-serif",
    radius: 6,
  },
};

/** Tema usado antes da Era I começar (boot, classificação, convite, termos). */
export const introTheme: EraTheme = {
  background: "#000000",
  foreground: "#EDEDED",
  accent: "#F4E7C5",
  secondary: "#8A8A8A",
  buttonTextColor: "#141414",
  accentTextColor: "#141414",
  texture: "none",
  titleFontFamily: "var(--font-system), monospace",
  bodyFontFamily: "var(--font-body), sans-serif",
  radius: 12,
};
