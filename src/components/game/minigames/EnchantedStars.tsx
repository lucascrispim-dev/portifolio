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

const TOTAL = 13;
/** Depois de tantas fugas, a última estrela finalmente se deixa pegar. */
const DODGES_BEFORE_GIVING_IN = 3;

const ENCHANTED: Achievement = { id: "enchanted", title: "ENCHANTED" };

/** Posições fixas — nada de aleatório durante a renderização. */
const SPOTS = [
  { x: 18, y: 10 }, { x: 72, y: 16 }, { x: 40, y: 24 }, { x: 84, y: 32 },
  { x: 12, y: 38 }, { x: 58, y: 44 }, { x: 30, y: 52 }, { x: 78, y: 58 },
  { x: 20, y: 64 }, { x: 64, y: 70 }, { x: 44, y: 76 }, { x: 86, y: 82 },
];

/** Rota de fuga da décima terceira estrela. */
const ESCAPE_SPOTS = [
  { x: 26, y: 30 },
  { x: 80, y: 62 },
  { x: 16, y: 74 },
  { x: 52, y: 46 },
];

/**
 * Era III — treze estrelas, mas a última foge algumas vezes antes de
 * ceder. É irritação calculada: o jogo provoca e depois recompensa.
 */
export function EnchantedStars({
  onDone,
  onAchievement,
  onPatienceDrop,
}: {
  onDone: () => void;
  onAchievement: (id: string) => void;
  onPatienceDrop: () => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [touched, setTouched] = useState<number[]>([]);
  const [dodges, setDodges] = useState(0);
  const [lastCaught, setLastCaught] = useState(false);
  const [responseDone, setResponseDone] = useState(false);

  const allButLast = touched.length >= SPOTS.length;
  const taunted = dodges >= 2;

  function touch(index: number) {
    if (touched.includes(index)) return;
    playEffect("tap");
    setTouched((t) => [...t, index]);
  }

  function chaseLast() {
    if (dodges < DODGES_BEFORE_GIVING_IN) {
      playEffect("escape");
      const next = dodges + 1;
      setDodges(next);
      if (next === 1) onPatienceDrop();
      return;
    }
    playEffect("confirm");
    setLastCaught(true);
  }

  const count = touched.length + (lastCaught ? 1 : 0);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs tracking-[0.25em] opacity-70">
          ENCHANTED
        </p>
        <p className="text-[15px] opacity-90">Treze estrelas. Pegue todas.</p>
        <p className="font-mono text-xs tabular-nums opacity-60">
          {count} / {TOTAL}
        </p>
      </div>

      {!lastCaught ? (
        <div className="relative min-h-[340px] flex-1">
          {SPOTS.map((spot, index) =>
            touched.includes(index) ? null : (
              <motion.button
                key={index}
                type="button"
                onClick={() => touch(index)}
                aria-label={`Estrela ${index + 1}`}
                className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center focus-visible:outline focus-visible:outline-2"
                style={{ left: `${spot.x}%`, top: `${spot.y}%`, color: theme.accent }}
                animate={
                  reducedMotion ? undefined : { opacity: [0.5, 1, 0.5] }
                }
                transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.12 }}
              >
                <StarGlyph />
              </motion.button>
            )
          )}

          {allButLast ? (
            <motion.button
              type="button"
              onClick={chaseLast}
              aria-label="Estrela 13"
              className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center focus-visible:outline focus-visible:outline-2"
              style={{ color: theme.accent }}
              animate={{
                left: `${ESCAPE_SPOTS[dodges % ESCAPE_SPOTS.length].x}%`,
                top: `${ESCAPE_SPOTS[dodges % ESCAPE_SPOTS.length].y}%`,
              }}
              transition={{ duration: reducedMotion ? 0 : 0.32, ease: "easeOut" }}
            >
              <StarGlyph />
            </motion.button>
          ) : null}

          {taunted && !lastCaught ? (
            <p
              aria-live="polite"
              className="absolute inset-x-0 bottom-0 text-center text-sm italic opacity-80"
            >
              Tá ficando nervoso?
            </p>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-center gap-5">
          <NarratorText
            lines={[{ text: "13 / 13", pause: "short" }]}
            onDone={() => setResponseDone(true)}
          />
          {responseDone ? (
            <>
              <AchievementCard achievement={ENCHANTED} onUnlock={onAchievement} />
              <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

function StarGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="currentColor">
      <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />
    </svg>
  );
}
