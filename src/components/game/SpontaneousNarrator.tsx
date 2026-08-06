"use client";

import { motion } from "framer-motion";
import { bonusNarratorLines } from "@/config/project";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Mensagens espontâneas do narrador (roteiro, seção 17). A escolha é
 * determinística a partir de `seed` — nada de `Math.random()` durante a
 * renderização, que além de impuro faria a frase trocar a cada re-render.
 */
export function SpontaneousNarrator({
  seed,
  lines = bonusNarratorLines,
  className = "",
}: {
  seed: number;
  lines?: string[];
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  if (lines.length === 0) return null;

  const index = ((seed % lines.length) + lines.length) % lines.length;

  return (
    <motion.p
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 0.65 }}
      transition={{ duration: 1.2, delay: 0.8 }}
      className={`text-center text-sm italic ${className}`}
    >
      {lines[index]}
    </motion.p>
  );
}
