"use client";

import { motion } from "framer-motion";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ProgressBar({
  durationMs = 900,
  onDone,
}: {
  durationMs?: number;
  onDone?: () => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="h-1.5 w-full max-w-xs overflow-hidden rounded-full"
      style={{ backgroundColor: `${theme.foreground}33` }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: theme.accent }}
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: reducedMotion ? 0.1 : durationMs / 1000, ease: "easeInOut" }}
        onAnimationComplete={onDone}
      />
    </div>
  );
}
