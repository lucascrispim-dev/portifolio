"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AchievementCard } from "@/components/game/AchievementCard";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { playEffect } from "@/lib/audio";
import type { Achievement } from "@/types/game";

const STARS_REQUIRED = 13;

/** Posições fixas em porcentagem — nada de aleatório durante a renderização. */
const STAR_SPOTS = [
  { x: 18, y: 12 }, { x: 72, y: 18 }, { x: 40, y: 26 }, { x: 84, y: 34 },
  { x: 12, y: 38 }, { x: 58, y: 44 }, { x: 30, y: 52 }, { x: 78, y: 58 },
  { x: 20, y: 64 }, { x: 64, y: 70 }, { x: 44, y: 76 }, { x: 86, y: 82 },
  { x: 26, y: 88 },
];

const ENCHANTED: Achievement = {
  id: "enchanted",
  title: "ENCHANTED",
  description: "Você tocou em treze estrelas. Taylor aprovaria.",
};

export function StarCursor({
  onDone,
  onAchievement,
}: {
  onDone: () => void;
  onAchievement: (id: string) => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [touched, setTouched] = useState<number[]>([]);

  const complete = touched.length >= STARS_REQUIRED;

  function touch(index: number) {
    if (touched.includes(index)) return;
    playEffect("tap");
    setTouched((t) => [...t, index]);
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs tracking-[0.25em] opacity-70">
          ENCHANTED CURSOR
        </p>
        <p className="text-[15px] opacity-90">
          Treze estrelas apareceram. Toque em todas.
        </p>
        <p className="font-mono text-xs opacity-60 tabular-nums">
          {touched.length} / {STARS_REQUIRED}
        </p>
      </div>

      <div className="relative min-h-[320px] flex-1">
        {STAR_SPOTS.map((spot, index) => {
          const isOn = touched.includes(index);
          if (isOn) return null;
          return (
            <motion.button
              key={index}
              type="button"
              onClick={() => touch(index)}
              aria-label={`Estrela ${index + 1}`}
              className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center focus-visible:outline focus-visible:outline-2"
              style={{ left: `${spot.x}%`, top: `${spot.y}%`, color: theme.accent }}
              animate={
                reducedMotion ? undefined : { opacity: [0.45, 1, 0.45], scale: [0.9, 1.1, 0.9] }
              }
              transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.12 }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="currentColor">
                <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />
              </svg>
            </motion.button>
          );
        })}
      </div>

      {complete ? (
        <div className="flex flex-col gap-5">
          <AchievementCard achievement={ENCHANTED} onUnlock={onAchievement} />
          <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
        </div>
      ) : null}
    </div>
  );
}
