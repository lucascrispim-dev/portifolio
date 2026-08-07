"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AchievementCard } from "@/components/game/AchievementCard";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { ConfettiExplosion } from "@/components/game/ConfettiExplosion";
import { NarratorText } from "@/components/game/NarratorText";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { playEffect } from "@/lib/audio";
import type { Achievement } from "@/types/game";

const PAPER_RINGS: Achievement = { id: "paper-rings", title: "PAPER RINGS" };

type RingKind = "explodes" | "flees" | "spins" | "plain" | "prize";

/** Cada anel se comporta mal de um jeito diferente. */
const RINGS: RingKind[] = [
  "plain",
  "explodes",
  "plain",
  "flees",
  "spins",
  "plain",
  "prize",
  "plain",
];

export function PaperRingsChaos({
  onDone,
  onAchievement,
}: {
  onDone: () => void;
  onAchievement: (id: string) => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [exploded, setExploded] = useState<number[]>([]);
  const [fleeCount, setFleeCount] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [found, setFound] = useState(false);

  function tap(index: number, kind: RingKind) {
    if (found) return;
    switch (kind) {
      case "prize":
        playEffect("confirm");
        setFound(true);
        return;
      case "explodes":
        playEffect("escape");
        setExploded((e) => (e.includes(index) ? e : [...e, index]));
        setMessage("Esse não era.");
        return;
      case "flees":
        playEffect("escape");
        setFleeCount((c) => c + 1);
        setMessage("Ele fugiu.");
        return;
      case "spins":
        playEffect("tap");
        setMessage("Está girando. Não ajuda.");
        return;
      default:
        playEffect("tap");
        setMessage("Nada.");
    }
  }

  if (found) {
    return (
      <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
        <ConfettiExplosion originXPercent={50} originYPercent={12} />
        <NarratorText
          lines={[
            { text: "Não significa nada.", pause: "short" },
            { text: "Pare de criar teorias.", pause: "long" },
          ]}
        />
        <AchievementCard achievement={PAPER_RINGS} onUnlock={onAchievement} />
        <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <p className="font-mono text-xs tracking-[0.25em] opacity-70">
        OBJETOS NÃO CATALOGADOS
      </p>

      <div className="grid grid-cols-4 gap-3">
        {RINGS.map((kind, index) => {
          if (exploded.includes(index)) {
            return <span key={index} aria-hidden className="aspect-square" />;
          }
          const fleeing = kind === "flees";
          return (
            <motion.button
              key={index}
              type="button"
              onClick={() => tap(index, kind)}
              aria-label={`Anel ${index + 1}`}
              animate={
                reducedMotion
                  ? undefined
                  : kind === "spins"
                    ? { rotate: 360 }
                    : fleeing
                      ? { x: (fleeCount % 2 === 0 ? 1 : -1) * 18 * fleeCount }
                      : undefined
              }
              transition={
                kind === "spins"
                  ? { duration: 3, repeat: Infinity, ease: "linear" }
                  : { duration: 0.25 }
              }
              className="flex aspect-square min-h-11 items-center justify-center focus-visible:outline focus-visible:outline-2"
              style={{ color: theme.foreground }}
            >
              {kind === "prize" ? (
                <span
                  className="font-mono text-lg font-bold tabular-nums"
                  style={{ color: theme.accent }}
                >
                  13
                </span>
              ) : (
                <svg viewBox="0 0 40 40" width="32" height="32" aria-hidden>
                  <circle
                    cx="20"
                    cy="20"
                    r="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                </svg>
              )}
            </motion.button>
          );
        })}
      </div>

      {message ? (
        <p aria-live="polite" className="text-center text-sm italic opacity-75">
          {message}
        </p>
      ) : null}
    </div>
  );
}
