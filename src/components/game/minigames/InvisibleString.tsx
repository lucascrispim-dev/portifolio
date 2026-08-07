"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AchievementCard } from "@/components/game/AchievementCard";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { SystemBlock } from "@/components/game/SystemBlock";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { playEffect } from "@/lib/audio";
import type { Achievement } from "@/types/game";

const INVISIBLE_STRING: Achievement = {
  id: "invisible-string",
  title: "INVISIBLE STRING",
};

/** Pontos do fio, na ordem em que precisam ser tocados. */
const KNOTS = [
  { x: 14, y: 16, label: "TOY STORY" },
  { x: 68, y: 28, label: "PIZZA" },
  { x: 26, y: 44, label: "VILLA-LOBOS" },
  { x: 74, y: 58, label: "AUGUSTA" },
  { x: 34, y: 72, label: "LEITE" },
];

/**
 * Era VIII — seguir o fio com o dedo, ponto a ponto, até ele terminar
 * nos 99%. É a última e mais forte pista falsa: o jogo aponta
 * explicitamente para a Era XIII como lugar da resolução.
 */
export function InvisibleString({
  onDone,
  onAchievement,
  onTheOne,
}: {
  onDone: () => void;
  onAchievement: (id: string) => void;
  onTheOne: () => void;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [reached, setReached] = useState(0);
  const [theOneTapped, setTheOneTapped] = useState(false);

  const complete = reached >= KNOTS.length;

  function touch(index: number) {
    // Só aceita o próximo da sequência: é um fio, não uma coleção.
    if (index !== reached) return;
    playEffect("tap");
    setReached(index + 1);
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs tracking-[0.25em] opacity-70">
          INVISIBLE STRING
        </p>
        <p className="text-[15px] opacity-90">
          Existe um fio ligando tudo isso. Siga.
        </p>
      </div>

      {!complete ? (
        <div className="relative min-h-[340px] flex-1">
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polyline
              points={KNOTS.slice(0, Math.max(reached, 1))
                .map((k) => `${k.x},${k.y}`)
                .join(" ")}
              fill="none"
              stroke={theme.accent}
              strokeWidth="0.4"
              opacity="0.55"
            />
          </svg>

          {KNOTS.map((knot, index) => {
            const done = index < reached;
            const isNext = index === reached;
            return (
              <motion.button
                key={knot.label}
                type="button"
                onClick={() => touch(index)}
                aria-label={knot.label}
                className="absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 font-mono text-[10px] tracking-widest focus-visible:outline focus-visible:outline-2"
                style={{
                  left: `${knot.x}%`,
                  top: `${knot.y}%`,
                  minHeight: 44,
                  color: done ? theme.accent : theme.foreground,
                  opacity: done ? 0.9 : isNext ? 0.55 : 0.2,
                }}
                animate={
                  isNext && !reducedMotion ? { opacity: [0.35, 0.8, 0.35] } : undefined
                }
                transition={{ duration: 2, repeat: Infinity }}
              >
                {knot.label}
              </motion.button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <p className="font-mono text-[10px] tracking-[0.3em] opacity-60">
              O FIO TERMINA EM
            </p>
            <button
              type="button"
              onClick={() => {
                if (theOneTapped) return;
                playEffect("confirm");
                setTheOneTapped(true);
                onTheOne();
              }}
              aria-label="99 por cento"
              className="font-mono text-5xl tabular-nums focus-visible:outline focus-visible:outline-2"
              style={{ color: theme.accent }}
            >
              99%
            </button>
          </div>

          {theOneTapped ? (
            <NarratorText
              lines={[
                { text: "THE 1", pause: "short" },
                { text: "Ainda falta.", pause: "long" },
              ]}
            />
          ) : null}

          <SystemBlock lines={["Estimativa de resolução:", "ERA XIII"]} />

          <AchievementCard
            achievement={INVISIBLE_STRING}
            onUnlock={onAchievement}
          />
          <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
        </div>
      )}
    </div>
  );
}
