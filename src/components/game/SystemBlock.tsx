"use client";

import { motion } from "framer-motion";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Bloco monoespaçado do "sistema" (ARQUIVO LOCALIZADO, AVISO DO SISTEMA,
 * ORIGEM IDENTIFICADA...). As linhas entram em sequência.
 */
export function SystemBlock({
  lines,
  className = "",
}: {
  lines: string[];
  className?: string;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={`flex flex-col gap-1 border-l-2 pl-3 font-mono text-sm ${className}`}
      style={{ borderColor: theme.accent }}
    >
      {lines.map((line, index) => (
        <motion.p
          key={`${index}-${line}`}
          initial={reducedMotion ? false : { opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: reducedMotion ? 0 : index * 0.35 }}
          className="whitespace-pre-line tracking-wide"
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}
