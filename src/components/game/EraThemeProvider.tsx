"use client";

import {
  createContext,
  useContext,
  useEffect,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import type { EraTheme } from "@/types/game";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const EraThemeContext = createContext<EraTheme | null>(null);

export function useEraTheme(): EraTheme {
  const theme = useContext(EraThemeContext);
  if (!theme) {
    throw new Error("useEraTheme must be used within an EraThemeProvider");
  }
  return theme;
}

const textureOverlay: Partial<Record<EraTheme["texture"], CSSProperties>> = {
  paper: {
    backgroundImage:
      "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
    backgroundSize: "18px 18px",
    opacity: 0.25,
  },
  grain: {
    backgroundImage:
      "repeating-radial-gradient(circle at 20% 30%, rgba(255,255,255,0.06) 0, transparent 2px)",
    backgroundSize: "6px 6px",
    opacity: 0.4,
  },
  polaroid: {
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    opacity: 0.2,
  },
  manuscript: {
    backgroundImage:
      "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, transparent 1px, transparent 26px)",
    opacity: 0.3,
  },
};

export function EraThemeProvider({
  theme,
  children,
  blackout = false,
}: {
  theme: EraTheme;
  children: ReactNode;
  /** Cobre o tema com preto puro (sequência final da Era VIII). */
  blackout?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const overlay =
    !blackout && theme.texture !== "none" ? textureOverlay[theme.texture] : undefined;
  const backgroundValue = blackout
    ? "#000000"
    : (theme.backgroundGradient ?? theme.background);

  /**
   * Telas mais altas que a viewport (o mapa, por exemplo) precisam rolar.
   * No Safari do iPhone, `100dvh`/`min-height` num elemento aninhado às
   * vezes não repinta a área recém-exposta quando a barra de endereço
   * recolhe durante o scroll — sobra um vão preto abaixo do conteúdo
   * colorido. Espelhar a cor no `<body>` evita isso: o navegador sempre
   * pinta o body corretamente na área rolável inteira, então não existe
   * "atrás" descoberto para aparecer preto.
   */
  useEffect(() => {
    document.body.style.background = backgroundValue;
    return () => {
      document.body.style.background = "";
    };
  }, [backgroundValue]);

  return (
    <EraThemeContext.Provider value={theme}>
      <motion.div
        key={theme.background}
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.6 }}
        className="relative min-h-dvh w-full flex flex-col"
        style={{
          background: backgroundValue,
          color: theme.foreground,
          fontFamily: theme.bodyFontFamily,
        }}
      >
        {overlay ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={overlay}
          />
        ) : null}
        <div className="relative flex-1 flex flex-col">{children}</div>
      </motion.div>
    </EraThemeContext.Provider>
  );
}
