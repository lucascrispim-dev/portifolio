"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { playEffect } from "@/lib/audio";
import type { Badge } from "@/types/game";

export function BadgeCard({ badge }: { badge: Badge }) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    playEffect("badge");
  }, [badge.id]);

  return (
    <motion.div
      initial={reducedMotion ? false : { scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="flex flex-col items-center gap-2 text-center"
    >
      <span
        className="inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
        style={{ backgroundColor: theme.accent, color: theme.accentTextColor }}
      >
        🏆 {badge.title}
      </span>
      {badge.description ? (
        <p className="max-w-xs text-sm opacity-90">{badge.description}</p>
      ) : null}
    </motion.div>
  );
}
