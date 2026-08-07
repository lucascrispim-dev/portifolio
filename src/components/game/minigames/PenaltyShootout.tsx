"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AchievementCard } from "@/components/game/AchievementCard";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { NarratorText } from "@/components/game/NarratorText";
import { ConfettiExplosion } from "@/components/game/ConfettiExplosion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { playEffect } from "@/lib/audio";
import type { Achievement } from "@/types/game";

const TRICOLOR: Achievement = { id: "tricolor", title: "TRICOLOR" };

const SPOTS = ["ESQUERDA", "MEIO", "DIREITA"] as const;

/**
 * Era V — pênalti roteirizado: o goleiro defende as duas primeiras e a
 * terceira é sempre gol, escolha ele o canto que escolher. A frustração
 * é de propósito, e a vitória também.
 */
export function PenaltyShootout({
  onDone,
  onAchievement,
  onPatienceDrop,
}: {
  onDone: () => void;
  onAchievement: (id: string) => void;
  onPatienceDrop: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<"none" | "saved" | "goal">("none");

  const scored = result === "goal";

  function shoot() {
    if (scored) return;
    const next = attempt + 1;
    setAttempt(next);
    if (next < 3) {
      playEffect("escape");
      if (next === 1) onPatienceDrop();
      setResult("saved");
      return;
    }
    playEffect("confirm");
    setResult("goal");
  }

  if (scored) {
    return (
      <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
        <ConfettiExplosion originXPercent={50} originYPercent={15} />
        <p className="font-mono text-2xl tracking-[0.25em] text-white">GOL</p>
        <AchievementCard achievement={TRICOLOR} onUnlock={onAchievement} />
        <ChoiceButton onClick={onDone}>CONTINUAR</ChoiceButton>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <p className="font-mono text-xs tracking-[0.25em] opacity-70">
        COBRANÇA DE PÊNALTI
      </p>

      {/* Gol estilizado em vermelho, branco e preto. */}
      <div
        className="relative h-32 w-full border-4 border-white/80"
        style={{ backgroundColor: "#00000055" }}
        aria-hidden
      >
        <motion.div
          className="absolute top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-red-600"
          animate={{
            left:
              result === "saved"
                ? ["45%", `${20 + attempt * 30}%`]
                : "45%",
          }}
          transition={{ duration: reducedMotion ? 0 : 0.4 }}
        />
      </div>

      {result === "saved" ? (
        <NarratorText
          key={attempt}
          lines={[
            { text: attempt === 1 ? "Defendeu." : "Defendeu novamente.", pause: "short" },
          ]}
        />
      ) : null}

      <div className="flex flex-col gap-3">
        {SPOTS.map((spot) => (
          <ChoiceButton key={spot} variant="secondary" onClick={shoot}>
            {spot}
          </ChoiceButton>
        ))}
      </div>
    </div>
  );
}
