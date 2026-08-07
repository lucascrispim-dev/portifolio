"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AchievementCard } from "@/components/game/AchievementCard";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { playEffect } from "@/lib/audio";
import type { Achievement } from "@/types/game";

const RING_COUNT = 12;
/** Índice do anel que guarda o 13 — fixo, para o percurso ser reprodutível. */
const RING_WITH_13 = 7;

const PAPER_RINGS: Achievement = { id: "paper-rings", title: "PAPER RINGS" };

export function PaperRings({
  onDone,
  onAchievement,
}: {
  onDone: () => void;
  onAchievement: (id: string) => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [opened, setOpened] = useState<number[]>([]);
  const [found, setFound] = useState(false);

  function openRing(index: number) {
    if (found || opened.includes(index)) return;
    setOpened((o) => [...o, index]);
    if (index === RING_WITH_13) {
      playEffect("confirm");
      setFound(true);
    } else {
      playEffect("tap");
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs tracking-[0.25em] opacity-70">
          OBJETOS NÃO CATALOGADOS
        </p>
        <p className="text-[15px] opacity-90">Um deles guarda alguma coisa.</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: RING_COUNT }, (_, index) => {
          const isOpen = opened.includes(index);
          const isPrize = index === RING_WITH_13;
          return (
            <motion.button
              key={index}
              type="button"
              onClick={() => openRing(index)}
              aria-label={`Anel ${index + 1}`}
              whileTap={reducedMotion ? undefined : { scale: 0.92 }}
              className="flex aspect-square min-h-11 items-center justify-center focus-visible:outline focus-visible:outline-2"
              style={{ color: theme.foreground }}
            >
              {isOpen && isPrize ? (
                <span
                  className="font-mono text-xl font-bold tabular-nums"
                  style={{ color: theme.accent }}
                >
                  13
                </span>
              ) : (
                <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden>
                  <circle
                    cx="20"
                    cy="20"
                    r="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity={isOpen ? 0.25 : 0.85}
                  />
                </svg>
              )}
            </motion.button>
          );
        })}
      </div>

      {found ? (
        <div className="flex flex-col gap-5">
          <NarratorText
            lines={[
              { text: "Objeto localizado.", pause: "short" },
              { text: "Sem relevância aparente.", pause: "long" },
            ]}
          />
          <AchievementCard achievement={PAPER_RINGS} onUnlock={onAchievement} />
          <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
        </div>
      ) : null}
    </div>
  );
}
